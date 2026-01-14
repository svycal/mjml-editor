import * as React from 'react';
import { PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingPanelProps {
  children: React.ReactNode;
  side: 'left' | 'right';
  isOpen: boolean;
  onToggle: () => void;
  width: number;
  className?: string;
}

function CollapsedPanelButton({
  side,
  onClick,
}: {
  side: 'left' | 'right';
  onClick: () => void;
}) {
  const Icon = side === 'left' ? PanelLeft : PanelRight;

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed top-14 z-40',
        'h-8 w-8 rounded-md',
        'flex items-center justify-center',
        'text-foreground-muted hover:text-foreground hover:bg-accent/50',
        'transition-colors duration-150',
        side === 'left' ? 'left-3' : 'right-3'
      )}
      title={side === 'left' ? 'Show outline panel' : 'Show inspector panel'}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function FloatingPanel({
  children,
  side,
  isOpen,
  onToggle,
  width,
  className,
}: FloatingPanelProps) {
  if (!isOpen) {
    return <CollapsedPanelButton side={side} onClick={onToggle} />;
  }

  return (
    <div
      className={cn(
        'fixed top-14 bottom-3 z-40',
        'bg-background text-foreground border border-border rounded-lg',
        'shadow-lg',
        'flex flex-col overflow-hidden',
        'transition-all duration-150 ease-out',
        side === 'left' ? 'left-3' : 'right-3',
        className
      )}
      style={{ width }}
    >
      {children}
    </div>
  );
}
