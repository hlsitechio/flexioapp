
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardQuickCalculator() {
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

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
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

  const buttons = [
    ['C', '÷', '×', '⌫'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '=', '='],
  ];

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      clear();
    } else if (value === '⌫') {
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    } else if (['+', '-', '×', '÷'].includes(value)) {
      inputOperation(value);
    } else if (value === '=') {
      performCalculation();
    } else if (value === '.') {
      if (display.indexOf('.') === -1) {
        inputNumber('.');
      }
    } else {
      inputNumber(value);
    }
  };

  return (
    <Card className="h-full bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="bg-background/80 p-3 rounded-md border border-border/50">
            <div className="text-right text-xl font-mono text-foreground">
              {display}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1">
            {buttons.flat().map((value, index) => (
              <Button
                key={index}
                onClick={() => handleButtonClick(value)}
                variant={['C', '⌫'].includes(value) ? 'destructive' : 
                        ['+', '-', '×', '÷', '='].includes(value) ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
              >
                {value === '⌫' ? <Delete className="h-3 w-3" /> : value}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
