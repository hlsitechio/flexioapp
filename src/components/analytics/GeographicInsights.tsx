import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const geographicData = [
  { country: "United States", visitors: 28456, percentage: 35.2, flag: "🇺🇸", trend: "+8.3%" },
  { country: "United Kingdom", visitors: 15234, percentage: 18.8, flag: "🇬🇧", trend: "+12.1%" },
  { country: "Germany", visitors: 12098, percentage: 14.9, flag: "🇩🇪", trend: "+5.7%" },
  { country: "France", visitors: 9876, percentage: 12.2, flag: "🇫🇷", trend: "+15.4%" },
  { country: "Canada", visitors: 7654, percentage: 9.4, flag: "🇨🇦", trend: "+9.2%" },
  { country: "Australia", visitors: 5432, percentage: 6.7, flag: "🇦🇺", trend: "+6.8%" },
  { country: "Japan", visitors: 2345, percentage: 2.8, flag: "🇯🇵", trend: "+11.5%" }
];

export function GeographicInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Geographic Insights
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Last 30 days
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {geographicData.map((country, index) => (
              <motion.div
                key={country.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <div className="font-medium text-sm">{country.country}</div>
                    <div className="text-xs text-muted-foreground">
                      {country.visitors.toLocaleString()} visitors
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{country.percentage}%</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      {country.trend}
                    </div>
                  </div>
                  <div 
                    className="w-16 h-2 bg-muted rounded-full overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${country.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Top Region</div>
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">North America</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">45.6% of total traffic</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Fastest Growing</div>
              <div className="text-lg font-bold text-green-900 dark:text-green-100">France</div>
              <div className="text-xs text-green-600 dark:text-green-400">+15.4% this month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}