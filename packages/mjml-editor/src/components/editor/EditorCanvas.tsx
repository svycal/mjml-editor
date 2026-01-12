import { useState } from 'react';
import { Undo2, Redo2, Monitor, Smartphone } from 'lucide-react';
import { VisualEditor } from './VisualEditor';
import { InteractivePreview } from './InteractivePreview';
import { SourceEditor } from './SourceEditor';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

export type PreviewMode = 'desktop' | 'mobile';

export type EditorTabType = 'edit' | 'preview' | 'source';

interface EditorCanvasProps {
  activeTab: EditorTabType;
  onTabChange: (tab: EditorTabType) => void;
  leftPanelOpen?: boolean;
  rightPanelOpen?: boolean;
}

export function EditorCanvas({
  activeTab,
  onTabChange,
  leftPanelOpen,
  rightPanelOpen,
}: EditorCanvasProps) {
  const { undo, redo, canUndo, canRedo } = useEditor();
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');

  return (
    <div className="flex flex-col h-full">
      {/* Tab header */}
      <div className="h-11 px-4 flex items-center gap-1 border-b border-border bg-background relative">
        <button
          onClick={() => onTabChange('edit')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            activeTab === 'edit'
              ? 'bg-accent text-foreground'
              : 'text-foreground-muted hover:text-foreground hover:bg-accent/50'
          )}
        >
          Edit
        </button>
        <button
          onClick={() => onTabChange('preview')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            activeTab === 'preview'
              ? 'bg-accent text-foreground'
              : 'text-foreground-muted hover:text-foreground hover:bg-accent/50'
          )}
        >
          Preview
        </button>
        <button
          onClick={() => onTabChange('source')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            activeTab === 'source'
              ? 'bg-accent text-foreground'
              : 'text-foreground-muted hover:text-foreground hover:bg-accent/50'
          )}
        >
          Source
        </button>

        {/* Preview mode switcher - absolutely centered */}
        {activeTab === 'preview' && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 p-0.5 rounded-lg bg-accent/50">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={cn(
                'h-7 px-2 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors',
                previewMode === 'desktop'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={cn(
                'h-7 px-2 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors',
                previewMode === 'mobile'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Controls */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={undo}
            disabled={!canUndo}
            className="h-7 w-7 rounded-md text-foreground-muted hover:text-foreground hover:bg-accent disabled:opacity-40"
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={redo}
            disabled={!canRedo}
            className="h-7 w-7 rounded-md text-foreground-muted hover:text-foreground hover:bg-accent disabled:opacity-40"
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'edit' && (
          <VisualEditor
            leftPanelOpen={leftPanelOpen}
            rightPanelOpen={rightPanelOpen}
          />
        )}
        {activeTab === 'preview' && (
          <InteractivePreview showHeader={false} previewMode={previewMode} />
        )}
        {activeTab === 'source' && <SourceEditor />}
      </div>
    </div>
  );
}
