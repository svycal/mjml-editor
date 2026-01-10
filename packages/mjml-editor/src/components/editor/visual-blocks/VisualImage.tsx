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

  // Parse attributes
  const src = node.attributes['src'] || '';
  const alt = node.attributes['alt'] || '';
  const width = node.attributes['width'] || '100%';
  const height = node.attributes['height'] || 'auto';
  const align = node.attributes['align'] || 'center';
  const borderRadius = node.attributes['border-radius'] || '0';
  const padding = node.attributes['padding'] || '10px 25px';

  // Convert align to flexbox
  const justifyContent =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset'
      )}
      style={{
        padding,
        display: 'flex',
        justifyContent,
      }}
      onClick={handleClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: width,
            height: height,
            borderRadius: borderRadius,
            maxWidth: '100%',
            display: 'block',
          }}
        />
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
