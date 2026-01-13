import {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type RefCallback,
} from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react';
import { cn } from '@/lib/utils';
import { useLiquidSchema } from '@/context/LiquidSchemaContext';
import type { LiquidSuggestion } from '@/types/liquid';

interface LiquidInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  value: string;
  onChange: (value: string) => void;
}

export interface LiquidInputRef {
  focus: () => void;
  select: () => void;
  blur: () => void;
}

export const LiquidInput = forwardRef<LiquidInputRef, LiquidInputProps>(
  function LiquidInput({ value, onChange, className, style, ...props }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const liquidSchema = useLiquidSchema();

    const [suggestionState, setSuggestionState] = useState<{
      active: boolean;
      items: LiquidSuggestion[];
      selectedIndex: number;
      triggerType: 'variable' | 'tag';
      triggerStart: number;
    } | null>(null);

    const { refs, floatingStyles } = useFloating({
      placement: 'bottom-start',
      middleware: [offset(4), flip(), shift({ padding: 8 })],
      whileElementsMounted: autoUpdate,
    });

    // Combine refs for floating element
    const setFloatingRef: RefCallback<HTMLDivElement> = useCallback(
      (node) => {
        refs.setFloating(node);
      },
      [refs]
    );

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      select: () => inputRef.current?.select(),
      blur: () => inputRef.current?.blur(),
    }));

    // Filter items based on query and type
    const filterItems = useCallback(
      (triggerType: 'variable' | 'tag', query: string): LiquidSuggestion[] => {
        if (!liquidSchema) return [];

        const items =
          triggerType === 'variable'
            ? liquidSchema.variables
            : liquidSchema.tags;
        const normalizedQuery = query.trim().toLowerCase();

        return items
          .filter((item) => item.name.toLowerCase().includes(normalizedQuery))
          .map((item) => ({
            id: `${triggerType}-${item.name}`,
            name: item.name,
            description: item.description,
            type: triggerType,
          }));
      },
      [liquidSchema]
    );

    // Check for triggers in input value
    const checkForTrigger = useCallback(
      (inputValue: string, cursorPos: number) => {
        const textBeforeCursor = inputValue.slice(0, cursorPos);

        // Check for {{ trigger (variables)
        const variableMatch = textBeforeCursor.match(/\{\{([^{}]*)$/);
        if (variableMatch) {
          const triggerStart = textBeforeCursor.lastIndexOf('{{');
          const query = variableMatch[1];
          const items = filterItems('variable', query);

          if (items.length > 0 || query.trim() === '') {
            setSuggestionState({
              active: true,
              items,
              selectedIndex: 0,
              triggerType: 'variable',
              triggerStart,
            });
            return;
          }
        }

        // Check for {% trigger (tags)
        const tagMatch = textBeforeCursor.match(/\{%([^{}]*)$/);
        if (tagMatch) {
          const triggerStart = textBeforeCursor.lastIndexOf('{%');
          const query = tagMatch[1];
          const items = filterItems('tag', query);

          if (items.length > 0 || query.trim() === '') {
            setSuggestionState({
              active: true,
              items,
              selectedIndex: 0,
              triggerType: 'tag',
              triggerStart,
            });
            return;
          }
        }

        // No trigger found
        setSuggestionState(null);
      },
      [filterItems]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        checkForTrigger(newValue, e.target.selectionStart || 0);
      },
      [onChange, checkForTrigger]
    );

    const handleSelect = useCallback(
      (item: LiquidSuggestion) => {
        if (!suggestionState || !inputRef.current) return;

        const { triggerStart, triggerType } = suggestionState;
        const cursorPos = inputRef.current.selectionStart || value.length;

        const replacement =
          triggerType === 'variable'
            ? `{{ ${item.name} }}`
            : `{% ${item.name} %}`;

        const newValue =
          value.slice(0, triggerStart) + replacement + value.slice(cursorPos);

        onChange(newValue);
        setSuggestionState(null);

        // Set cursor position after the inserted text
        const newCursorPos = triggerStart + replacement.length;
        setTimeout(() => {
          inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      },
      [suggestionState, value, onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!suggestionState?.active) {
          props.onKeyDown?.(e);
          return;
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSuggestionState((prev) =>
            prev
              ? {
                  ...prev,
                  selectedIndex: Math.min(
                    prev.selectedIndex + 1,
                    prev.items.length - 1
                  ),
                }
              : null
          );
          return;
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSuggestionState((prev) =>
            prev
              ? {
                  ...prev,
                  selectedIndex: Math.max(prev.selectedIndex - 1, 0),
                }
              : null
          );
          return;
        }

        if (e.key === 'Enter' || e.key === 'Tab') {
          if (suggestionState.items.length > 0) {
            e.preventDefault();
            const item = suggestionState.items[suggestionState.selectedIndex];
            if (item) {
              handleSelect(item);
            }
          }
          return;
        }

        if (e.key === 'Escape') {
          e.preventDefault();
          setSuggestionState(null);
          return;
        }

        props.onKeyDown?.(e);
      },
      [suggestionState, handleSelect, props]
    );

    // Close suggestions on blur (with small delay to allow click selection)
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
          setSuggestionState(null);
        }, 150);
        props.onBlur?.(e);
      },
      [props]
    );

    // Update floating reference to input element
    useEffect(() => {
      refs.setReference(inputRef.current);
    }, [refs]);

    return (
      <>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={className}
          style={style}
          {...props}
        />

        {suggestionState?.active && suggestionState.items.length > 0 && (
          <div
            ref={setFloatingRef}
            style={floatingStyles}
            className="light z-50 flex flex-col rounded-lg border border-border bg-popover shadow-lg max-h-64 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()}
          >
            {suggestionState.items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={cn(
                  'flex flex-col items-start px-3 py-2 text-left text-sm transition-colors',
                  'hover:bg-accent',
                  index === suggestionState.selectedIndex && 'bg-accent'
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
        )}
      </>
    );
  }
);
