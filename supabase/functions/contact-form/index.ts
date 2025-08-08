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

// Professional email alias mapping
function getFromAddress(inquiryType: string): string {
  switch (inquiryType) {
    case 'sales':
    case 'pricing':
    case 'demo':
      return 'FlexIO Sales <sales@yourdomain.com>'
    case 'support':
    case 'technical':
      return 'FlexIO Support <support@yourdomain.com>'
    case 'partnership':
    case 'business':
      return 'FlexIO Business <contact@yourdomain.com>'
    default:
      return 'FlexIO Contact <contact@yourdomain.com>'
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Simple rate limiting per IP
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  // deno-lint-ignore no-explicit-any
  const globalThisAny: any = globalThis as any;
  globalThisAny.__CONTACT_RATE__ ||= new Map<string, { count: number; windowStart: number }>();
  const store: Map<string, { count: number; windowStart: number }> = globalThisAny.__CONTACT_RATE__;
  const rec = store.get(ip) || { count: 0, windowStart: now };
  if (now - rec.windowStart > 60_000) { rec.windowStart = now; rec.count = 0; }
  rec.count++;
  store.set(ip, rec);
  if (rec.count > 30) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

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

    // Send notification email to sales team for high priority inquiries
    if (priority === 'high') {
  try {
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: getFromAddress(body.inquiryType || 'general'),
            to: 'hlarosesurprenant@gmail.com', // Your actual email (hidden from users)
            subject: `🚨 High Priority Contact - ${body.inquiryType} from ${body.name}`,
            html: `
              <h2>New High Priority Contact Form Submission</h2>
              <p><strong>Type:</strong> ${body.inquiryType}</p>
              <p><strong>Name:</strong> ${body.name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              ${body.company ? `<p><strong>Company:</strong> ${body.company}</p>` : ''}
              ${body.phone ? `<p><strong>Phone:</strong> ${body.phone}</p>` : ''}
              <p><strong>Subject:</strong> ${body.subject || 'No subject'}</p>
              <p><strong>Message:</strong></p>
              <p>${body.message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><small>Submission ID: ${submission.id}</small></p>
              <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
            `,
            tags: ['contact-form', 'high-priority', body.inquiryType],
          }),
        });
        
        if (!emailResponse.ok) {
          console.error('Failed to send notification email:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }
    }

    // Send auto-response email to user
    try {
      const autoReplyResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: getFromAddress(body.inquiryType || 'general'),
          to: body.email,
          subject: 'Thank you for contacting us!',
          html: `
            <h2>Thank you for reaching out, ${body.name}!</h2>
            <p>We have received your ${body.inquiryType || 'general'} inquiry and will respond within 24 hours.</p>
            
            <h3>Your Message Details:</h3>
            <p><strong>Subject:</strong> ${body.subject || `${body.inquiryType || 'General'} Inquiry`}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f5f5f5; padding: 10px; border-left: 3px solid #007bff;">
              ${body.message.replace(/\n/g, '<br>')}
            </p>
            
            ${priority === 'high' ? 
              '<p><strong>Priority:</strong> High - We will respond within 24 hours.</p>' : 
              '<p>We typically respond within 1-2 business days.</p>'
            }
            
            <p>Best regards,<br>The FlexIO Team</p>
            
            <hr>
            <p><small>Reference ID: ${submission.id}</small></p>
          `,
          tags: ['auto-reply', 'contact-form'],
        }),
      });
      
      if (!autoReplyResponse.ok) {
        console.error('Failed to send auto-reply email:', await autoReplyResponse.text());
      }
    } catch (emailError) {
      console.error('Error sending auto-reply email:', emailError);
    }

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