import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function NotificationSidebar() {
  const { 
    isNotificationOpen, 
    setIsNotificationOpen, 
    notifications, 
    removeNotification, 
    clearAllNotifications 
  } = useNotification();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as handled by removing from the list
    removeNotification(notification.id);
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const unreadCount = notifications.length;

  return (
    <AnimatePresence>
      {isNotificationOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNotificationOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Notification Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearAll}
                  className="h-8 w-8"
                  title="Clear all notifications"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNotificationOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
              <div className="p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                  ) : (
                  notifications.map((notification) => (
                     <div
                       key={notification.id}
                       onClick={() => handleNotificationClick(notification)}
                       className="p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent bg-muted/30"
                     >
                       <div className="flex items-start gap-3">
                         {getNotificationIcon(notification.type)}
                         <div className="flex-1 space-y-1">
                           <div className="flex items-center justify-between">
                             <h4 className="text-sm font-medium">
                               {notification.title}
                             </h4>
                             <div className="w-2 h-2 bg-primary rounded-full" />
                           </div>
                           <p className="text-sm text-muted-foreground">
                             {notification.message}
                           </p>
                           <p className="text-xs text-muted-foreground">
                             {formatTime(notification.timestamp)}
                           </p>
                         </div>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={(e) => {
                             e.stopPropagation();
                             removeNotification(notification.id);
                           }}
                           className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <X className="h-3 w-3" />
                         </Button>
                       </div>
                     </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleClearAll}
                >
                  Clear all notifications
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}