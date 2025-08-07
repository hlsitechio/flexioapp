import React, { useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Share } from 'lucide-react';

export function DashboardQRCodeGenerator() {
  const [text, setText] = useState('https://example.com');
  const [generated, setGenerated] = useState(false);

  const generateQR = () => {
    setGenerated(true);
  };

  return (
    <WidgetShell title="QR Generator" icon={<QrCode className="h-5 w-5" />} variant="glass" size="md">
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter text or URL"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-sm"
          />
          <Button onClick={generateQR} size="sm" className="w-full">
            Generate QR Code
          </Button>
        </div>
        
        {generated && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-background p-4 rounded-lg border border-border mx-auto w-fit">
              <div className="w-24 h-24 bg-foreground/10 rounded flex items-center justify-center">
                <QrCode className="h-16 w-16 text-foreground/50" aria-hidden />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Download className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Share className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
