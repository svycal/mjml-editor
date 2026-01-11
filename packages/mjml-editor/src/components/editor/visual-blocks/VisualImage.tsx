import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualImageProps {
  node: MjmlNode;
}

export function VisualImage({ node }: VisualImageProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Parse attributes - Primary
  const src = node.attributes['src'] || '';
  const alt = node.attributes['alt'] || '';
  const width = node.attributes['width'] || '100%';
  const height = node.attributes['height'] || 'auto';
  const align = node.attributes['align'] || 'center';
  const padding = node.attributes['padding'] || '10px 25px';

  // Border attributes
  const border = node.attributes['border'] || '0';
  const borderTop = node.attributes['border-top'];
  const borderRight = node.attributes['border-right'];
  const borderBottom = node.attributes['border-bottom'];
  const borderLeft = node.attributes['border-left'];
  const borderRadius = node.attributes['border-radius'] || '0';

  // Sizing attributes
  const maxHeight = node.attributes['max-height'];

  // Advanced attributes
  const containerBgColor = node.attributes['container-background-color'];
  const title = node.attributes['title'];

  // Convert align to flexbox
  const justifyContent =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  // Container styles
  const containerStyle: React.CSSProperties = {
    padding,
    display: 'flex',
    justifyContent,
    backgroundColor: containerBgColor || undefined,
  };

  // Image styles
  const imageStyle: React.CSSProperties = {
    width: width,
    height: height,
    maxWidth: '100%',
    maxHeight: maxHeight || undefined,
    display: 'block',
    border: border,
    borderTop: borderTop || undefined,
    borderRight: borderRight || undefined,
    borderBottom: borderBottom || undefined,
    borderLeft: borderLeft || undefined,
    borderRadius: borderRadius,
  };

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
            borderRadius: borderRadius,
          }}
        >
          No image
        </div>
      )}
    </div>
  );
}
