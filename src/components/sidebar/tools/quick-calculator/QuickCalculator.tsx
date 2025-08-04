import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { Calculator, Divide, Minus, Plus, X, Equal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function QuickCalculator() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  if (isCollapsed) {
    return (
      <div className="space-y-2">
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
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 flex items-center space-x-1"
        >
          <Calculator className="h-3 w-3" />
          <span>Calculator</span>
        </motion.h3>
      </AnimatePresence>
      
      <div className="space-y-2">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, delay: 0.25 }}
            className="px-2 space-y-2"
          >
            {/* Display */}
            <Input
              value={display}
              readOnly
              className="h-8 text-right text-sm font-mono bg-muted/50"
            />

            {/* Calculator Grid */}
            <div className="grid grid-cols-4 gap-1">
              <Button
                onClick={clear}
                variant="outline"
                size="sm"
                className="h-7 text-xs col-span-2"
              >
                Clear
              </Button>
              <Button
                onClick={() => inputOperation('/')}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                <Divide className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => inputOperation('*')}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                <X className="h-3 w-3" />
              </Button>

              <Button
                onClick={() => inputNumber('7')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                7
              </Button>
              <Button
                onClick={() => inputNumber('8')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                8
              </Button>
              <Button
                onClick={() => inputNumber('9')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                9
              </Button>
              <Button
                onClick={() => inputOperation('-')}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                <Minus className="h-3 w-3" />
              </Button>

              <Button
                onClick={() => inputNumber('4')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                4
              </Button>
              <Button
                onClick={() => inputNumber('5')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                5
              </Button>
              <Button
                onClick={() => inputNumber('6')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                6
              </Button>
              <Button
                onClick={() => inputOperation('+')}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3" />
              </Button>

              <Button
                onClick={() => inputNumber('1')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                1
              </Button>
              <Button
                onClick={() => inputNumber('2')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                2
              </Button>
              <Button
                onClick={() => inputNumber('3')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                3
              </Button>
              <Button
                onClick={performCalculation}
                variant="default"
                size="sm"
                className="h-7 text-xs row-span-2"
              >
                <Equal className="h-3 w-3" />
              </Button>

              <Button
                onClick={() => inputNumber('0')}
                variant="ghost"
                size="sm"
                className="h-7 text-xs col-span-2"
              >
                0
              </Button>
              <Button
                onClick={inputDecimal}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                .
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}