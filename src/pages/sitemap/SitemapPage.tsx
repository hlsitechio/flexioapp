import { useEffect, useState } from 'react';
import { generateSitemap } from '@/lib/sitemap';

export function SitemapPage() {
  const [sitemap, setSitemap] = useState<string>('');

  useEffect(() => {
    const sitemapXml = generateSitemap();
    setSitemap(sitemapXml);
    
    // Set the content type to XML
    const response = new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }, []);

  // For the actual sitemap.xml route, we would serve this directly as XML
  // This component is just for testing/viewing the sitemap in the browser
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sitemap Preview</h1>
        <p className="text-muted-foreground mb-8">
          This is a preview of the XML sitemap that would be served at /sitemap.xml
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-auto">
            <code>{sitemap}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}