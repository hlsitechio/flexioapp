import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { useDraggable } from '@dnd-kit/core';
import { Wrench, BarChart3, Users, Calendar, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarCompactCalendar } from '@/components/calendar';

interface ToolboxItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'widget' | 'component' | 'tool';
  category: string;
}

const toolboxItems: ToolboxItem[] = [
  {
    id: 'analytics-widget',
    title: 'Analytics',
    description: '',
    icon: <BarChart3 className="h-4 w-4" />,
    type: 'widget',
    category: 'Data'
  },
  {
    id: 'user-list',
    title: 'User List',
    description: '',
    icon: <Users className="h-4 w-4" />,
    type: 'component',
    category: 'Users'
  },
  {
    id: 'settings-panel',
    title: 'Settings Panel',
    description: '',
    icon: <Settings className="h-4 w-4" />,
    type: 'tool',
    category: 'Config'
  }
];

interface DraggableToolProps {
  item: ToolboxItem;
  isCollapsed: boolean;
}

function DraggableTool({ item, isCollapsed }: DraggableToolProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
    data: {
      type: 'toolbox-item',
      item: {
        id: `${item.id}-${Date.now()}`,
        title: item.title,
        content: item.description,
        type: item.type,
        data: { category: item.category, source: 'toolbox' }
      }
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`
          w-10 h-10 flex items-center justify-center rounded-lg mx-auto
          cursor-grab active:cursor-grabbing
          transition-all duration-200
          ${isDragging ? 'opacity-50 scale-110' : 'hover:bg-sidebar-accent'}
          text-sidebar-foreground/70 hover:text-sidebar-foreground
        `}
        {...listeners}
        {...attributes}
      >
        {item.icon}
      </div>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        p-3 cursor-grab active:cursor-grabbing transition-all duration-200 
        hover:shadow-md border border-sidebar-border
        ${isDragging ? 'opacity-50 scale-105 rotate-2' : ''}
      `}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start space-x-3">
        <div className="p-1.5 rounded bg-primary/10 text-primary">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-sidebar-foreground line-clamp-1">
              {item.title}
            </h4>
            <Badge variant="secondary" className="text-xs">
              {item.type}
            </Badge>
          </div>
          {item.description && (
            <p className="text-xs text-sidebar-foreground/60 line-clamp-2 mt-1">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export function Tools() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="space-y-3">
      {isCollapsed ? (
        <div className="flex justify-center">
          <button className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto">
            <Wrench className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <AnimatePresence>
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 flex items-center space-x-1"
            >
              <Wrench className="h-3 w-3" />
              <span>Tools</span>
            </motion.h3>
          </AnimatePresence>
          
          <div className="space-y-3">
            {/* Calendar Tool */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <SidebarCompactCalendar />
              </motion.div>
            </AnimatePresence>
            
            {/* Draggable Tools */}
            <div className="space-y-3">
              <AnimatePresence>
                {toolboxItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, delay: 0.25 + index * 0.1 }}
                  >
                    <DraggableTool item={item} isCollapsed={isCollapsed} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
}