import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';
import { buildPadding } from './helpers';
import { useResolvedAttributes } from './useResolvedAttributes';

interface VisualImageProps {
  node: MjmlNode;
}

export function VisualImage({ node }: VisualImageProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;
  const attrs = useResolvedAttributes(node);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Parse resolved attributes - Primary
  const src = attrs['src'] || '';
  const alt = attrs['alt'] || '';
  const width = attrs['width'] || '100%';
  const height = attrs['height'] || 'auto';
  const align = attrs['align'] || 'center';
  const padding = buildPadding(attrs, '10px 25px');

  // Border attributes
  const border = attrs['border'];
  const borderTop = attrs['border-top'];
  const borderRight = attrs['border-right'];
  const borderBottom = attrs['border-bottom'];
  const borderLeft = attrs['border-left'];
  const borderRadius = attrs['border-radius'];

  // Sizing attributes
  const maxHeight = attrs['max-height'];

  // Advanced attributes
  const containerBgColor = attrs['container-background-color'];
  const title = attrs['title'];

  // Convert align to flexbox
  const justifyContent =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  // Container styles
  const containerStyle: React.CSSProperties = {
    padding,
    display: 'flex',
    justifyContent,
  };

  if (containerBgColor) containerStyle.backgroundColor = containerBgColor;

  // Image styles
  const imageStyle: React.CSSProperties = {
    width: width,
    height: height,
    maxWidth: '100%',
    display: 'block',
  };

  // Only add optional properties if they have values
  if (maxHeight) imageStyle.maxHeight = maxHeight;
  if (border) imageStyle.border = border;
  if (borderTop) imageStyle.borderTop = borderTop;
  if (borderRight) imageStyle.borderRight = borderRight;
  if (borderBottom) imageStyle.borderBottom = borderBottom;
  if (borderLeft) imageStyle.borderLeft = borderLeft;
  if (borderRadius) imageStyle.borderRadius = borderRadius;

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset'
      )}
      style={containerStyle}
      onClick={handleClick}
    >
      {src ? (
        <img src={src} alt={alt} title={title} style={imageStyle} />
      ) : (
        <div
          className="bg-muted flex items-center justify-center text-muted-foreground"
          style={{
            width: width === '100%' ? '100%' : width,
            height: height === 'auto' ? '150px' : height,
            ...(borderRadius && { borderRadius }),
          }}
        >
          No image
        </div>
      )}
    </div>
  );
}
