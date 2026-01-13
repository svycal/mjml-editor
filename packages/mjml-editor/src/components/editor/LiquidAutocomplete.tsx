import { useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react';
import { cn } from '@/lib/utils';
import type { LiquidSuggestion } from '@/types/liquid';

interface LiquidAutocompleteProps {
  items: LiquidSuggestion[];
  selectedIndex: number;
  onSelect: (item: LiquidSuggestion) => void;
  clientRect: (() => DOMRect | null) | null;
}

export function LiquidAutocomplete({
  items,
  selectedIndex,
  onSelect,
  clientRect,
}: LiquidAutocompleteProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  // Virtual element for Floating UI
  const virtualEl = useRef<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  // Combine refs for floating element
  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      floatingRef.current = node;
      refs.setFloating(node);
    },
    [refs]
  );

  // Update virtual element when clientRect changes
  useLayoutEffect(() => {
    if (clientRect) {
      const rect = clientRect();
      if (rect) {
        virtualEl.current = {
          getBoundingClientRect: () => rect,
        };
        refs.setReference(virtualEl.current);
      }
    }
  }, [clientRect, refs]);

  // Scroll selected item into view
  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      block: 'nearest',
    });
  }, [selectedIndex]);

  if (items.length === 0) {
    return (
      <div
        ref={setFloatingRef}
        style={floatingStyles}
        className="light z-50 rounded-lg border border-border bg-popover p-2 shadow-lg text-sm text-muted-foreground"
      >
        No matches found
      </div>
    );
  }

  return (
    <div
      ref={setFloatingRef}
      style={floatingStyles}
      className="light z-50 flex flex-col rounded-lg border border-border bg-popover shadow-lg max-h-64 overflow-y-auto"
      onMouseDown={(e) => e.preventDefault()}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={index === selectedIndex ? selectedRef : null}
          type="button"
          onClick={() => onSelect(item)}
          className={cn(
            'flex flex-col items-start px-3 py-2 text-left text-sm transition-colors',
            'hover:bg-accent',
            index === selectedIndex && 'bg-accent'
          )}
        >
          <span className="font-medium text-foreground">{item.name}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground">
              {item.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
