import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisualSection } from './visual-blocks/VisualSection';
import { useFontLoader } from '@/hooks/useFontLoader';
import {
  useStyleLoader,
  VISUAL_EDITOR_SCOPE_CLASS,
} from '@/hooks/useStyleLoader';
import { createEmptyDocument } from '@/lib/mjml/parser';
import type { MjmlNode } from '@/types/mjml';

/**
 * Check if the document has a valid structure for visual editing
 */
function hasValidStructure(document: MjmlNode): boolean {
  if (document.tagName !== 'mjml') return false;
  return document.children?.some((c) => c.tagName === 'mj-body') ?? false;
}

// Panel dimensions for calculating scroll gutters
const LEFT_PANEL_WIDTH = 256;
const RIGHT_PANEL_WIDTH = 300;
const PANEL_MARGIN = 12;
const GUTTER_PADDING = 24; // Extra space beyond the panel edge

interface VisualEditorProps {
  leftPanelOpen?: boolean;
  rightPanelOpen?: boolean;
}

export function VisualEditor({
  leftPanelOpen,
  rightPanelOpen,
}: VisualEditorProps) {
  const { state, selectBlock, setDocument } = useEditor();

  // Load custom fonts into the document head
  useFontLoader();

  // Load mj-style CSS into the document head (scoped to visual editor)
  useStyleLoader();

  // Handler to reset document to a valid blank template
  const handleResetDocument = () => {
    setDocument(createEmptyDocument());
  };

  // Check for invalid document structure
  if (!hasValidStructure(state.document)) {
    return (
      <ScrollArea className="h-full" viewportStyle={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-center justify-center p-8 min-h-[400px]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <p className="text-red-700 font-medium mb-2">
              Invalid MJML structure
            </p>
            <p className="text-red-600 text-sm mb-4">
              The document is missing required elements like mj-body. Reset to a
              blank template to continue editing.
            </p>
            <button
              onClick={handleResetDocument}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Reset to blank template
            </button>
          </div>
        </div>
      </ScrollArea>
    );
  }

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

  // Calculate gutter widths based on panel visibility
  const leftGutter = leftPanelOpen
    ? LEFT_PANEL_WIDTH + PANEL_MARGIN + GUTTER_PADDING
    : 16;
  const rightGutter = rightPanelOpen
    ? RIGHT_PANEL_WIDTH + PANEL_MARGIN + GUTTER_PADDING
    : 16;

  // Parse body width to number for min-width calculation
  const bodyWidthNum = parseInt(bodyWidth, 10) || 600;
  const minContentWidth = bodyWidthNum + leftGutter + rightGutter;

  return (
    <ScrollArea
      className="h-full"
      orientation="both"
      viewportStyle={{ backgroundColor: bodyBackgroundColor || '#ffffff' }}
    >
      <div
        className="py-8"
        style={{
          paddingLeft: leftGutter,
          paddingRight: rightGutter,
          minWidth: minContentWidth,
        }}
        onClick={handleBackgroundClick}
      >
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
            <div className="bg-zinc-100 rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center">
              <p className="text-zinc-500">
                Add a section to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
