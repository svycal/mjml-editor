import { BlockWrapper } from './BlockWrapper';
import type { MjmlNode } from '@/types/mjml';

interface ImageBlockProps {
  node: MjmlNode;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

export function ImageBlock({ node, isSelected, onSelect }: ImageBlockProps) {
  const src = node.attributes.src || '';
  const alt = node.attributes.alt || '';
  const width = node.attributes.width;
  const borderRadius = node.attributes['border-radius'];

  return (
    <BlockWrapper
      id={node._id!}
      label="Image"
      isSelected={isSelected}
      onSelect={onSelect}
    >
      <div
        className="p-2"
        style={{
          textAlign: (node.attributes.align as React.CSSProperties['textAlign']) || 'center',
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto inline-block"
            style={{
              width: width || undefined,
              borderRadius: borderRadius || undefined,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-24 bg-muted rounded text-muted-foreground text-sm">
            No image source set
          </div>
        )}
      </div>
    </BlockWrapper>
  );
}
