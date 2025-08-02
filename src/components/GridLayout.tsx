import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, Grid2X2, LayoutGrid, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
interface GridLayoutProps {
  editMode: boolean;
}
type GridSize = '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12';
export function GridLayout({
  editMode
}: GridLayoutProps) {
  const [gridSize, setGridSize] = useState<GridSize>('4x4');
  const navigate = useNavigate();
  const getGridDimensions = (size: GridSize) => {
    const dimensions = {
      '2x2': {
        rows: 2,
        cols: 2
      },
      '3x3': {
        rows: 3,
        cols: 3
      },
      '4x4': {
        rows: 4,
        cols: 4
      },
      '6x6': {
        rows: 6,
        cols: 6
      },
      '9x9': {
        rows: 9,
        cols: 9
      },
      '12x12': {
        rows: 12,
        cols: 12
      }
    };
    return dimensions[size];
  };
  const getGridIcon = (size: GridSize) => {
    switch (size) {
      case '2x2':
      case '3x3':
        return <Grid2X2 className="h-4 w-4" />;
      case '4x4':
      case '6x6':
        return <Grid3X3 className="h-4 w-4" />;
      default:
        return <LayoutGrid className="h-4 w-4" />;
    }
  };
  const {
    rows,
    cols
  } = getGridDimensions(gridSize);
  const totalCells = rows * cols;
  const handleAddComponent = (slotIndex: number) => {
    if (editMode) {
      navigate(`/components?slot=${slotIndex}&gridSize=${gridSize}`);
    }
  };
  const placeholderImages = ['photo-1461749280684-dccba630e2f6',
  // monitor showing Java programming
  'photo-1485827404703-89b55fcc595e',
  // white robot near brown wall
  'photo-1487058792275-0ad4aaf24ca7',
  // Colorful software or web code on a computer monitor
  'photo-1498050108023-c5249f4df085',
  // A MacBook with lines of code on its screen on a busy desk
  'photo-1483058712412-4245e9b90334' // silver iMac with keyboard and trackpad inside room
  ];
  const getPlaceholderImage = (index: number) => {
    const imageIndex = index % placeholderImages.length;
    return `https://images.unsplash.com/${placeholderImages[imageIndex]}?w=400&h=300&fit=crop`;
  };
  return;
}