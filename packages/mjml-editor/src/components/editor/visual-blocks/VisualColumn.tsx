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

  // Primary attributes
  const bgColor = node.attributes['background-color'] || 'transparent';
  const padding = node.attributes['padding'] || '0';
  const verticalAlign = node.attributes['vertical-align'] || 'top';

  // Border attributes
  const border = node.attributes['border'];
  const borderTop = node.attributes['border-top'];
  const borderRight = node.attributes['border-right'];
  const borderBottom = node.attributes['border-bottom'];
  const borderLeft = node.attributes['border-left'];
  const borderRadius = node.attributes['border-radius'];

  // Inner styling attributes
  const innerBgColor = node.attributes['inner-background-color'];
  const innerBorder = node.attributes['inner-border'];
  const innerBorderTop = node.attributes['inner-border-top'];
  const innerBorderRight = node.attributes['inner-border-right'];
  const innerBorderBottom = node.attributes['inner-border-bottom'];
  const innerBorderLeft = node.attributes['inner-border-left'];
  const innerBorderRadius = node.attributes['inner-border-radius'];

  // Direction
  const direction = node.attributes['direction'] || 'ltr';

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

  // Outer column styles
  const columnStyle: React.CSSProperties = {
    width: width,
    backgroundColor: bgColor,
    padding: padding,
    verticalAlign: verticalAlign,
    border: border || undefined,
    borderTop: borderTop || undefined,
    borderRight: borderRight || undefined,
    borderBottom: borderBottom || undefined,
    borderLeft: borderLeft || undefined,
    borderRadius: borderRadius || undefined,
    direction: direction as React.CSSProperties['direction'],
  };

  // Inner wrapper styles (only used when inner styling is present)
  const innerStyle: React.CSSProperties = {
    backgroundColor: innerBgColor || undefined,
    border: innerBorder || undefined,
    borderTop: innerBorderTop || undefined,
    borderRight: innerBorderRight || undefined,
    borderBottom: innerBorderBottom || undefined,
    borderLeft: innerBorderLeft || undefined,
    borderRadius: innerBorderRadius || undefined,
  };

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
