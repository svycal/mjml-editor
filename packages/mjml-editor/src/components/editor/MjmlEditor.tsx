import { useEffect, useCallback, useState, useRef } from 'react';
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { LiquidSchemaProvider } from '@/context/LiquidSchemaContext';
import { ExtensionsProvider } from '@/context/ExtensionsContext';
import { OutlineTree, GLOBAL_STYLES_ID } from './OutlineTree';
import { EditorCanvas, type EditorTabType } from './EditorCanvas';
import { BlockInspector } from './BlockInspector';
import { GlobalStylesPanel } from './GlobalStylesPanel';
import { FloatingPanel } from '@/components/ui/floating-panel';
import {
  parseMjml,
  serializeMjml,
  createEmptyDocument,
} from '@/lib/mjml/parser';
import type { MjmlNode, EditorExtensions } from '@/types/mjml';
import type { LiquidSchema } from '@/types/liquid';

function parseInitialValue(value: string): MjmlNode {
  if (!value || value.trim() === '') {
    return createEmptyDocument();
  }
  try {
    return parseMjml(value);
  } catch (error) {
    console.error('Failed to parse MJML:', error);
    return createEmptyDocument();
  }
}

interface MjmlEditorProps {
  value: string;
  onChange: (mjml: string) => void;
  className?: string;
  defaultTheme?: 'light' | 'dark' | 'system';
  liquidSchema?: LiquidSchema;
  /**
   * Enable optional editor extensions.
   * Extensions provide opt-in features beyond standard MJML.
   *
   * Available extensions:
   * - `conditionalBlocks`: Enable `sc-if` attribute for server-side conditional rendering
   *
   * @example
   * ```tsx
   * <MjmlEditor
   *   extensions={{ conditionalBlocks: true }}
   *   // ...
   * />
   * ```
   */
  extensions?: EditorExtensions;
  /**
   * Whether to apply the theme class to document.documentElement.
   * This is needed for Radix UI portals (popovers, menus, etc.) which
   * render outside the editor container.
   *
   * Set to false if your app manages document-level theme classes
   * and you want to prevent conflicts.
   *
   * @default true
   */
  applyThemeToDocument?: boolean;
  /**
   * Whether to show the theme toggle in the toolbar.
   * @default true
   */
  showThemeToggle?: boolean;
  /**
   * Whether the tree panel (left) is open by default.
   * @default true
   */
  defaultLeftPanelOpen?: boolean;
  /**
   * Whether the inspector panel (right) is open by default.
   * @default false
   */
  defaultRightPanelOpen?: boolean;
}

/**
 * Wrapper component that applies the mjml-editor class and theme class.
 * This scopes all CSS variables and theme styles to the editor container.
 */
function ThemedEditorWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={`mjml-editor ${resolvedTheme} relative h-full w-full overflow-hidden bg-background text-foreground antialiased ${className || ''}`}
    >
      {children}
    </div>
  );
}

interface EditorContentProps {
  onChange: (mjml: string) => void;
  showThemeToggle?: boolean;
  defaultLeftPanelOpen?: boolean;
  defaultRightPanelOpen?: boolean;
}

function EditorContent({
  onChange,
  showThemeToggle = true,
  defaultLeftPanelOpen = true,
  defaultRightPanelOpen = false,
}: EditorContentProps) {
  const { state, undo, redo, canUndo, canRedo, deleteBlock, selectBlock } =
    useEditor();
  const [leftPanelOpen, setLeftPanelOpen] = useState(defaultLeftPanelOpen);
  const [rightPanelOpen, setRightPanelOpen] = useState(defaultRightPanelOpen);
  const [activeTab, setActiveTab] = useState<EditorTabType>('edit');

  // Store onChange in a ref to avoid infinite loops when parent doesn't memoize the callback
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Auto-open right panel when a block is selected
  useEffect(() => {
    if (state.selectedBlockId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: sync UI state with selection
      setRightPanelOpen(true);
    }
  }, [state.selectedBlockId]);

  // Notify parent of changes
  useEffect(() => {
    const mjml = serializeMjml(state.document);
    onChangeRef.current(mjml);
  }, [state.document]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
        return;
      }

      // Delete selected block (but not global styles or body)
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        state.selectedBlockId &&
        state.selectedBlockId !== GLOBAL_STYLES_ID
      ) {
        e.preventDefault();
        deleteBlock(state.selectedBlockId);
        return;
      }

      // Escape to deselect
      if (e.key === 'Escape' && state.selectedBlockId) {
        e.preventDefault();
        selectBlock(null);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    canUndo,
    canRedo,
    deleteBlock,
    selectBlock,
    state.selectedBlockId,
  ]);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Full-width canvas */}
      <div className="absolute inset-0 bg-canvas">
        <EditorCanvas
          activeTab={activeTab}
          onTabChange={setActiveTab}
          leftPanelOpen={leftPanelOpen}
          rightPanelOpen={rightPanelOpen}
          showThemeToggle={showThemeToggle}
        />
      </div>

      {/* Floating panels - only shown in Edit mode */}
      {activeTab === 'edit' && (
        <>
          {/* Left floating panel - Outline Tree */}
          <FloatingPanel
            side="left"
            isOpen={leftPanelOpen}
            onToggle={() => setLeftPanelOpen(!leftPanelOpen)}
            width={256}
          >
            <OutlineTree onTogglePanel={() => setLeftPanelOpen(false)} />
          </FloatingPanel>

          {/* Right floating panel - Inspector */}
          <FloatingPanel
            side="right"
            isOpen={rightPanelOpen}
            onToggle={() => setRightPanelOpen(!rightPanelOpen)}
            width={300}
          >
            {state.selectedBlockId === GLOBAL_STYLES_ID ? (
              <GlobalStylesPanel
                onTogglePanel={() => setRightPanelOpen(false)}
              />
            ) : (
              <BlockInspector onTogglePanel={() => setRightPanelOpen(false)} />
            )}
          </FloatingPanel>
        </>
      )}
    </div>
  );
}

export function MjmlEditor({
  value,
  onChange,
  className,
  defaultTheme = 'system',
  liquidSchema,
  extensions,
  applyThemeToDocument = true,
  showThemeToggle = true,
  defaultLeftPanelOpen = true,
  defaultRightPanelOpen = false,
}: MjmlEditorProps) {
  // Track if we're mounted (client-side) - editor requires browser APIs
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: SSR hydration pattern to detect client-side mount
    setIsMounted(true);
  }, []);

  // Parse initial value only once on mount using lazy initial state
  const [initialDocument] = useState(() => parseInitialValue(value));

  // Memoize onChange to prevent re-renders
  const handleChange = useCallback(
    (mjml: string) => {
      onChange(mjml);
    },
    [onChange]
  );

  // Don't render during SSR - editor requires browser APIs (iframe, DOM, etc.)
  if (!isMounted) {
    return <div className={`h-full w-full bg-background ${className || ''}`} />;
  }

  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      applyToDocument={applyThemeToDocument}
    >
      <ExtensionsProvider extensions={extensions}>
        <LiquidSchemaProvider schema={liquidSchema}>
          <ThemedEditorWrapper className={className}>
            <EditorProvider initialDocument={initialDocument}>
              <EditorContent
                onChange={handleChange}
                showThemeToggle={showThemeToggle}
                defaultLeftPanelOpen={defaultLeftPanelOpen}
                defaultRightPanelOpen={defaultRightPanelOpen}
              />
            </EditorProvider>
          </ThemedEditorWrapper>
        </LiquidSchemaProvider>
      </ExtensionsProvider>
    </ThemeProvider>
  );
}
