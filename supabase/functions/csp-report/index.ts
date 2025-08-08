import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiter per IP
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 120
const rateMap = new Map<string, { count: number; windowStart: number }>()

interface CSPViolation {
  documentURI: string;
  referrer: string;
  blockedURI: string;
  violatedDirective: string;
  effectiveDirective: string;
  originalPolicy: string;
  disposition: string;
  statusCode: number;
  timestamp: Date;
  userAgent: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const anonClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: req.headers.get('Authorization')! } } })
    const serviceClient = createClient(supabaseUrl, serviceKey)

  // Rate limit per IP
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const rec = rateMap.get(ip) || { count: 0, windowStart: now }
  if (now - rec.windowStart > RATE_LIMIT_WINDOW_MS) {
    rec.windowStart = now
    rec.count = 0
  }
  rec.count++
  rateMap.set(ip, rec)
  if (rec.count > RATE_LIMIT_MAX) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (req.method === 'POST') {
      const violation: CSPViolation = await req.json()
      
      // Enhance violation with server-side data
      const enhancedViolation = {
        ...violation,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        created_at: new Date().toISOString(),
        reported_at: new Date().toISOString(),
      }

    // Store CSP violation using service role (RLS-restricted)
    const { error } = await serviceClient
      .from('csp_violations')
      .insert([enhancedViolation])

      if (error) {
        console.error('Error storing CSP violation:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to store CSP violation' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Analyze violation for security implications
    await analyzeCSPViolation(enhancedViolation, serviceClient)

      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'GET') {
      // Retrieve CSP violations for analysis
      const url = new URL(req.url)
      const limit = parseInt(url.searchParams.get('limit') || '100')
      const hours = parseInt(url.searchParams.get('hours') || '24')

      const since = new Date()
      since.setHours(since.getHours() - hours)

    const { data: violations, error } = await anonClient
      .from('csp_violations')
      .select('*')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

      if (error) {
        console.error('Error fetching CSP violations:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch CSP violations' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Generate analytics
      const analytics = generateCSPAnalytics(violations)

      return new Response(
        JSON.stringify({ violations, analytics }),
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
    console.error('CSP report function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function analyzeCSPViolation(violation: any, supabaseClient: any) {
  try {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      'data:',
      'javascript:',
      'eval',
      'inline',
      'unsafe-eval'
    ]

    const isSuspicious = suspiciousPatterns.some(pattern => 
      violation.blockedURI.includes(pattern) || 
      violation.violatedDirective.includes(pattern)
    )

    if (isSuspicious) {
      // Create security alert for suspicious CSP violation
      await supabaseClient
        .from('security_alerts')
        .insert([{
          event_type: 'suspicious_csp_violation',
          severity: 'high',
          message: `Suspicious CSP violation detected: ${violation.violatedDirective}`,
          metadata: violation,
          created_at: new Date().toISOString(),
          acknowledged: false
        }])

      console.warn('SUSPICIOUS CSP VIOLATION:', violation)
    }

    // Track violation frequency for this directive
    const { data: recentViolations } = await supabaseClient
      .from('csp_violations')
      .select('id')
      .eq('violatedDirective', violation.violatedDirective)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour

    if (recentViolations && recentViolations.length > 10) {
      // High frequency violation - potential attack
      await supabaseClient
        .from('security_alerts')
        .insert([{
          event_type: 'high_frequency_csp_violation',
          severity: 'critical',
          message: `High frequency CSP violations: ${recentViolations.length} violations in 1 hour`,
          metadata: { 
            directive: violation.violatedDirective,
            count: recentViolations.length
          },
          created_at: new Date().toISOString(),
          acknowledged: false
        }])

      console.error('HIGH FREQUENCY CSP VIOLATIONS:', {
        directive: violation.violatedDirective,
        count: recentViolations.length
      })
    }

  } catch (error) {
    console.error('Error analyzing CSP violation:', error)
  }
}

function generateCSPAnalytics(violations: any[]) {
  const analytics = {
    total: violations.length,
    byDirective: {} as Record<string, number>,
    byHour: {} as Record<string, number>,
    topBlockedURIs: {} as Record<string, number>,
    suspiciousCount: 0
  }

  violations.forEach(violation => {
    // Count by directive
    const directive = violation.violatedDirective || 'unknown'
    analytics.byDirective[directive] = (analytics.byDirective[directive] || 0) + 1

    // Count by hour
    const hour = new Date(violation.created_at).getHours()
    analytics.byHour[hour] = (analytics.byHour[hour] || 0) + 1

    // Count blocked URIs
    const uri = violation.blockedURI || 'unknown'
    analytics.topBlockedURIs[uri] = (analytics.topBlockedURIs[uri] || 0) + 1

    // Count suspicious violations
    if (uri.includes('data:') || uri.includes('javascript:') || uri.includes('eval')) {
      analytics.suspiciousCount++
    }
  })

  return analytics
}