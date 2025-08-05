import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactFormRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiryType?: string;
  priority?: string;
  sourcePage?: string;
  utmData?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const body: ContactFormRequest = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get client information
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    // Determine priority based on inquiry type
    let priority = body.priority || 'normal';
    if (body.inquiryType === 'sales' || body.inquiryType === 'demo') {
      priority = 'high';
    }

    // Create contact submission record
    const submissionData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      company: body.company?.trim(),
      phone: body.phone?.trim(),
      subject: body.subject?.trim() || `${body.inquiryType || 'General'} Inquiry`,
      message: body.message.trim(),
      inquiry_type: body.inquiryType || 'general',
      priority: priority,
      status: 'new',
      source_page: body.sourcePage,
      utm_data: body.utmData || {},
      metadata: {
        ip_address: clientIP,
        user_agent: userAgent,
        submitted_at: new Date().toISOString(),
      },
    };

    // Insert contact submission
    const { data: submission, error: submissionError } = await supabase
      .from('contact_submissions')
      .insert(submissionData)
      .select()
      .single();

    if (submissionError) {
      console.error('Error creating contact submission:', submissionError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit contact form' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Also create/update lead record for sales inquiries
    if (body.inquiryType === 'sales' || body.inquiryType === 'demo') {
      const leadData = {
        email: body.email.toLowerCase().trim(),
        first_name: body.name.split(' ')[0],
        last_name: body.name.split(' ').slice(1).join(' ') || null,
        company: body.company,
        phone: body.phone,
        source: 'contact_form',
        campaign: body.inquiryType,
        utm_source: body.utmData?.utm_source,
        utm_medium: body.utmData?.utm_medium,
        utm_campaign: body.utmData?.utm_campaign,
        page_url: body.sourcePage,
        user_agent: userAgent,
        ip_address: clientIP,
        status: 'contacted',
        lead_score: body.inquiryType === 'demo' ? 80 : 60, // Higher score for demo requests
        notes: `Contact form inquiry: ${body.message}`,
      };

      // Check if lead exists
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', leadData.email)
        .single();

      if (existingLead) {
        // Update existing lead
        await supabase
          .from('leads')
          .update({
            ...leadData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingLead.id);
      } else {
        // Create new lead
        await supabase
          .from('leads')
          .insert(leadData);
      }
    }

    // Log analytics event
    await supabase.from('website_analytics').insert({
      event_name: 'contact_form_submitted',
      event_data: {
        submission_id: submission.id,
        inquiry_type: body.inquiryType,
        priority: priority,
      },
      page_url: body.sourcePage,
      user_agent: userAgent,
      ip_address: clientIP,
    });

    // TODO: Send notification email to sales team for high priority inquiries
    // TODO: Send auto-response email to user

    return new Response(
      JSON.stringify({ 
        success: true, 
        submissionId: submission.id,
        message: 'Contact form submitted successfully. We\'ll get back to you soon!',
        priority: priority
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})