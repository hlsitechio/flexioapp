import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Users } from 'lucide-react';

export function DashboardMessageCenter() {
  const [messages] = useState([
    { id: 1, sender: 'Sarah Wilson', message: 'Meeting scheduled for 3 PM', time: '10m ago', unread: true },
    { id: 2, sender: 'Team Alpha', message: 'Project deadline reminder', time: '1h ago', unread: true },
    { id: 3, sender: 'John Smith', message: 'Thanks for the update!', time: '2h ago', unread: false },
    { id: 4, sender: 'Design Team', message: 'New mockups are ready', time: '3h ago', unread: false }
  ]);

  const unreadCount = messages.filter(m => m.unread).length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {messages.slice(0, 3).map((message) => (
            <div key={message.id} className={`p-2 rounded-lg text-sm border ${
              message.unread ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'bg-muted/50'
            }`}>
              <div className="flex justify-between items-start">
                <div className="font-medium text-xs">{message.sender}</div>
                <div className="text-xs text-muted-foreground">{message.time}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {message.message}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Users className="h-3 w-3 mr-1" />
            Channels
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Send className="h-3 w-3 mr-1" />
            Compose
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}