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
    <Card className="h-full relative overflow-hidden bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-blue-500/15 border-purple-300/30 backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 via-transparent to-violet-600/5 pointer-events-none" />
      
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="text-lg flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg">
            <Calculator className="h-4 w-4 text-white" />
          </div>
          <span className="text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text font-semibold">
            Quick Calculator
          </span>
          {history.length > 0 && (
            <Button
              onClick={clearHistory}
              size="sm"
              variant="ghost"
              className="ml-auto h-6 w-6 p-0 hover:bg-purple-500/20 text-purple-600"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {/* Display */}
        <Input
          value={display}
          readOnly
          className="text-right text-lg font-mono bg-gradient-to-r from-purple-50/80 to-violet-50/80 border-purple-300/50 text-purple-900 font-semibold"
        />

        {/* Calculator Grid */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            onClick={clear}
            className="col-span-2 text-sm bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-600/90 hover:to-pink-600/90 text-white border-0 shadow-md"
          >
            Clear
          </Button>
          <Button
            onClick={() => inputOperation('/')}
            className="aspect-square bg-gradient-to-br from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0 shadow-md"
          >
            <Divide className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => inputOperation('*')}
            className="aspect-square bg-gradient-to-br from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0 shadow-md"
          >
            <X className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => inputNumber('7')}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            7
          </Button>
          <Button
            onClick={() => inputNumber('8')}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            8
          </Button>
          <Button
            onClick={() => inputNumber('9')}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            9
          </Button>
          <Button
            onClick={() => inputOperation('-')}
            className="aspect-square bg-gradient-to-br from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0 shadow-md"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => inputNumber('4')}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            4
          </Button>
          <Button
            onClick={() => inputNumber('5')}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            5
          </Button>
          <Button
            onClick={() => inputNumber('6')}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            6
          </Button>
          <Button
            onClick={() => inputOperation('+')}
            className="aspect-square bg-gradient-to-br from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0 shadow-md"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => inputNumber('1')}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            1
          </Button>
          <Button
            onClick={() => inputNumber('2')}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            2
          </Button>
          <Button
            onClick={() => inputNumber('3')}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            3
          </Button>
          <Button
            onClick={performCalculation}
            className="aspect-square row-span-2 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg"
          >
            <Equal className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => inputNumber('0')}
            variant="ghost"
            className="col-span-2 hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            variant="ghost"
            className="aspect-square hover:bg-purple-500/20 hover:text-purple-700 transition-all duration-200"
          >
            .
          </Button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-1 max-h-24 overflow-y-auto border-t border-purple-300/30 pt-3">
            <div className="text-xs font-medium text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text mb-1">Recent Calculations</div>
            {history.map((calc, index) => (
              <div key={index} className="text-xs font-mono text-purple-700 p-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded border border-purple-300/20">
                {calc}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}