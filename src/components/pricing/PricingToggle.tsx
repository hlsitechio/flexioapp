import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type BillingCycle = 'monthly' | 'yearly';

interface PricingToggleProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
}

export function PricingToggle({ value, onChange }: PricingToggleProps): JSX.Element {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as BillingCycle)}
        className="bg-muted/50 p-1 rounded-full border border-border/50"
      >
        <ToggleGroupItem value="monthly" aria-label="Show monthly prices" className="rounded-full px-4">
          Monthly
        </ToggleGroupItem>
        <ToggleGroupItem value="yearly" aria-label="Show yearly prices" className="rounded-full px-4">
          Yearly <span className="ml-2 text-xs text-primary">Save 20%</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
