import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export function EmailTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const [testData, setTestData] = useState({
    to: 'hlarosesurprenant@gmail.com', // Pre-filled with your email
    fromAlias: 'support',
    subject: 'Email System Test',
    message: 'This is a test email to verify the Resend integration is working correctly.',
  });

  const emailAliases = [
    { value: 'support', label: 'FlexIO Support', address: 'support@yourdomain.com' },
    { value: 'sales', label: 'FlexIO Sales', address: 'sales@yourdomain.com' },
    { value: 'contact', label: 'FlexIO Contact', address: 'contact@yourdomain.com' },
    { value: 'info', label: 'FlexIO Info', address: 'info@yourdomain.com' },
    { value: 'noreply', label: 'FlexIO No-Reply', address: 'noreply@yourdomain.com' },
  ];

  const getFromAddress = (alias: string) => {
    const aliasInfo = emailAliases.find(a => a.value === alias);
    return aliasInfo ? `${aliasInfo.label} <${aliasInfo.address}>` : 'FlexIO Contact <contact@yourdomain.com>';
  };

  const sendTestEmail = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: testData.to,
          from: getFromAddress(testData.fromAlias),
          subject: testData.subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                Email System Test
              </h2>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #64748b; margin-top: 0;">Test Details</h3>
                <p><strong>From Alias:</strong> ${getFromAddress(testData.fromAlias)}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
              </div>

              <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h3 style="color: #64748b; margin-top: 0;">Test Message</h3>
                <p style="line-height: 1.6; white-space: pre-line;">${testData.message}</p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #dcfce7; border-radius: 8px;">
                <p style="color: #166534; margin: 0; font-weight: 500;">
                  ✅ Email system is working correctly!
                </p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b;">
                <p>This is a test email sent from the FlexIO email system via Resend integration.</p>
              </div>
            </div>
          `,
          tags: ['test-email', 'system-verification'],
        },
      });

      if (error) {
        throw error;
      }

      setTestResult({
        success: true,
        message: `Test email sent successfully! Email ID: ${data?.id || 'Unknown'}`,
      });

      toast({
        title: "Test Email Sent!",
        description: "Check your Gmail inbox for the test email.",
      });

    } catch (error: any) {
      console.error('Test email error:', error);
      setTestResult({
        success: false,
        message: `Failed to send test email: ${error.message || 'Unknown error'}`,
      });

      toast({
        title: "Test Failed",
        description: "Failed to send test email. Check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testContactForm = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: {
          name: 'Test User',
          email: 'hlarosesurprenant@gmail.com',
          company: 'FlexIO Testing',
          inquiryType: 'support',
          message: 'This is a test of the contact form email routing system.',
          sourcePage: window.location.href,
        },
      });

      if (error) {
        throw error;
      }

      setTestResult({
        success: true,
        message: `Contact form test completed! Submission ID: ${data?.submissionId || 'Unknown'}`,
      });

      toast({
        title: "Contact Form Test Sent!",
        description: "Check your Gmail for both the notification and auto-reply emails.",
      });

    } catch (error: any) {
      console.error('Contact form test error:', error);
      setTestResult({
        success: false,
        message: `Contact form test failed: ${error.message || 'Unknown error'}`,
      });

      toast({
        title: "Test Failed",
        description: "Failed to test contact form. Check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email System Test</h1>
          <p className="text-muted-foreground">
            Test your Resend integration and Gmail routing
          </p>
        </div>
        <Mail className="h-8 w-8 text-primary" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Direct Email Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Direct Email Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">To Email</Label>
              <Input
                id="to"
                value={testData.to}
                onChange={(e) => setTestData({ ...testData, to: e.target.value })}
                placeholder="recipient@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromAlias">From Alias</Label>
              <Select
                value={testData.fromAlias}
                onValueChange={(value) => setTestData({ ...testData, fromAlias: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emailAliases.map((alias) => (
                    <SelectItem key={alias.value} value={alias.value}>
                      {alias.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Will send from: {getFromAddress(testData.fromAlias)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={testData.subject}
                onChange={(e) => setTestData({ ...testData, subject: e.target.value })}
                placeholder="Test subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={testData.message}
                onChange={(e) => setTestData({ ...testData, message: e.target.value })}
                placeholder="Test message content"
                rows={4}
              />
            </div>

            <Button
              onClick={sendTestEmail}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Test Email'}
            </Button>
          </CardContent>
        </Card>

        {/* Contact Form Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Form Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Test Data:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Name:</strong> Test User</p>
                  <p><strong>Email:</strong> hlarosesurprenant@gmail.com</p>
                  <p><strong>Company:</strong> FlexIO Testing</p>
                  <p><strong>Type:</strong> Support Inquiry</p>
                  <p><strong>Message:</strong> Test contact form routing</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  What this tests:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Contact form submission flow</li>
                  <li>• Email routing to your Gmail</li>
                  <li>• Auto-reply functionality</li>
                  <li>• Professional email aliases</li>
                  <li>• Database storage (if enabled)</li>
                </ul>
              </div>

              <Button
                onClick={testContactForm}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? 'Testing...' : 'Test Contact Form'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Test Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${
                testResult.success 
                  ? 'bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200'
              }`}>
                <p>{testResult.message}</p>
                {testResult.success && (
                  <p className="text-sm mt-2 opacity-80">
                    Check your Gmail inbox at hlarosesurprenant@gmail.com
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Email Aliases</h4>
              <div className="space-y-1 text-sm">
                {emailAliases.map((alias) => (
                  <div key={alias.value} className="flex justify-between">
                    <span>{alias.label}:</span>
                    <span className="text-muted-foreground">{alias.address}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Routing</h4>
              <div className="space-y-1 text-sm">
                <p><strong>All emails route to:</strong></p>
                <p className="text-muted-foreground">hlarosesurprenant@gmail.com</p>
                <p className="text-xs text-muted-foreground mt-2">
                  (Hidden from users - they only see professional aliases)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}