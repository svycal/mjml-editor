import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';
import { buildPadding } from './helpers';

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

  // Parse attributes - Primary
  const borderColor = node.attributes['border-color'] || '#000000';
  const borderWidth = node.attributes['border-width'] || '4px';
  const borderStyle = node.attributes['border-style'] || 'solid';
  const width = node.attributes['width'] || '100%';
  const align = node.attributes['align'] || 'center';
  const padding = buildPadding(node.attributes, '10px 25px');

  // Advanced attributes
  const containerBgColor = node.attributes['container-background-color'];

  // Convert align to margin
  const marginLeft =
    align === 'right' ? 'auto' : align === 'center' ? 'auto' : '0';
  const marginRight =
    align === 'left' ? 'auto' : align === 'center' ? 'auto' : '0';

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset'
      )}
      style={{
        padding,
        ...(containerBgColor && { backgroundColor: containerBgColor }),
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width,
          marginLeft,
          marginRight,
          borderTopColor: borderColor,
          borderTopWidth: borderWidth,
          borderTopStyle: borderStyle as 'solid' | 'dashed' | 'dotted',
        }}
      />
    </div>
  );
}
