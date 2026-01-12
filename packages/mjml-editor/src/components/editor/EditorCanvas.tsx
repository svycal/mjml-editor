import { VisualEditor } from './VisualEditor';
import { InteractivePreview } from './InteractivePreview';
import { SourceEditor } from './SourceEditor';
import { cn } from '@/lib/utils';

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

  return (
    <div className="flex flex-col h-full">
      {/* Tab header */}
      <div className="h-11 px-4 flex items-center gap-1 border-b border-border bg-background">
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
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'edit' && (
          <VisualEditor
            leftPanelOpen={leftPanelOpen}
            rightPanelOpen={rightPanelOpen}
          />
        )}
        {activeTab === 'preview' && <InteractivePreview showHeader={false} />}
        {activeTab === 'source' && <SourceEditor />}
      </div>
    </div>
  );
}
