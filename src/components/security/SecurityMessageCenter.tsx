import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Filter, RefreshCw, Trash2 } from 'lucide-react';
import { securityLogger, SecurityMessage } from '@/lib/security/unified-logger';
import { toast } from 'sonner';

export function SecurityMessageCenter() {
  const [messages, setMessages] = useState<SecurityMessage[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    loadMessages();
    const unsubscribe = securityLogger.onMessage(() => {
      loadMessages();
    });

    return unsubscribe;
  }, []);

  const loadMessages = () => {
    const allMessages = securityLogger.getMessages();
    const summaryData = securityLogger.getSummary();
    setMessages(allMessages);
    setSummary(summaryData);
  };

  const filteredMessages = messages.filter(msg => {
    if (selectedCategory !== 'all' && msg.category !== selectedCategory) return false;
    if (selectedLevel !== 'all' && msg.level !== selectedLevel) return false;
    return true;
  });

  const messagesByCategory = securityLogger.getMessagesByCategory();

  const handleExport = () => {
    const exportData = securityLogger.exportMessages();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-messages-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Security messages exported');
  };

  const handleClear = () => {
    securityLogger.clearMessages();
    loadMessages();
    toast.success('Security messages cleared');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'secondary';
      case 'info': return 'default';
      case 'debug': return 'outline';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'initialization': return '🚀';
      case 'csp': return '🛡️';
      case 'gdpr': return '🔒';
      case 'monitoring': return '👁️';
      case 'audit': return '🔍';
      case 'devtools': return '🛠️';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Message Center</h2>
          <p className="text-muted-foreground">
            Unified view of all security-related messages and events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadMessages}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Message Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Total Messages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{summary.recent}</div>
                <div className="text-sm text-muted-foreground">Recent (5min)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{summary.byLevel.error || 0}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{summary.byLevel.warn || 0}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
          <TabsTrigger value="initialization">🚀 Init ({messagesByCategory.initialization?.length || 0})</TabsTrigger>
          <TabsTrigger value="csp">🛡️ CSP ({messagesByCategory.csp?.length || 0})</TabsTrigger>
          <TabsTrigger value="gdpr">🔒 GDPR ({messagesByCategory.gdpr?.length || 0})</TabsTrigger>
          <TabsTrigger value="monitoring">👁️ Monitor ({messagesByCategory.monitoring?.length || 0})</TabsTrigger>
          <TabsTrigger value="audit">🔍 Audit ({messagesByCategory.audit?.length || 0})</TabsTrigger>
          <TabsTrigger value="devtools">🛠️ DevTools ({messagesByCategory.devtools?.length || 0})</TabsTrigger>
        </TabsList>

        <div className="mt-4 mb-4 flex gap-2">
          <select 
            value={selectedLevel} 
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Levels</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        <TabsContent value={selectedCategory} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory === 'all' ? 'All Messages' : `${getCategoryIcon(selectedCategory)} ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Messages`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {filteredMessages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No messages found for the selected filters
                    </p>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="text-lg">
                          {getCategoryIcon(message.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getLevelColor(message.level) as any}>
                              {message.level}
                            </Badge>
                            <Badge variant="outline">
                              {message.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm break-words">{message.message}</p>
                          {message.metadata && Object.keys(message.metadata).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-xs text-muted-foreground cursor-pointer">
                                Metadata
                              </summary>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(message.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}