import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BlockWrapper } from './BlockWrapper';
import { BlockTree } from '@/components/editor/BlockTree';
import { AddBlockButton } from '@/components/editor/AddBlockButton';
import { SortableBlock } from './SortableBlock';
import type { MjmlNode } from '@/types/mjml';

interface ColumnBlockProps {
  node: MjmlNode;
  index: number;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

export function ColumnBlock({ node, index, isSelected, onSelect }: ColumnBlockProps) {
  const children = node.children || [];
  const childIds = children.map((child) => child._id!);

  return (
    <BlockWrapper
      id={node._id!}
      label={`Column ${index + 1}`}
      isSelected={isSelected}
      onSelect={onSelect}
      className="min-h-[60px] bg-background"
    >
      <div
        className="p-2 space-y-2"
        style={{
          backgroundColor: node.attributes['background-color'] || undefined,
        }}
      >
        {children.length === 0 ? (
          <div className="text-center py-4">
            <AddBlockButton parentId={node._id!} index={0} showLabel />
          </div>
        ) : (
          <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
            {children.map((child, childIndex) => (
              <div key={child._id} className="group">
                <SortableBlock id={child._id!}>
                  <BlockTree node={child} index={childIndex} />
                </SortableBlock>
                <AddBlockButton parentId={node._id!} index={childIndex + 1} />
              </div>
            ))}
          </SortableContext>
        )}
      </div>
    </BlockWrapper>
  );
}
