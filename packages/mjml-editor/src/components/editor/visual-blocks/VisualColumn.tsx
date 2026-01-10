import { useEditor } from '@/context/EditorContext';
import { VisualBlock } from './VisualBlock';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualColumnProps {
  node: MjmlNode;
  totalColumns: number;
}

export function VisualColumn({ node, totalColumns }: VisualColumnProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Parse width - MJML columns default to equal width
  const widthAttr = node.attributes['width'];
  let width: string;
  if (widthAttr) {
    width = widthAttr;
  } else {
    // Default equal width distribution
    width = `${100 / totalColumns}%`;
  }

  const bgColor = node.attributes['background-color'] || 'transparent';
  const padding = node.attributes['padding'] || '0';
  const verticalAlign = node.attributes['vertical-align'] || 'top';

  // Get content blocks
  const contentBlocks = node.children || [];

  return (
    <div
      className={cn(
        'relative transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset'
      )}
      style={{
        width: width,
        backgroundColor: bgColor,
        padding: padding,
        verticalAlign: verticalAlign,
      }}
      onClick={handleClick}
    >
      {contentBlocks.map((block) => (
        <VisualBlock key={block._id} node={block} />
      ))}

      {/* Empty column placeholder */}
      {contentBlocks.length === 0 && (
        <div
          className="py-8 text-center text-gray-400 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleClick}
        >
          Empty column
        </div>
      )}
    </div>
  );
}
