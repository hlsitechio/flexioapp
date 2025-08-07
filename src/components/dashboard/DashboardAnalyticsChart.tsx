import { ToolContainer } from '@/components/shared/ToolContainer';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const miniChartData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 700 },
  { name: 'Sun', value: 900 },
];

export function DashboardAnalyticsChart() {
  return (
    <ToolContainer title="Weekly Trend" icon={TrendingUp}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-24 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={miniChartData}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">This week</span>
        <span className="text-green-500 font-medium">+23%</span>
      </div>
    </ToolContainer>
  );
}