import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Edit3, Eye, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Appearance() {
  const [editMode, setEditMode] = useState(false);

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
      <CardContent className="space-y-6">
        {/* Edit Mode Toggle */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Dashboard Mode</Label>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {editMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="font-medium">
                  {editMode ? 'Edit Mode' : 'View Mode'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {editMode 
                  ? 'You can modify and rearrange dashboard components' 
                  : 'Dashboard is in read-only mode'}
              </p>
            </div>
            <Switch
              checked={editMode}
              onCheckedChange={setEditMode}
            />
          </div>
        </div>

        <Separator />

        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Theme</Label>
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