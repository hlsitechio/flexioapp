import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BillingCycle } from './PricingToggle';

interface UsageCalculatorProps {
  billingCycle?: BillingCycle;
}

export function UsageCalculator({ billingCycle = 'monthly' }: UsageCalculatorProps): JSX.Element {
  const [seats, setSeats] = useState<number>(5);

  const pricePerSeat = useMemo(() => (billingCycle === 'yearly' ? 12 * 0.8 : 12), [billingCycle]);
  const total = useMemo(() => seats * pricePerSeat, [seats, pricePerSeat]);

  const currency = useMemo(() => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }), []);

  return (
    <Card className="max-w-2xl mx-auto border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Simple usage estimate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-3 gap-4 items-center">
          <Label htmlFor="seats" className="text-sm">Seats</Label>
          <div className="sm:col-span-2 space-y-2">
            <Slider value={[seats]} min={1} max={100} step={1} onValueChange={([v]) => setSeats(v)} />
            <div className="flex items-center gap-2">
              <Input id="seats" type="number" min={1} max={100} value={seats} onChange={(e) => setSeats(Number(e.target.value) || 1)} className="w-24" />
              <span className="text-sm text-muted-foreground">users</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 items-center">
          <span className="text-sm">Price per seat</span>
          <div className="sm:col-span-2 text-sm">
            {currency.format(pricePerSeat)} {billingCycle === 'yearly' ? 'billed yearly' : 'per month'}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 items-center">
          <span className="text-sm font-medium">Estimated total</span>
          <div className="sm:col-span-2 text-lg font-semibold">
            {currency.format(total)} {billingCycle === 'yearly' ? 'per month (annual plan)' : 'per month'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
