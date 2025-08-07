import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi, Globe, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const realtimeData = [
  { metric: "Active Users", value: 1247, status: "online" },
  { metric: "Live Sessions", value: 834, status: "active" },
  { metric: "Current Page Views", value: 2156, status: "trending" },
  { metric: "Server Response", value: "145ms", status: "healthy" }
];

export function RealtimeMetrics() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Real-time Metrics
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {currentTime.toLocaleTimeString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {realtimeData.map((item, index) => (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.status === "online" && <Wifi className="h-4 w-4 text-green-500" />}
                {item.status === "active" && <Activity className="h-4 w-4 text-blue-500" />}
                {item.status === "trending" && <Globe className="h-4 w-4 text-purple-500" />}
                {item.status === "healthy" && <Activity className="h-4 w-4 text-emerald-500" />}
                <span className="font-medium">{item.metric}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{item.value}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    item.status === "online" ? "bg-green-100 text-green-700" :
                    item.status === "active" ? "bg-blue-100 text-blue-700" :
                    item.status === "trending" ? "bg-purple-100 text-purple-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
            </motion.div>
          ))}
          
          <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">System Status: All services operational</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}