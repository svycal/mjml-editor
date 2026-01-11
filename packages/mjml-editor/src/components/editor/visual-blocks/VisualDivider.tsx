import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';
import { buildPadding } from './helpers';
import { useResolvedAttributes } from './useResolvedAttributes';

interface VisualDividerProps {
  node: MjmlNode;
}

export function VisualDivider({ node }: VisualDividerProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;
  const attrs = useResolvedAttributes(node);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Parse resolved attributes - Primary
  const borderColor = attrs['border-color'] || '#000000';
  const borderWidth = attrs['border-width'] || '4px';
  const borderStyle = attrs['border-style'] || 'solid';
  const width = attrs['width'] || '100%';
  const align = attrs['align'] || 'center';
  const padding = buildPadding(attrs, '10px 25px');

  // Advanced attributes
  const containerBgColor = attrs['container-background-color'];

  // Convert align to margin
  const marginLeft =
    align === 'right' ? 'auto' : align === 'center' ? 'auto' : '0';
  const marginRight =
    align === 'left' ? 'auto' : align === 'center' ? 'auto' : '0';

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset',
        attrs['css-class']
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
