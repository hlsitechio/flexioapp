import { ToolContainer } from '@/components/shared/ToolContainer';
import { Activity, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function DashboardRealtimeMetrics() {
  const [activeUsers, setActiveUsers] = useState(1247);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToolContainer title="Live Metrics" icon={Activity}>
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Wifi className="h-3 w-3 text-green-500" />
            <span className="text-xs font-medium">Active Users</span>
          </div>
          <span className="text-sm font-bold text-green-600">{activeUsers}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium">Live Sessions</span>
          </div>
          <span className="text-sm font-bold text-blue-600">834</span>
        </motion.div>

        <div className="flex items-center gap-2 text-xs">
          <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-muted-foreground">System Status: {isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </ToolContainer>
  );
}