import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadCaptureRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  jobTitle?: string;
  industry?: string;
  companySize?: string;
  source: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
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
  globalThisAny.__LEAD_RATE__ ||= new Map<string, { count: number; windowStart: number }>();
  const store: Map<string, { count: number; windowStart: number }> = globalThisAny.__LEAD_RATE__;
  const rec = store.get(ip) || { count: 0, windowStart: now };
  if (now - rec.windowStart > 60_000) { rec.windowStart = now; rec.count = 0; }
  rec.count++;
  store.set(ip, rec);
  if (rec.count > 60) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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
    const body: LeadCaptureRequest = await req.json();

    // Validate required fields
    if (!body.email || !body.source) {
      return new Response(
        JSON.stringify({ error: 'Email and source are required' }),
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

    // Get client IP and user agent
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    // Create lead record
    const leadData = {
      email: body.email.toLowerCase(),
      first_name: body.firstName,
      last_name: body.lastName,
      company: body.company,
      phone: body.phone,
      job_title: body.jobTitle,
      industry: body.industry,
      company_size: body.companySize,
      source: body.source,
      campaign: body.campaign,
      utm_source: body.utmSource,
      utm_medium: body.utmMedium,
      utm_campaign: body.utmCampaign,
      utm_term: body.utmTerm,
      utm_content: body.utmContent,
      page_url: body.pageUrl,
      referrer: body.referrer,
      user_agent: body.userAgent || userAgent,
      ip_address: body.ipAddress || clientIP,
      status: 'new',
      lead_score: 0,
    };

    // Check if lead already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, email, status')
      .eq('email', leadData.email)
      .single();

    if (existingLead) {
      // Update existing lead with new information
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          ...leadData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating lead:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update lead' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Log analytics event
      await supabase.from('website_analytics').insert({
        event_name: 'lead_updated',
        event_data: {
          lead_id: updatedLead.id,
          source: body.source,
          campaign: body.campaign,
        },
        page_url: body.pageUrl,
        referrer: body.referrer,
        user_agent: userAgent,
        ip_address: clientIP,
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          leadId: updatedLead.id,
          message: 'Lead updated successfully',
          isNew: false
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      // Create new lead
      const { data: newLead, error: createError } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (createError) {
        console.error('Error creating lead:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create lead' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Log analytics event
      await supabase.from('website_analytics').insert({
        event_name: 'lead_captured',
        event_data: {
          lead_id: newLead.id,
          source: body.source,
          campaign: body.campaign,
        },
        page_url: body.pageUrl,
        referrer: body.referrer,
        user_agent: userAgent,
        ip_address: clientIP,
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          leadId: newLead.id,
          message: 'Lead captured successfully',
          isNew: true
        }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Lead capture error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})