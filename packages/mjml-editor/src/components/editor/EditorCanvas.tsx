import { useState } from 'react';
import { Undo2, Redo2, Monitor, Smartphone } from 'lucide-react';
import { VisualEditor } from './VisualEditor';
import { InteractivePreview } from './InteractivePreview';
import { SourceEditor } from './SourceEditor';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

export type PreviewMode = 'desktop' | 'mobile';

export type EditorTabType = 'edit' | 'preview' | 'source';

interface EditorCanvasProps {
  activeTab: EditorTabType;
  onTabChange: (tab: EditorTabType) => void;
  leftPanelOpen?: boolean;
  rightPanelOpen?: boolean;
  showThemeToggle?: boolean;
  onSourceApply?: (mjml: string) => void;
}

export function EditorCanvas({
  activeTab,
  onTabChange,
  leftPanelOpen,
  rightPanelOpen,
  showThemeToggle = true,
  onSourceApply,
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
          <Tabs
            value={previewMode}
            onValueChange={(value) => setPreviewMode(value as PreviewMode)}
            className="absolute left-1/2 -translate-x-1/2"
          >
            <TabsList className="h-8">
              <TabsTrigger value="desktop" className="h-7 px-2 gap-1.5">
                <Monitor className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Desktop</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="h-7 px-2 gap-1.5">
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Mobile</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
          {showThemeToggle && <ThemeToggle />}
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
        {activeTab === 'source' && <SourceEditor onApply={onSourceApply} />}
      </div>
    </div>
  );
}
