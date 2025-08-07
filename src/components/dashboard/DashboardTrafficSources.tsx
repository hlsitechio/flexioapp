import { WidgetShell } from './WidgetShell';
import { Progress } from '@/components/ui/progress';
import { Search, Share2, Globe, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const miniTrafficSources = [
  { source: "Organic", percentage: 42.5, icon: Search },
  { source: "Direct", percentage: 27.2, icon: Globe },
  { source: "Social", percentage: 17.6, icon: Share2 },
  { source: "Email", percentage: 8.4, icon: Mail }
];

export function DashboardTrafficSources() {
  return (
    <WidgetShell title="Traffic Sources" icon={<Globe className="h-5 w-5" />} variant="default" size="sm">
      <div className="space-y-2">
        {miniTrafficSources.map((source, index) => (
          <motion.div
            key={source.source}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <source.icon className="h-3 w-3 text-primary" />
                <span className="font-medium">{source.source}</span>
              </div>
              <span className="font-medium tabular-nums">{source.percentage}%</span>
            </div>
            <Progress value={source.percentage} className="h-1" />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/10">
        <div className="text-xs font-medium text-primary">Total Visitors</div>
        <div className="text-sm font-bold tabular-nums">106,435</div>
      </div>
    </WidgetShell>
  );
}
