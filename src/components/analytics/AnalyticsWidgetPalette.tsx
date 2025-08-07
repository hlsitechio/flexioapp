import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BarChart3, Activity, Globe, TrendingUp, Users, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AnalyticsOverview, 
  AnalyticsChart, 
  RealtimeMetrics, 
  TrafficSources, 
  GeographicInsights 
} from '@/components/analytics';

interface WidgetType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  defaultProps?: any;
  size: 'small' | 'medium' | 'large' | 'full';
  category: string;
}

const availableWidgets: WidgetType[] = [
  {
    id: 'analytics-overview',
    title: 'Analytics Overview',
    description: 'Key metrics overview with statistics cards',
    icon: TrendingUp,
    component: AnalyticsOverview,
    size: 'full',
    category: 'Overview'
  },
  {
    id: 'user-growth-chart',
    title: 'User Growth Chart',
    description: 'Visual representation of user growth over time',
    icon: BarChart3,
    component: AnalyticsChart,
    defaultProps: {
      title: "User Growth",
      type: "area",
      dataKey: "users",
      color: "#3b82f6"
    },
    size: 'medium',
    category: 'Charts'
  },
  {
    id: 'pageviews-chart',
    title: 'Page Views Chart',
    description: 'Track page views and engagement metrics',
    icon: Eye,
    component: AnalyticsChart,
    defaultProps: {
      title: "Page Views Trend",
      type: "line",
      dataKey: "pageViews",
      color: "#10b981"
    },
    size: 'medium',
    category: 'Charts'
  },
  {
    id: 'revenue-chart',
    title: 'Revenue Analytics',
    description: 'Monitor revenue trends and financial metrics',
    icon: BarChart3,
    component: AnalyticsChart,
    defaultProps: {
      title: "Revenue Analytics",
      type: "area",
      dataKey: "revenue",
      color: "#f59e0b"
    },
    size: 'medium',
    category: 'Charts'
  },
  {
    id: 'realtime-metrics',
    title: 'Real-time Metrics',
    description: 'Live activity and current system status',
    icon: Activity,
    component: RealtimeMetrics,
    size: 'medium',
    category: 'Real-time'
  },
  {
    id: 'traffic-sources',
    title: 'Traffic Sources',
    description: 'Breakdown of traffic acquisition channels',
    icon: Globe,
    component: TrafficSources,
    size: 'medium',
    category: 'Traffic'
  },
  {
    id: 'geographic-insights',
    title: 'Geographic Insights',
    description: 'Geographic distribution of users and activity',
    icon: Users,
    component: GeographicInsights,
    size: 'medium',
    category: 'Demographics'
  }
];

interface AnalyticsWidgetPaletteProps {
  onAddWidget: (widget: WidgetType) => void;
  usedWidgetIds: string[];
}

export function AnalyticsWidgetPalette({ onAddWidget, usedWidgetIds }: AnalyticsWidgetPaletteProps) {
  const categories = [...new Set(availableWidgets.map(w => w.category))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Widget Palette
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map(category => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
              <div className="space-y-2">
                {availableWidgets
                  .filter(widget => widget.category === category)
                  .map(widget => {
                    const Icon = widget.icon;
                    const isUsed = usedWidgetIds.includes(widget.id);
                    
                    return (
                      <div
                        key={widget.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Icon className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{widget.title}</div>
                            <div className="text-xs text-muted-foreground">{widget.description}</div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {widget.size}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onAddWidget(widget)}
                          disabled={isUsed}
                          className="ml-2"
                        >
                          {isUsed ? 'Added' : <Plus className="h-4 w-4" />}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}