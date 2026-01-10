import { Plus } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { BlockWrapper } from './BlockWrapper';
import { BlockTree } from '@/components/editor/BlockTree';
import { AddBlockButton } from '@/components/editor/AddBlockButton';
import type { MjmlNode } from '@/types/mjml';
import { cn } from '@/lib/utils';

interface SectionBlockProps {
  node: MjmlNode;
  index: number;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

export function SectionBlock({ node, index, isSelected, onSelect }: SectionBlockProps) {
  const { addColumn } = useEditor();
  const columns = node.children || [];

  const handleAddColumn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node._id) {
      addColumn(node._id);
    }
  };

  return (
    <div className="mb-4">
      <BlockWrapper
        id={node._id!}
        label={`Section ${index + 1}`}
        isSelected={isSelected}
        onSelect={onSelect}
        className="bg-muted/20"
      >
        <div className="p-3">
          {/* Section background preview */}
          {node.attributes['background-color'] && (
            <div
              className="absolute inset-0 rounded opacity-20 pointer-events-none"
              style={{ backgroundColor: node.attributes['background-color'] }}
            />
          )}

          {/* Columns */}
          <div className="flex gap-2 relative">
            {columns.map((column, columnIndex) => (
              <div
                key={column._id}
                className={cn(
                  'flex-1 min-w-0',
                  column.attributes.width && 'flex-none'
                )}
                style={{
                  width: column.attributes.width || undefined,
                }}
              >
                <BlockTree node={column} index={columnIndex} />
              </div>
            ))}

            {/* Add column button */}
            {columns.length < 4 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-full min-h-[60px] border border-dashed border-border rounded-lg text-foreground-muted hover:border-border-strong hover:text-foreground hover:bg-accent/50 transition-smooth"
                onClick={handleAddColumn}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Column
              </Button>
            )}
          </div>
        </div>
      </BlockWrapper>

      {/* Add block button after section */}
      <AddBlockButton parentId={node._id!} index={-1} isSection />
    </div>
  );
}
