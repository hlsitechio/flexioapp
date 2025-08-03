import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { gradients } from '@/pages/customization/gallery-gradient/gradients';
import { GRADIENT_MODE_CONFIGS } from './utils/gradientModeUtils';
import { useGradientCoverage } from '@/hooks/useGradientCoverage';
import { useSettings } from '@/contexts/SettingsContext';
import { GradientMode } from './types';

export function GradientTester() {
  const { gradientMode, dashboardBackground, testGradientMode, changeGradientMode } = useGradientCoverage();
  const { setDashboardBackground } = useSettings();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const testSpecificGradientMode = (gradientId: string, mode: GradientMode) => {
    const key = `${gradientId}-${mode}`;
    testGradientMode(gradientId, mode);
    
    // Wait a bit for the gradient to apply, then check elements
    setTimeout(() => {
      const config = GRADIENT_MODE_CONFIGS[mode];
      if (!config) return;
      
      let allElementsHaveGradient = true;
      
      config.targets.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            const hasBackground = element.style.background && element.style.background !== '';
            const hasBackdropFilter = element.style.backdropFilter && element.style.backdropFilter !== '';
            
            if (!hasBackground && !hasBackdropFilter) {
              allElementsHaveGradient = false;
            }
          }
        });
      });
      
      setTestResults(prev => ({
        ...prev,
        [key]: allElementsHaveGradient
      }));
    }, 1000);
  };

  const testAllCombinations = () => {
    const modes = Object.keys(GRADIENT_MODE_CONFIGS) as GradientMode[];
    const gradientIds = gradients.map(g => g.id);
    
    gradientIds.forEach((gradientId, gIndex) => {
      modes.forEach((mode, mIndex) => {
        setTimeout(() => {
          testSpecificGradientMode(gradientId, mode);
        }, (gIndex * modes.length + mIndex) * 1500);
      });
    });
  };

  const getCurrentGradient = () => {
    return gradients.find(g => g.id === dashboardBackground);
  };

  const getTotalTests = () => {
    return gradients.length * Object.keys(GRADIENT_MODE_CONFIGS).length;
  };

  const getPassedTests = () => {
    return Object.values(testResults).filter(Boolean).length;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gradient System Tester</CardTitle>
        <CardDescription>
          Test all {gradients.length} gradients across all {Object.keys(GRADIENT_MODE_CONFIGS).length} modes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Current Gradient</label>
            <Select value={dashboardBackground} onValueChange={setDashboardBackground}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gradients.map(gradient => (
                  <SelectItem key={gradient.id} value={gradient.id}>
                    {gradient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Current Mode</label>
            <Select value={gradientMode} onValueChange={changeGradientMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GRADIENT_MODE_CONFIGS).map(config => (
                  <SelectItem key={config.id} value={config.id}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={testAllCombinations} variant="default">
            Test All Combinations ({getTotalTests()})
          </Button>
          <Button 
            onClick={() => testSpecificGradientMode(dashboardBackground, gradientMode)} 
            variant="outline"
          >
            Test Current
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Test Results</span>
            <Badge variant={getPassedTests() === getTotalTests() ? "default" : "secondary"}>
              {getPassedTests()}/{getTotalTests()} Passed
            </Badge>
          </div>
          
          <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(testResults).map(([key, passed]) => {
              const [gradientId, mode] = key.split('-');
              const gradient = gradients.find(g => g.id === gradientId);
              const config = GRADIENT_MODE_CONFIGS[mode as keyof typeof GRADIENT_MODE_CONFIGS];
              
              return (
                <div key={key} className={`p-2 rounded text-xs flex justify-between ${
                  passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <span>{gradient?.name} + {config?.name}</span>
                  <span>{passed ? '✓' : '✗'}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>Current State:</strong></p>
          <p>Gradient: {getCurrentGradient()?.name}</p>
          <p>Mode: {GRADIENT_MODE_CONFIGS[gradientMode].name}</p>
          <p>Targets: {GRADIENT_MODE_CONFIGS[gradientMode].targets.join(', ')}</p>
        </div>
      </CardContent>
    </Card>
  );
}