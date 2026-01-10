import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisualSection } from './visual-blocks/VisualSection';

export function VisualEditor() {
  const { state, selectBlock } = useEditor();

  // Get the body node
  const body = state.document.children?.find((c) => c.tagName === 'mj-body');

  // Click on empty area deselects
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div
        className="light min-h-full py-8 px-4 bg-white"
        onClick={handleBackgroundClick}
      >
        {/* Email container - mimics MJML default 600px width */}
        <div className="mx-auto" style={{ maxWidth: '600px' }}>
          {body?.children?.map((section) => (
            <VisualSection key={section._id} node={section} />
          ))}

          {/* Empty state */}
          {(!body?.children || body.children.length === 0) && (
            <div className="bg-surface rounded-lg border-2 border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">
                Add a section to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
