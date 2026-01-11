import { useEditor } from '@/context/EditorContext';
import { VisualColumn } from './VisualColumn';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';
import { buildPadding } from './helpers';

interface VisualSectionProps {
  node: MjmlNode;
}

export function VisualSection({ node }: VisualSectionProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Handle wrapper - render children sections
  if (node.tagName === 'mj-wrapper') {
    // Primary attributes
    const bgColor = node.attributes['background-color'] || 'transparent';
    const padding = buildPadding(node.attributes, '20px 0');
    const fullWidth = node.attributes['full-width'] === 'full-width';
    const textAlign = node.attributes['text-align'] || 'center';

    // Background attributes
    const bgUrl = node.attributes['background-url'];
    const bgSize = node.attributes['background-size'] || 'auto';
    const bgRepeat = node.attributes['background-repeat'] || 'repeat';
    const bgPosition = node.attributes['background-position'] || 'top center';
    const bgPositionX = node.attributes['background-position-x'];
    const bgPositionY = node.attributes['background-position-y'];

    // Border attributes
    const border = node.attributes['border'];
    const borderTop = node.attributes['border-top'];
    const borderRight = node.attributes['border-right'];
    const borderBottom = node.attributes['border-bottom'];
    const borderLeft = node.attributes['border-left'];
    const borderRadius = node.attributes['border-radius'];

    // Gap between child sections
    const gap = node.attributes['gap'];

    // Compute background position
    let computedBgPosition = bgPosition;
    if (bgPositionX || bgPositionY) {
      computedBgPosition = `${bgPositionX || 'center'} ${bgPositionY || 'center'}`;
    }

    const wrapperStyle: React.CSSProperties = {
      backgroundColor: bgColor,
      backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
      backgroundSize: bgSize,
      backgroundRepeat: bgRepeat,
      backgroundPosition: computedBgPosition,
      padding: padding,
      textAlign: textAlign as React.CSSProperties['textAlign'],
    };

    // Only add border properties if they have values
    if (border) wrapperStyle.border = border;
    if (borderTop) wrapperStyle.borderTop = borderTop;
    if (borderRight) wrapperStyle.borderRight = borderRight;
    if (borderBottom) wrapperStyle.borderBottom = borderBottom;
    if (borderLeft) wrapperStyle.borderLeft = borderLeft;
    if (borderRadius) wrapperStyle.borderRadius = borderRadius;

    // Style for the inner container that holds child sections
    const innerStyle: React.CSSProperties = {
      margin: '0 auto',
      maxWidth: fullWidth ? '100%' : '600px',
      display: 'flex',
      flexDirection: 'column',
      gap: gap || undefined,
    };

    return (
      <div
        className={cn(
          'relative cursor-pointer transition-all',
          isSelected && 'ring-2 ring-indigo-500 ring-inset'
        )}
        style={wrapperStyle}
        onClick={handleClick}
      >
        <div style={innerStyle}>
          {node.children?.map((child) => (
            <VisualSection key={child._id} node={child} />
          ))}
        </div>
      </div>
    );
  }

  // Handle section
  if (node.tagName === 'mj-section') {
    // Primary attributes (sections are transparent by default in MJML)
    const bgColor = node.attributes['background-color'] || 'transparent';
    const padding = buildPadding(node.attributes, '20px 0');
    const fullWidth = node.attributes['full-width'] === 'full-width';
    const textAlign = node.attributes['text-align'] || 'center';

    // Background attributes
    const bgUrl = node.attributes['background-url'];
    const bgSize = node.attributes['background-size'] || 'auto';
    const bgRepeat = node.attributes['background-repeat'] || 'repeat';
    const bgPosition = node.attributes['background-position'] || 'top center';
    const bgPositionX = node.attributes['background-position-x'];
    const bgPositionY = node.attributes['background-position-y'];

    // Border attributes
    const border = node.attributes['border'];
    const borderTop = node.attributes['border-top'];
    const borderRight = node.attributes['border-right'];
    const borderBottom = node.attributes['border-bottom'];
    const borderLeft = node.attributes['border-left'];
    const borderRadius = node.attributes['border-radius'];

    // Direction
    const direction = node.attributes['direction'] || 'ltr';

    // Compute background position
    let computedBgPosition = bgPosition;
    if (bgPositionX || bgPositionY) {
      computedBgPosition = `${bgPositionX || 'center'} ${bgPositionY || 'center'}`;
    }

    // Get columns
    const columns =
      node.children?.filter((c) => c.tagName === 'mj-column') || [];
    const columnCount = columns.length || 1;

    const sectionStyle: React.CSSProperties = {
      backgroundColor: bgColor,
      backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
      backgroundSize: bgSize,
      backgroundRepeat: bgRepeat,
      backgroundPosition: computedBgPosition,
      padding: padding,
      textAlign: textAlign as React.CSSProperties['textAlign'],
      direction: direction as React.CSSProperties['direction'],
    };

    // Only add border properties if they have values
    if (border) sectionStyle.border = border;
    if (borderTop) sectionStyle.borderTop = borderTop;
    if (borderRight) sectionStyle.borderRight = borderRight;
    if (borderBottom) sectionStyle.borderBottom = borderBottom;
    if (borderLeft) sectionStyle.borderLeft = borderLeft;
    if (borderRadius) sectionStyle.borderRadius = borderRadius;

    return (
      <div
        className={cn(
          'relative cursor-pointer transition-all',
          isSelected && 'ring-2 ring-indigo-500 ring-inset'
        )}
        style={sectionStyle}
        onClick={handleClick}
      >
        {/* Columns container */}
        <div
          className="flex"
          style={{
            margin: '0 auto',
            maxWidth: fullWidth ? '100%' : '600px',
          }}
        >
          {columns.map((column) => (
            <VisualColumn
              key={column._id}
              node={column}
              totalColumns={columnCount}
            />
          ))}
        </div>

        {/* Empty section state */}
        {columns.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Empty section - add a column
          </div>
        )}
      </div>
    );
  }

  // Handle group (similar to section but columns don't stack on mobile)
  if (node.tagName === 'mj-group') {
    const columns =
      node.children?.filter((c) => c.tagName === 'mj-column') || [];
    const columnCount = columns.length || 1;

    return (
      <div
        className={cn(
          'relative cursor-pointer transition-all flex',
          isSelected && 'ring-2 ring-indigo-500 ring-inset'
        )}
        onClick={handleClick}
      >
        {columns.map((column) => (
          <VisualColumn
            key={column._id}
            node={column}
            totalColumns={columnCount}
          />
        ))}
      </div>
    );
  }

  // Fallback for unknown section types
  return (
    <div
      className={cn(
        'p-4 bg-muted border border-dashed border-border cursor-pointer',
        isSelected && 'ring-2 ring-indigo-500'
      )}
      onClick={handleClick}
    >
      <span className="text-sm text-muted-foreground">
        Unknown: {node.tagName}
      </span>
    </div>
  );
}
