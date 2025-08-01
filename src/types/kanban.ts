export interface KanbanItem {
  id: string;
  content: string;
  title: string;
  type: 'widget' | 'component' | 'tool';
  data?: Record<string, any>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  maxItems?: number;
}

export interface KanbanBoard {
  id: string;
  columns: KanbanColumn[];
  title: string;
}

export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current?: {
        type: string;
        columnId?: string;
        item?: KanbanItem;
      }
    }
  };
  over: {
    id: string;
    data: {
      current?: {
        type: string;
        columnId?: string;
        accepts?: string[];
      }
    }
  } | null;
}