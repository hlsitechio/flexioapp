import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityEvent {
  id: string;
  type: string;
  severity: string;
  timestamp: string;
  description: string;
  metadata: Record<string, any>;
  userAgent: string;
  ip?: string;
  userId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'POST') {
      // Record security event
      const event: SecurityEvent = await req.json()
      
      // Add server-side information
      const enhancedEvent = {
        ...event,
        user_id: user.id,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        created_at: new Date().toISOString(),
      }

      // Store in database
      const { error } = await supabaseClient
        .from('security_events')
        .insert([enhancedEvent])

      if (error) {
        console.error('Error storing security event:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to store security event' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Check for critical events that need immediate attention
      if (event.severity === 'critical') {
        await handleCriticalSecurityEvent(enhancedEvent, supabaseClient)
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'GET') {
      // Retrieve security events for the user
      const url = new URL(req.url)
      const limit = parseInt(url.searchParams.get('limit') || '50')
      const severity = url.searchParams.get('severity')

      let query = supabaseClient
        .from('security_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (severity) {
        query = query.eq('severity', severity)
      }

      const { data: events, error } = await query

      if (error) {
        console.error('Error fetching security events:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch security events' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ events }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Security report function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleCriticalSecurityEvent(event: any, supabaseClient: any) {
  try {
    // Log critical event for admin attention
    console.error('CRITICAL SECURITY EVENT:', event)
    
    // You could add additional logic here such as:
    // - Sending alerts to administrators
    // - Temporarily suspending user account
    // - Triggering additional security measures
    
    // Store in high-priority alerts table
    await supabaseClient
      .from('security_alerts')
      .insert([{
        event_id: event.id,
        user_id: event.user_id,
        severity: 'critical',
        message: `Critical security event: ${event.description}`,
        created_at: new Date().toISOString(),
        acknowledged: false
      }])

  } catch (error) {
    console.error('Error handling critical security event:', error)
  }
}