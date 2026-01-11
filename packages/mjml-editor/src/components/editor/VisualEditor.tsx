import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisualSection } from './visual-blocks/VisualSection';

export function VisualEditor() {
  const { state, selectBlock } = useEditor();

  // Get the body node
  const body = state.document.children?.find((c) => c.tagName === 'mj-body');

  // Get body width (MJML default is 600px)
  const bodyWidth = body?.attributes['width'] || '600px';
  // Get body background color
  const bodyBackgroundColor = body?.attributes['background-color'];

  // Click on empty area deselects
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  // Apply body background color to the scroll viewport
  const viewportStyle = {
    '--body-bg': bodyBackgroundColor || '#ffffff',
  } as React.CSSProperties;

  return (
    <ScrollArea
      className="h-full"
      style={viewportStyle}
      data-body-bg={bodyBackgroundColor || '#ffffff'}
    >
      <div
        className="min-h-full py-8 px-4"
        style={{ backgroundColor: bodyBackgroundColor || '#ffffff' }}
        onClick={handleBackgroundClick}
      >
        {/* Content container - constrained to body width */}
        <div
          className="light mx-auto w-full"
          style={{ maxWidth: bodyWidth }}
        >
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
