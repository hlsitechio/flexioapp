import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DemoRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone?: string;
  jobTitle?: string;
  companySize?: string;
  industry?: string;
  useCase?: string;
  preferredDate?: string;
  preferredTime?: string;
  timezone?: string;
  demoType?: string;
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
    const body: DemoRequestBody = await req.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.company) {
      return new Response(
        JSON.stringify({ error: 'First name, last name, email, and company are required' }),
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

    // Parse preferred date if provided
    let preferredDate = null;
    if (body.preferredDate) {
      try {
        preferredDate = new Date(body.preferredDate).toISOString();
      } catch (error) {
        console.warn('Invalid preferred date:', body.preferredDate);
      }
    }

    // Create demo request record
    const demoRequestData = {
      first_name: body.firstName.trim(),
      last_name: body.lastName.trim(),
      email: body.email.toLowerCase().trim(),
      company: body.company.trim(),
      phone: body.phone?.trim(),
      job_title: body.jobTitle?.trim(),
      company_size: body.companySize,
      industry: body.industry,
      use_case: body.useCase?.trim(),
      preferred_date: preferredDate,
      preferred_time: body.preferredTime,
      timezone: body.timezone || 'UTC',
      demo_type: body.demoType || 'online',
      status: 'requested',
    };

    // Insert demo request
    const { data: demoRequest, error: demoError } = await supabase
      .from('demo_requests')
      .insert(demoRequestData)
      .select()
      .single();

    if (demoError) {
      console.error('Error creating demo request:', demoError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit demo request' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create/update lead record with high score
    const leadData = {
      email: body.email.toLowerCase().trim(),
      first_name: body.firstName.trim(),
      last_name: body.lastName.trim(),
      company: body.company.trim(),
      phone: body.phone,
      job_title: body.jobTitle,
      industry: body.industry,
      company_size: body.companySize,
      source: 'demo_request',
      campaign: 'demo',
      utm_source: body.utmData?.utm_source,
      utm_medium: body.utmData?.utm_medium,
      utm_campaign: body.utmData?.utm_campaign,
      user_agent: userAgent,
      ip_address: clientIP,
      status: 'qualified',
      lead_score: 90, // High score for demo requests
      notes: `Demo request: ${body.useCase || 'No specific use case provided'}`,
    };

    // Check if lead exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, lead_score')
      .eq('email', leadData.email)
      .single();

    if (existingLead) {
      // Update existing lead with higher score
      await supabase
        .from('leads')
        .update({
          ...leadData,
          lead_score: Math.max(existingLead.lead_score || 0, leadData.lead_score),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id);
    } else {
      // Create new lead
      await supabase
        .from('leads')
        .insert(leadData);
    }

    // Log analytics event
    await supabase.from('website_analytics').insert({
      event_name: 'demo_requested',
      event_data: {
        demo_request_id: demoRequest.id,
        company: body.company,
        industry: body.industry,
        company_size: body.companySize,
        demo_type: body.demoType,
      },
      user_agent: userAgent,
      ip_address: clientIP,
    });

    // TODO: Send notification to sales team
    // TODO: Send confirmation email to requester
    // TODO: Create calendar event if preferred date is provided

    return new Response(
      JSON.stringify({ 
        success: true, 
        demoRequestId: demoRequest.id,
        message: 'Demo request submitted successfully! Our sales team will contact you within 24 hours.',
        status: 'requested'
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Demo request error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})