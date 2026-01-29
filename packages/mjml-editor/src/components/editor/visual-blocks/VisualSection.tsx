import { useEditor } from '@/context/EditorContext';
import { useExtensions } from '@/context/ExtensionsContext';
import { VisualColumn } from './VisualColumn';
import { ConditionalIndicator } from './ConditionalIndicator';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';
import { buildPadding } from './helpers';
import { useResolvedAttributes } from './useResolvedAttributes';

interface VisualSectionProps {
  node: MjmlNode;
}

export function VisualSection({ node }: VisualSectionProps) {
  const { state, selectBlock } = useEditor();
  const extensions = useExtensions();
  const isSelected = state.selectedBlockId === node._id;
  const attrs = useResolvedAttributes(node);

  // Only show condition indicator if extension is enabled
  const condition = extensions.conditionalBlocks ? attrs['sc-if'] : undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Handle wrapper - render children sections
  if (node.tagName === 'mj-wrapper') {
    // Primary attributes
    const bgColor = attrs['background-color'] || 'transparent';
    const padding = buildPadding(attrs, '20px 0');
    const fullWidth = attrs['full-width'] === 'full-width';
    const textAlign = attrs['text-align'] || 'center';

    // Background attributes
    const bgUrl = attrs['background-url'];
    const bgSize = attrs['background-size'] || 'auto';
    const bgRepeat = attrs['background-repeat'] || 'repeat';
    const bgPosition = attrs['background-position'] || 'top center';
    const bgPositionX = attrs['background-position-x'];
    const bgPositionY = attrs['background-position-y'];

    // Border attributes
    const border = attrs['border'];
    const borderTop = attrs['border-top'];
    const borderRight = attrs['border-right'];
    const borderBottom = attrs['border-bottom'];
    const borderLeft = attrs['border-left'];
    const borderRadius = attrs['border-radius'];

    // Gap between child sections
    const gap = attrs['gap'];

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
          isSelected && 'ring-2 ring-indigo-500 ring-inset',
          attrs['css-class']
        )}
        style={wrapperStyle}
        onClick={handleClick}
      >
        <ConditionalIndicator condition={condition} />
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
    const bgColor = attrs['background-color'] || 'transparent';
    const padding = buildPadding(attrs, '20px 0');
    const fullWidth = attrs['full-width'] === 'full-width';
    const textAlign = attrs['text-align'] || 'center';

    // Background attributes
    const bgUrl = attrs['background-url'];
    const bgSize = attrs['background-size'] || 'auto';
    const bgRepeat = attrs['background-repeat'] || 'repeat';
    const bgPosition = attrs['background-position'] || 'top center';
    const bgPositionX = attrs['background-position-x'];
    const bgPositionY = attrs['background-position-y'];

    // Border attributes
    const border = attrs['border'];
    const borderTop = attrs['border-top'];
    const borderRight = attrs['border-right'];
    const borderBottom = attrs['border-bottom'];
    const borderLeft = attrs['border-left'];
    const borderRadius = attrs['border-radius'];

    // Direction
    const direction = attrs['direction'] || 'ltr';

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
          isSelected && 'ring-2 ring-indigo-500 ring-inset',
          attrs['css-class']
        )}
        style={sectionStyle}
        onClick={handleClick}
      >
        <ConditionalIndicator condition={condition} />
        {/* Columns container */}
        <div
          className="flex"
          style={{
            margin: '0 auto',
            maxWidth: fullWidth ? '100%' : '600px',
            minHeight: columns.length === 0 ? '20px' : undefined,
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
          isSelected && 'ring-2 ring-indigo-500 ring-inset',
          attrs['css-class']
        )}
        onClick={handleClick}
      >
        <ConditionalIndicator condition={condition} />
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
