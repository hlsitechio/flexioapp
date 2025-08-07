import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, BarChart3, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const overviewStats = [
  {
    title: "Total Users",
    value: "124,832",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-500"
  },
  {
    title: "Page Views",
    value: "2.1M",
    change: "+8.2%",
    trend: "up",
    icon: Eye,
    color: "text-green-500"
  },
  {
    title: "Conversion Rate",
    value: "3.4%",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
    color: "text-purple-500"
  },
  {
    title: "Revenue",
    value: "$45,231",
    change: "+15.3%",
    trend: "up",
    icon: BarChart3,
    color: "text-orange-500"
  }
];

export function AnalyticsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {overviewStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-sm mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${
              stat.color.includes('blue') ? 'from-blue-500/20 to-blue-500' :
              stat.color.includes('green') ? 'from-green-500/20 to-green-500' :
              stat.color.includes('purple') ? 'from-purple-500/20 to-purple-500' :
              'from-orange-500/20 to-orange-500'
            }`} />
          </Card>
        </motion.div>
      ))}
    </div>
  );
}