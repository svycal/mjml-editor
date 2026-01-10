import { BlockWrapper } from './BlockWrapper';
import type { MjmlNode } from '@/types/mjml';

interface DividerBlockProps {
  node: MjmlNode;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

export function DividerBlock({ node, isSelected, onSelect }: DividerBlockProps) {
  const borderColor = node.attributes['border-color'] || '#000000';
  const borderWidth = node.attributes['border-width'] || '4px';
  const borderStyle = node.attributes['border-style'] || 'solid';
  const width = node.attributes.width || '100%';

  return (
    <BlockWrapper
      id={node._id!}
      label="Divider"
      isSelected={isSelected}
      onSelect={onSelect}
    >
      <div className="p-2">
        <hr
          style={{
            borderTop: `${borderWidth} ${borderStyle} ${borderColor}`,
            width,
            margin: '0 auto',
          }}
        />
      </div>
    </BlockWrapper>
  );
}
