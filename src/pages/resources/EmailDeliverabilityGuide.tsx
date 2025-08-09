import { useState } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, ShieldCheck, Mail, Settings, Link2 } from 'lucide-react';

const DMARC_HOST = '_dmarc.flexioapp.com';
const DMARC_VALUE = [
  'v=DMARC1; p=none; sp=none; rua=mailto:dmarc@flexioapp.com; ruf=mailto:dmarc@flexioapp.com;',
  'fo=1; adkim=s; aspf=s; pct=100; ri=86400'
].join(' ');

export function EmailDeliverabilityGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch (e) {
      console.warn('Clipboard copy failed', e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      <SEOHead
        title="DMARC, SPF, DKIM Setup for flexioapp.com"
        description="Copy-ready DMARC for flexioapp.com with guidance for SPF/DKIM and Stripe sending domains."
        keywords={["DMARC", "SPF", "DKIM", "email deliverability", "Stripe", "flexioapp.com"]}
        canonicalUrl="/email-deliverability"
        ogType="article"
        articleSection="Email Deliverability"
      />

      <section className="py-16 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Email Deliverability for flexioapp.com</h1>
            <p className="text-muted-foreground text-lg">
              Set up DMARC, verify SPF/DKIM, and connect Stripe to send from your domain.
            </p>
          </header>

          <Card className="border border-border/50 shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Step 1 — Add DMARC (TXT)</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Host / Name</p>
                  <pre className="rounded-md border bg-muted/30 p-3 text-sm overflow-x-auto">{DMARC_HOST}</pre>
                  <Button variant="secondary" size="sm" onClick={() => copy(DMARC_HOST, 'host')} className="mt-2 w-fit">
                    {copied === 'host' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}Copy host
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <pre className="rounded-md border bg-muted/30 p-3 text-sm overflow-x-auto">{DMARC_VALUE}</pre>
                  <Button variant="secondary" size="sm" onClick={() => copy(DMARC_VALUE, 'value')} className="mt-2 w-fit">
                    {copied === 'value' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}Copy value
                  </Button>
                </div>
              </div>

              <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                <li>Reports go to dmarc@flexioapp.com. Create/route this mailbox before enabling stricter policies.</li>
                <li>Start with p=none to monitor. After 1–2 weeks, consider p=quarantine then p=reject.</li>
                <li>Gmail addresses should not be used for DMARC reports for your domain.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Step 2 — SPF (include Stripe)</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Ensure your SPF record authorizes all senders. If using Stripe to send emails from your domain, include Stripe:
              </p>
              <pre className="rounded-md border bg-muted/30 p-3 text-sm overflow-x-auto">v=spf1 include:send.stripe.com ~all</pre>
              <p className="text-xs text-muted-foreground">
                Merge with your existing SPF (only ONE SPF record per domain). If you also use other providers (e.g., workspace email), include theirs as well.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Step 3 — DKIM for Stripe</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                In Stripe: Settings → Email → Custom sending domain. Stripe will provide two CNAMEs for DKIM. Add those CNAMEs at your DNS host, then verify in Stripe.
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                <li>After DKIM is verified, Stripe mail will align with your domain for DMARC.</li>
                <li>Keep your website/app transactional provider DKIM records in place as well.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Link2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Step 4 — Monitor and tighten</h2>
              </div>
              <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-1">
                <li>Monitor aggregate (rua) DMARC reports for ~1–2 weeks.</li>
                <li>When alignment is clean, change policy to <code>p=quarantine</code> and later <code>p=reject</code>.</li>
                <li>Keep <code>fo=1</code> to get failure samples when available.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
