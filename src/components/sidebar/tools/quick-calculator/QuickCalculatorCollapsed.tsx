import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

export function QuickCalculatorCollapsed() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-2 rounded-lg border bg-card text-card-foreground"
    >
      <div className="flex flex-col items-center space-y-1">
        <Calculator className="h-4 w-4 text-primary" />
        <div className="text-[10px] text-muted-foreground text-center">
          Calc
        </div>
      </div>
    </motion.div>
  );
}