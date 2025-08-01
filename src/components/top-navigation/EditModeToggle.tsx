import { Edit3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditModeToggleProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

export function EditModeToggle({ editMode, setEditMode }: EditModeToggleProps) {
  return (
    <Button
      variant={editMode ? "default" : "outline"}
      size="sm"
      onClick={() => setEditMode(!editMode)}
      className={`transition-all duration-300 ${
        editMode 
          ? 'button-premium glow' 
          : 'hover:shadow-md'
      }`}
    >
      {editMode ? (
        <>
          <Eye className="h-4 w-4 mr-2" />
          View Mode
        </>
      ) : (
        <>
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Mode
        </>
      )}
    </Button>
  );
}