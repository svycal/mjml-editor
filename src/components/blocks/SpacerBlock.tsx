import { BlockWrapper } from './BlockWrapper';
import type { MjmlNode } from '@/types/mjml';

interface SpacerBlockProps {
  node: MjmlNode;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

export function SpacerBlock({ node, isSelected, onSelect }: SpacerBlockProps) {
  const height = node.attributes.height || '20px';

  return (
    <BlockWrapper
      id={node._id!}
      label="Spacer"
      isSelected={isSelected}
      onSelect={onSelect}
    >
      <div className="p-2">
        <div
          className="bg-muted/50 border border-dashed border-muted-foreground/30 rounded flex items-center justify-center text-xs text-muted-foreground"
          style={{ height }}
        >
          {height}
        </div>
      </div>
    </BlockWrapper>
  );
}
