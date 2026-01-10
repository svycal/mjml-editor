import type { ReactNode } from 'react';
import { X } from 'lucide-react';
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
        'group relative rounded-lg transition-smooth bg-surface',
        isSelected
          ? 'ring-2 ring-block-selected shadow-framer'
          : 'ring-1 ring-border-subtle hover:ring-border hover:shadow-framer',
        className
      )}
      onClick={onSelect}
    >
      {/* Label badge */}
      <div
        className={cn(
          'absolute -top-2 left-3 px-2 py-0.5 text-[11px] font-medium rounded-md transition-smooth',
          isSelected
            ? 'bg-block-selected text-white shadow-sm'
            : 'bg-muted text-foreground-muted group-hover:text-foreground-subtle'
        )}
      >
        {label}
      </div>

      {/* Delete button */}
      {showDeleteButton && (
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            'absolute -top-2 -right-2 h-6 w-6 rounded-md',
            'bg-surface ring-1 ring-border shadow-sm',
            'text-foreground-muted hover:text-destructive hover:bg-destructive/10',
            'opacity-0 group-hover:opacity-100 transition-smooth',
            isSelected && 'opacity-100'
          )}
          onClick={handleDelete}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Content */}
      <div className="pt-4 pb-2">{children}</div>
    </div>
  );
}
