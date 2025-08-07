import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, Share2, Mail, ExternalLink, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const trafficSources = [
  { 
    source: "Organic Search", 
    visitors: 45231, 
    percentage: 42.5, 
    icon: Search,
    color: "bg-green-500",
    change: "+12.3%"
  },
  { 
    source: "Direct", 
    visitors: 28942, 
    percentage: 27.2, 
    icon: Globe,
    color: "bg-blue-500",
    change: "+8.1%"
  },
  { 
    source: "Social Media", 
    visitors: 18765, 
    percentage: 17.6, 
    icon: Share2,
    color: "bg-purple-500",
    change: "+15.7%"
  },
  { 
    source: "Email", 
    visitors: 8934, 
    percentage: 8.4, 
    icon: Mail,
    color: "bg-orange-500",
    change: "+4.2%"
  },
  { 
    source: "Referral", 
    visitors: 4563, 
    percentage: 4.3, 
    icon: ExternalLink,
    color: "bg-pink-500",
    change: "-2.1%"
  }
];

export function TrafficSources() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trafficSources.map((source, index) => (
            <motion.div
              key={source.source}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${source.color}/10`}>
                    <source.icon className={`h-4 w-4 ${source.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{source.source}</div>
                    <div className="text-xs text-muted-foreground">
                      {source.visitors.toLocaleString()} visitors
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      source.change.startsWith('+') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {source.change}
                  </Badge>
                  <span className="text-sm font-medium">{source.percentage}%</span>
                </div>
              </div>
              <Progress 
                value={source.percentage} 
                className="h-2"
              />
            </motion.div>
          ))}
          
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
            <div className="text-sm font-medium mb-2">Total Traffic</div>
            <div className="text-2xl font-bold text-primary">
              {trafficSources.reduce((sum, source) => sum + source.visitors, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">visitors this month</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}