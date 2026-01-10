import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualDividerProps {
  node: MjmlNode;
}

export function VisualDivider({ node }: VisualDividerProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Parse attributes
  const borderColor = node.attributes['border-color'] || '#000000';
  const borderWidth = node.attributes['border-width'] || '4px';
  const borderStyle = node.attributes['border-style'] || 'solid';
  const width = node.attributes['width'] || '100%';
  const padding = node.attributes['padding'] || '10px 25px';

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset'
      )}
      style={{ padding }}
      onClick={handleClick}
    >
      <div
        style={{
          width,
          margin: '0 auto',
          borderTopColor: borderColor,
          borderTopWidth: borderWidth,
          borderTopStyle: borderStyle as 'solid' | 'dashed' | 'dotted',
        }}
      />
    </div>
  );
}
