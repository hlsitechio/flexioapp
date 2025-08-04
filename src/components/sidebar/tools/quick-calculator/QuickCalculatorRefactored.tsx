import { Calculator } from 'lucide-react';
import { useGenericTool } from '@/hooks/useGenericTool';
import { ToolContainer } from '@/components/shared/ToolContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CalculatorState {
  display: string;
  result: number | null;
  waitingForOperand: boolean;
  operator: string | null;
  value: number | null;
}

const initialState: CalculatorState = {
  display: '0',
  result: null,
  waitingForOperand: false,
  operator: null,
  value: null,
};

export function QuickCalculator() {
  const { data: state, updateData: setState } = useGenericTool(initialState, 'quick-calculator');

  const calculate = (firstOperand: number, secondOperand: number, operator: string): number => {
    switch (operator) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '×': return firstOperand * secondOperand;
      case '÷': return firstOperand / secondOperand;
      case '=': return secondOperand;
      default: return secondOperand;
    }
  };

  const performCalculation = (nextOperator?: string) => {
    const inputValue = parseFloat(state.display);

    if (state.value === null) {
      setState(prev => ({
        ...prev,
        value: inputValue,
      }));
    } else if (state.operator) {
      const currentValue = state.value || 0;
      const newValue = calculate(currentValue, inputValue, state.operator);

      setState(prev => ({
        ...prev,
        display: String(newValue),
        value: newValue,
      }));
    }

    setState(prev => ({
      ...prev,
      waitingForOperand: true,
      operator: nextOperator || null,
    }));
  };

  const inputNumber = (num: string) => {
    if (state.waitingForOperand) {
      setState(prev => ({
        ...prev,
        display: num,
        waitingForOperand: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        display: prev.display === '0' ? num : prev.display + num,
      }));
    }
  };

  const inputDecimal = () => {
    if (state.waitingForOperand) {
      setState(prev => ({
        ...prev,
        display: '0.',
        waitingForOperand: false,
      }));
    } else if (state.display.indexOf('.') === -1) {
      setState(prev => ({
        ...prev,
        display: prev.display + '.',
      }));
    }
  };

  const clear = () => {
    setState(initialState);
  };

  const CollapsedContent = () => (
    <div className="flex flex-col items-center space-y-1">
      <Calculator className="h-4 w-4 text-primary" />
      <div className="text-xs font-medium text-center">
        {state.display.length > 4 ? state.display.slice(0, 4) : state.display}
      </div>
      <div className="text-[10px] text-muted-foreground text-center">
        Calc
      </div>
    </div>
  );

  return (
    <ToolContainer 
      title="Calculator" 
      icon={Calculator}
      collapsedContent={<CollapsedContent />}
    >
      <div className="space-y-4">
        <Input
          value={state.display}
          readOnly
          className="text-right text-lg font-mono bg-muted"
        />
        
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={clear}
            className="col-span-2"
          >
            Clear
          </Button>
          <Button
            variant="outline"
            onClick={() => performCalculation('÷')}
          >
            ÷
          </Button>
          <Button
            variant="outline"
            onClick={() => performCalculation('×')}
          >
            ×
          </Button>
          
          {[7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="ghost"
              onClick={() => inputNumber(String(num))}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => performCalculation('-')}
          >
            -
          </Button>
          
          {[4, 5, 6].map((num) => (
            <Button
              key={num}
              variant="ghost"
              onClick={() => inputNumber(String(num))}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => performCalculation('+')}
          >
            +
          </Button>
          
          {[1, 2, 3].map((num) => (
            <Button
              key={num}
              variant="ghost"
              onClick={() => inputNumber(String(num))}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="default"
            onClick={() => performCalculation()}
            className="row-span-2"
          >
            =
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => inputNumber('0')}
            className="col-span-2"
          >
            0
          </Button>
          <Button
            variant="ghost"
            onClick={inputDecimal}
          >
            .
          </Button>
        </div>
      </div>
    </ToolContainer>
  );
}