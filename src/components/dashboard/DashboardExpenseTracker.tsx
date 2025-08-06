import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';

export function DashboardExpenseTracker() {
  const [budget] = useState({
    total: 3000,
    spent: 2150,
    remaining: 850
  });

  const [expenses] = useState([
    { category: 'Food', amount: 450, budget: 600, color: 'bg-orange-500' },
    { category: 'Transport', amount: 200, budget: 300, color: 'bg-blue-500' },
    { category: 'Entertainment', amount: 150, budget: 200, color: 'bg-purple-500' },
    { category: 'Shopping', amount: 320, budget: 400, color: 'bg-pink-500' }
  ]);

  const spentPercentage = (budget.spent / budget.total) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Expenses
          </div>
          <Button size="sm" variant="outline" className="h-6 px-2">
            <Plus className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Monthly Budget</span>
            <span className="font-medium">${budget.spent} / ${budget.total}</span>
          </div>
          <Progress value={spentPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={spentPercentage > 80 ? 'text-red-600' : 'text-green-600'}>
              ${budget.remaining} remaining
            </span>
            <span>{spentPercentage.toFixed(1)}% used</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Categories</div>
          {expenses.map((expense, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${expense.color}`} />
                <span>{expense.category}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">${expense.amount}</div>
                <div className="text-xs text-muted-foreground">
                  of ${expense.budget}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm pt-2 border-t">
          <div className="flex items-center gap-1 text-green-600">
            <TrendingDown className="h-3 w-3" />
            <span>12% less than last month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}