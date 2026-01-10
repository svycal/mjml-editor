import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SortableBlockProps {
  id: string;
  children: ReactNode;
  disabled?: boolean;
}

export function SortableBlock({ id, children, disabled = false }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        isDragging && 'opacity-50 z-50'
      )}
    >
      {/* Drag handle */}
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-1 cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 group-hover:opacity-50"
        >
          <div className="flex flex-col gap-0.5 p-1">
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
