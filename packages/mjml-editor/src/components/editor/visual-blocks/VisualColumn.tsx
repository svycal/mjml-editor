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

  // Ensure we have a proper attributes object - defensive copy
  const attrs = node.attributes || {};

  // Parse width - MJML columns default to equal width
  const widthAttr = attrs['width'];
  let width: string;
  if (widthAttr) {
    width = widthAttr;
  } else {
    // Default equal width distribution
    width = `${100 / totalColumns}%`;
  }

  // Primary attributes
  const bgColor = attrs['background-color'] || 'transparent';
  const padding = attrs['padding'] || '0';
  const verticalAlign = attrs['vertical-align'] || 'top';

  // Border attributes
  const border = attrs['border'];
  const borderTop = attrs['border-top'];
  const borderRight = attrs['border-right'];
  const borderBottom = attrs['border-bottom'];
  const borderLeft = attrs['border-left'];
  const borderRadius = attrs['border-radius'];

  // Inner styling attributes
  const innerBgColor = attrs['inner-background-color'];
  const innerBorder = attrs['inner-border'];
  const innerBorderTop = attrs['inner-border-top'];
  const innerBorderRight = attrs['inner-border-right'];
  const innerBorderBottom = attrs['inner-border-bottom'];
  const innerBorderLeft = attrs['inner-border-left'];
  const innerBorderRadius = attrs['inner-border-radius'];

  // Direction
  const direction = attrs['direction'] || 'ltr';

  // Check if we have any inner styling
  const hasInnerStyling =
    innerBgColor ||
    innerBorder ||
    innerBorderTop ||
    innerBorderRight ||
    innerBorderBottom ||
    innerBorderLeft ||
    innerBorderRadius;

  // Get content blocks
  const contentBlocks = node.children || [];

  // Outer column styles - build explicitly to avoid any edge cases
  const columnStyle: React.CSSProperties = {
    width: width,
    backgroundColor: bgColor,
    padding: padding,
    verticalAlign: verticalAlign,
    direction: direction as React.CSSProperties['direction'],
  };

  // Only add border properties if they have values
  if (border) columnStyle.border = border;
  if (borderTop) columnStyle.borderTop = borderTop;
  if (borderRight) columnStyle.borderRight = borderRight;
  if (borderBottom) columnStyle.borderBottom = borderBottom;
  if (borderLeft) columnStyle.borderLeft = borderLeft;
  if (borderRadius) columnStyle.borderRadius = borderRadius;

  // Inner wrapper styles (only used when inner styling is present)
  const innerStyle: React.CSSProperties = {};
  if (innerBgColor) innerStyle.backgroundColor = innerBgColor;
  if (innerBorder) innerStyle.border = innerBorder;
  if (innerBorderTop) innerStyle.borderTop = innerBorderTop;
  if (innerBorderRight) innerStyle.borderRight = innerBorderRight;
  if (innerBorderBottom) innerStyle.borderBottom = innerBorderBottom;
  if (innerBorderLeft) innerStyle.borderLeft = innerBorderLeft;
  if (innerBorderRadius) innerStyle.borderRadius = innerBorderRadius;

  return (
    <div
      className={cn(
        'relative transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset'
      )}
      style={columnStyle}
      onClick={handleClick}
    >
      {hasInnerStyling ? (
        <div style={innerStyle}>
          {contentBlocks.map((block) => (
            <VisualBlock key={block._id} node={block} />
          ))}
          {contentBlocks.length === 0 && (
            <div
              className="py-8 text-center text-muted-foreground text-sm cursor-pointer hover:bg-muted transition-colors"
              onClick={handleClick}
            >
              Empty column
            </div>
          )}
        </div>
      ) : (
        <>
          {contentBlocks.map((block) => (
            <VisualBlock key={block._id} node={block} />
          ))}
          {contentBlocks.length === 0 && (
            <div
              className="py-8 text-center text-muted-foreground text-sm cursor-pointer hover:bg-muted transition-colors"
              onClick={handleClick}
            >
              Empty column
            </div>
          )}
        </>
      )}
    </div>
  );
}
