import { useEffect, useCallback, useState } from 'react';
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { OutlineTree } from './OutlineTree';
import { EditorCanvas } from './EditorCanvas';
import { BlockInspector } from './BlockInspector';
import {
  parseMjml,
  serializeMjml,
  createEmptyDocument,
} from '@/lib/mjml/parser';
import type { MjmlNode } from '@/types/mjml';

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
}

function EditorContent({ onChange }: { onChange: (mjml: string) => void }) {
  const { state, undo, redo, canUndo, canRedo, deleteBlock, selectBlock } =
    useEditor();

  // Notify parent of changes
  useEffect(() => {
    const mjml = serializeMjml(state.document);
    console.log('MJML markup updated:\n', mjml);
    onChange(mjml);
  }, [state.document, onChange]);

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

      // Delete selected block
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        state.selectedBlockId
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
    <div className="grid grid-cols-[256px_1fr_300px] h-full overflow-hidden">
      {/* Left sidebar - Outline Tree */}
      <div className="border-r border-border bg-background flex flex-col min-h-0 overflow-hidden">
        <OutlineTree />
      </div>

      {/* Center - Editor Canvas with tabs */}
      <div className="bg-canvas flex flex-col min-h-0 overflow-hidden">
        <EditorCanvas />
      </div>

      {/* Right sidebar - Attributes Panel */}
      <div className="border-l border-border bg-background flex flex-col min-h-0 overflow-hidden">
        <BlockInspector />
      </div>
    </div>
  );
}

export function MjmlEditor({
  value,
  onChange,
  className,
  defaultTheme = 'system',
}: MjmlEditorProps) {
  // Parse initial value only once on mount using lazy initial state
  const [initialDocument] = useState(() => parseInitialValue(value));

  // Memoize onChange to prevent re-renders
  const handleChange = useCallback(
    (mjml: string) => {
      onChange(mjml);
    },
    [onChange]
  );

  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <div className={`h-full w-full bg-background ${className || ''}`}>
        <EditorProvider initialDocument={initialDocument}>
          <EditorContent onChange={handleChange} />
        </EditorProvider>
      </div>
    </ThemeProvider>
  );
}
