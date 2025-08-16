import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const chartData = [
  { name: 'Jan', users: 4000, pageViews: 2400, revenue: 1200 },
  { name: 'Feb', users: 3000, pageViews: 1398, revenue: 800 },
  { name: 'Mar', users: 2000, pageViews: 9800, revenue: 1400 },
  { name: 'Apr', users: 2780, pageViews: 3908, revenue: 1600 },
  { name: 'May', users: 1890, pageViews: 4800, revenue: 1100 },
  { name: 'Jun', users: 2390, pageViews: 3800, revenue: 1300 },
  { name: 'Jul', users: 3490, pageViews: 4300, revenue: 1800 },
];

interface AnalyticsChartProps {
  title: string;
  type?: 'line' | 'area';
  dataKey: string;
  color?: string;
}

export function AnalyticsChart({ title, dataKey, color = '#3b82f6' }: AnalyticsChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-3xl font-bold">
            {chartData[chartData.length - 1][dataKey as keyof typeof chartData[0]]}
          </div>
          <div className="text-xs text-muted-foreground">
            Analytics data visualization
          </div>
          
          {/* Simple progress visualization */}
          <div className="space-y-2">
            {chartData.slice(-3).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm">{item.name}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${Math.min((item[dataKey as keyof typeof item] as number) / 5000 * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-mono">
                  {item[dataKey as keyof typeof item]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}