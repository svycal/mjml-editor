import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ResizableSplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

export function ResizableSplitPane({
  children,
  defaultLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70,
  className,
}: ResizableSplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

      const clampedWidth = Math.min(
        maxLeftWidth,
        Math.max(minLeftWidth, newLeftWidth)
      );
      setLeftWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  const [left, right] = children;

  return (
    <div ref={containerRef} className={cn('flex h-full', className)}>
      <div
        style={{ width: `${leftWidth}%` }}
        className={cn(
          'h-full overflow-hidden',
          isDragging && 'pointer-events-none'
        )}
      >
        {left}
      </div>

      <div
        onMouseDown={handleMouseDown}
        className="w-1 bg-border hover:bg-primary/50 cursor-col-resize flex-shrink-0 transition-colors"
      />

      <div
        style={{ width: `${100 - leftWidth}%` }}
        className={cn(
          'h-full overflow-hidden',
          isDragging && 'pointer-events-none'
        )}
      >
        {right}
      </div>
    </div>
  );
}
