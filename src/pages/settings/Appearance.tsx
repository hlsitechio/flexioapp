import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

export function Appearance() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Appearance</span>
        </CardTitle>
        <CardDescription>
          Customize the look and feel of your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Theme</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              Light
            </Button>
            <Button variant="outline" size="sm">
              Dark
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}