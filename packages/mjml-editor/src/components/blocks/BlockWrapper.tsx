import type { ReactNode } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BlockWrapperProps {
  id: string;
  label: string;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  children: ReactNode;
  className?: string;
  showDeleteButton?: boolean;
}

export function BlockWrapper({
  id,
  label,
  isSelected,
  onSelect,
  children,
  className,
  showDeleteButton = true,
}: BlockWrapperProps) {
  const { deleteBlock } = useEditor();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBlock(id);
  };

  return (
    <div
      className={cn(
        'group relative rounded border transition-colors',
        isSelected
          ? 'border-primary ring-1 ring-primary'
          : 'border-border hover:border-primary/50',
        className
      )}
      onClick={onSelect}
    >
      {/* Label badge */}
      <div
        className={cn(
          'absolute -top-2.5 left-2 px-1.5 py-0.5 text-[10px] font-medium rounded',
          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}
      >
        {label}
      </div>

      {/* Delete button */}
      {showDeleteButton && (
        <Button
          variant="destructive"
          size="icon"
          className={cn(
            'absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 transition-opacity',
            'group-hover:opacity-100',
            isSelected && 'opacity-100'
          )}
          onClick={handleDelete}
        >
          <span className="text-xs">×</span>
        </Button>
      )}

      {/* Content */}
      <div className="pt-3">{children}</div>
    </div>
  );
}
