import { useState } from 'react';
import { Calculator, Divide, Minus, Plus, X, Equal, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function DashboardQuickCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

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
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
      
      setHistory(prev => [calculation, ...prev.slice(0, 4)]); // Keep last 5 calculations
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

  const clearHistory = () => {
    setHistory([]);
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span>Quick Calculator</span>
          {history.length > 0 && (
            <Button
              onClick={clearHistory}
              size="sm"
              variant="ghost"
              className="ml-auto h-6 w-6 p-0"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display */}
        <Input
          value={display}
          readOnly
          className="text-right text-lg font-mono bg-muted/50 border-2"
        />

        {/* Calculator Grid */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            onClick={clear}
            variant="outline"
            className="col-span-2 text-sm"
          >
            Clear
          </Button>
          <Button
            onClick={() => inputOperation('/')}
            variant="outline"
            className="aspect-square"
          >
            <Divide className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => inputOperation('*')}
            variant="outline"
            className="aspect-square"
          >
            <X className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => inputNumber('7')}
            variant="ghost"
            className="aspect-square"
          >
            7
          </Button>
          <Button
            onClick={() => inputNumber('8')}
            variant="ghost"
            className="aspect-square"
          >
            8
          </Button>
          <Button
            onClick={() => inputNumber('9')}
            variant="ghost"
            className="aspect-square"
          >
            9
          </Button>
          <Button
            onClick={() => inputOperation('-')}
            variant="outline"
            className="aspect-square"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => inputNumber('4')}
            variant="ghost"
            className="aspect-square"
          >
            4
          </Button>
          <Button
            onClick={() => inputNumber('5')}
            variant="ghost"
            className="aspect-square"
          >
            5
          </Button>
          <Button
            onClick={() => inputNumber('6')}
            variant="ghost"
            className="aspect-square"
          >
            6
          </Button>
          <Button
            onClick={() => inputOperation('+')}
            variant="outline"
            className="aspect-square"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => inputNumber('1')}
            variant="ghost"
            className="aspect-square"
          >
            1
          </Button>
          <Button
            onClick={() => inputNumber('2')}
            variant="ghost"
            className="aspect-square"
          >
            2
          </Button>
          <Button
            onClick={() => inputNumber('3')}
            variant="ghost"
            className="aspect-square"
          >
            3
          </Button>
          <Button
            onClick={performCalculation}
            variant="default"
            className="aspect-square row-span-2"
          >
            <Equal className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => inputNumber('0')}
            variant="ghost"
            className="col-span-2"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            variant="ghost"
            className="aspect-square"
          >
            .
          </Button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-1 max-h-24 overflow-y-auto border-t pt-3">
            <div className="text-xs font-medium text-muted-foreground mb-1">Recent Calculations</div>
            {history.map((calc, index) => (
              <div key={index} className="text-xs font-mono text-muted-foreground p-1 bg-muted/30 rounded">
                {calc}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}