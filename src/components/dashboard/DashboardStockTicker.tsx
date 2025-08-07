import React, { useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function DashboardStockTicker() {
  const [stocks] = useState([
    { symbol: 'AAPL', price: 185.27, change: +2.34, changePercent: +1.28 },
    { symbol: 'GOOGL', price: 142.56, change: -1.45, changePercent: -1.01 },
    { symbol: 'MSFT', price: 378.91, change: +5.67, changePercent: +1.52 },
    { symbol: 'TSLA', price: 248.42, change: -3.21, changePercent: -1.27 }
  ]);

  return (
    <WidgetShell title="Stock Ticker" icon={<DollarSign className="h-5 w-5" />} variant="glass" size="md">
      <div className="space-y-3">
        {stocks.map((stock) => {
          const isUp = stock.change >= 0;
          return (
            <div key={stock.symbol} className="flex items-center justify-between text-sm hover-scale">
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-right">
                <div className="font-mono tabular-nums">${stock.price}</div>
                <div className={`flex items-center gap-1 justify-end text-xs ${isUp ? 'text-primary' : 'text-destructive'}`}>
                  {isUp ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    <TrendingDown className="h-3 w-3" />
                  }
                  {isUp ? '+' : ''}{stock.change} ({stock.changePercent}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
}
