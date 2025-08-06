import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react';

export function DashboardNewsReader() {
  const [news] = useState([
    {
      title: 'Tech Industry Updates',
      summary: 'Latest developments in AI and machine learning...',
      source: 'TechNews',
      time: '2h ago',
      category: 'Technology'
    },
    {
      title: 'Market Analysis Report',
      summary: 'Global markets show positive trends for Q4...',
      source: 'FinanceDaily',
      time: '4h ago',
      category: 'Finance'
    },
    {
      title: 'Climate Action Summit',
      summary: 'World leaders discuss new environmental policies...',
      source: 'WorldNews',
      time: '6h ago',
      category: 'Environment'
    }
  ]);

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      Finance: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      Environment: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            News Reader
          </div>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <RefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {news.map((article, index) => (
            <div key={index} className="p-3 rounded-lg border bg-muted/30 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-sm line-clamp-2">
                  {article.title}
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {article.summary}
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={`text-xs ${getCategoryColor(article.category)}`}>
                  {article.category}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {article.source} • {article.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}