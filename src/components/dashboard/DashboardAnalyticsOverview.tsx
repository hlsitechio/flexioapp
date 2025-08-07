import { ToolContainer } from '@/components/shared/ToolContainer';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, BarChart3, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const miniStats = [
  { title: "Users", value: "124.8K", change: "+12.5%", trend: "up", icon: Users, color: "text-blue-500" },
  { title: "Views", value: "2.1M", change: "+8.2%", trend: "up", icon: Eye, color: "text-green-500" },
  { title: "Conv.", value: "3.4%", change: "-2.1%", trend: "down", icon: TrendingUp, color: "text-purple-500" },
  { title: "Revenue", value: "$45K", change: "+15.3%", trend: "up", icon: BarChart3, color: "text-orange-500" }
];

export function DashboardAnalyticsOverview() {
  return (
    <ToolContainer title="Analytics Overview" icon={BarChart3}>
      <div className="grid grid-cols-2 gap-2">
        {miniStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="p-2 hover:shadow-sm transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-1">
                  <stat.icon className={`h-3 w-3 ${stat.color}`} />
                  <span className="text-xs font-medium">{stat.title}</span>
                </div>
                <div className="text-sm font-bold">{stat.value}</div>
                <div className="flex items-center text-xs">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </ToolContainer>
  );
}