import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisualSection } from './visual-blocks/VisualSection';
import { useFontLoader } from '@/hooks/useFontLoader';
import {
  useStyleLoader,
  VISUAL_EDITOR_SCOPE_CLASS,
} from '@/hooks/useStyleLoader';

export function VisualEditor() {
  const { state, selectBlock } = useEditor();

  // Load custom fonts into the document head
  useFontLoader();

  // Load mj-style CSS into the document head (scoped to visual editor)
  useStyleLoader();

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

  return (
    <ScrollArea
      className="h-full"
      viewportStyle={{ backgroundColor: bodyBackgroundColor || '#ffffff' }}
    >
      <div className="py-8 px-4" onClick={handleBackgroundClick}>
        {/* Content container - constrained to body width */}
        <div
          className={`light mx-auto w-full ${VISUAL_EDITOR_SCOPE_CLASS}`}
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
