import { useEditor } from '@/context/EditorContext';
import type { MjmlNode } from '@/types/mjml';
import { SectionBlock } from '@/components/blocks/SectionBlock';
import { ColumnBlock } from '@/components/blocks/ColumnBlock';
import { TextBlock } from '@/components/blocks/TextBlock';
import { ImageBlock } from '@/components/blocks/ImageBlock';
import { ButtonBlock } from '@/components/blocks/ButtonBlock';
import { DividerBlock } from '@/components/blocks/DividerBlock';
import { SpacerBlock } from '@/components/blocks/SpacerBlock';

interface BlockTreeProps {
  node: MjmlNode;
  index: number;
}

export function BlockTree({ node, index }: BlockTreeProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id || null);
  };

  // Render based on tag name
  switch (node.tagName) {
    case 'mj-section':
      return (
        <SectionBlock
          node={node}
          index={index}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );

    case 'mj-column':
      return (
        <ColumnBlock
          node={node}
          index={index}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );

    case 'mj-text':
      return (
        <TextBlock
          node={node}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );

    case 'mj-image':
      return (
        <ImageBlock
          node={node}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );

    case 'mj-button':
      return (
        <ButtonBlock
          node={node}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );

    case 'mj-divider':
      return (
        <DividerBlock
          node={node}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );

    case 'mj-spacer':
      return (
        <SpacerBlock
          node={node}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );

    default:
      return (
        <div className="p-2 border border-dashed border-muted-foreground/30 rounded text-xs text-muted-foreground">
          Unknown: {node.tagName}
        </div>
      );
  }
}
