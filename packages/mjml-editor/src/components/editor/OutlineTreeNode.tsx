import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Columns,
  Type,
  Image,
  MousePointerClick,
  Minus,
  MoveVertical,
} from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { contentBlockTypes } from '@/lib/mjml/schema';
import type { MjmlNode, ContentBlockType } from '@/types/mjml';
import { cn } from '@/lib/utils';

interface OutlineTreeNodeProps {
  node: MjmlNode;
  depth: number;
  parentId?: string;
  index: number;
}

const blockIcons: Record<string, React.ReactNode> = {
  'mj-section': <div className="w-4 h-4 border border-current rounded-sm" />,
  'mj-column': <Columns className="h-4 w-4" />,
  'mj-text': <Type className="h-4 w-4" />,
  'mj-image': <Image className="h-4 w-4" />,
  'mj-button': <MousePointerClick className="h-4 w-4" />,
  'mj-divider': <Minus className="h-4 w-4" />,
  'mj-spacer': <MoveVertical className="h-4 w-4" />,
};

const contentBlockIcons: Record<ContentBlockType, React.ReactNode> = {
  'mj-text': <Type className="h-4 w-4" />,
  'mj-image': <Image className="h-4 w-4" />,
  'mj-button': <MousePointerClick className="h-4 w-4" />,
  'mj-divider': <Minus className="h-4 w-4" />,
  'mj-spacer': <MoveVertical className="h-4 w-4" />,
};

function getDisplayName(tagName: string): string {
  const names: Record<string, string> = {
    'mj-section': 'Section',
    'mj-column': 'Column',
    'mj-text': 'Text',
    'mj-image': 'Image',
    'mj-button': 'Button',
    'mj-divider': 'Divider',
    'mj-spacer': 'Spacer',
    'mj-wrapper': 'Wrapper',
    'mj-group': 'Group',
    'mj-hero': 'Hero',
    'mj-navbar': 'Navbar',
    'mj-social': 'Social',
    'mj-raw': 'Raw HTML',
  };
  return names[tagName] || tagName.replace('mj-', '').replace(/-/g, ' ');
}

function canHaveChildren(tagName: string): boolean {
  return ['mj-section', 'mj-column', 'mj-wrapper', 'mj-group', 'mj-hero'].includes(tagName);
}

function canAddContentBlocks(tagName: string): boolean {
  return tagName === 'mj-column';
}

function canAddColumns(tagName: string): boolean {
  return tagName === 'mj-section' || tagName === 'mj-group';
}

export function OutlineTreeNode({ node, depth }: OutlineTreeNodeProps) {
  const { state, selectBlock, deleteBlock, addBlock, addColumn } = useEditor();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const isSelected = state.selectedBlockId === node._id;
  const hasChildren = node.children && node.children.length > 0;
  const showExpandButton = canHaveChildren(node.tagName);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node._id!,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBlock(node._id!);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleAddBlock = (type: ContentBlockType) => {
    const insertIndex = node.children?.length || 0;
    addBlock(node._id!, insertIndex, type);
    setIsAddOpen(false);
  };

  const handleAddColumn = () => {
    addColumn(node._id!);
    setIsAddOpen(false);
  };

  const childIds = node.children?.map((c) => c._id!) || [];

  return (
    <div ref={setNodeRef} style={style}>
      {/* Node row */}
      <div
        className={cn(
          'group flex items-center h-8 pr-2 cursor-pointer',
          'hover:bg-accent/50 transition-colors',
          isSelected && 'bg-accent',
          isDragging && 'opacity-50'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleSelect}
      >
        {/* Drag handle - visible on hover */}
        <div
          className={cn(
            'flex items-center justify-center w-5 h-5 cursor-grab',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'text-foreground-muted hover:text-foreground'
          )}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>

        {/* Expand/collapse button */}
        {showExpandButton ? (
          <button
            className={cn(
              'flex items-center justify-center w-5 h-5',
              'text-foreground-muted hover:text-foreground transition-colors'
            )}
            onClick={handleToggleExpand}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )
            ) : (
              <ChevronRight className="h-3.5 w-3.5 opacity-30" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Icon */}
        <div className="flex items-center justify-center w-5 h-5 text-foreground-muted">
          {blockIcons[node.tagName] || <div className="w-3 h-3 bg-foreground-muted rounded-sm" />}
        </div>

        {/* Label */}
        <span className="flex-1 ml-2 text-sm truncate text-foreground">
          {getDisplayName(node.tagName)}
        </span>

        {/* Action buttons - visible on hover */}
        <div className={cn(
          'flex items-center gap-0.5',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )}>
          {/* Add button */}
          {(canAddContentBlocks(node.tagName) || canAddColumns(node.tagName)) && (
            <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 text-foreground-muted hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 p-1.5 shadow-framer-lg"
                align="start"
                onClick={(e) => e.stopPropagation()}
              >
                {canAddColumns(node.tagName) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 h-8 px-3 text-sm font-normal hover:bg-accent"
                    onClick={handleAddColumn}
                  >
                    <Columns className="h-4 w-4 text-foreground-muted" />
                    Column
                  </Button>
                )}
                {canAddContentBlocks(node.tagName) && (
                  <>
                    {contentBlockTypes.map((block) => (
                      <Button
                        key={block.type}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 h-8 px-3 text-sm font-normal hover:bg-accent"
                        onClick={() => handleAddBlock(block.type)}
                      >
                        <span className="text-foreground-muted">
                          {contentBlockIcons[block.type]}
                        </span>
                        {block.label}
                      </Button>
                    ))}
                  </>
                )}
              </PopoverContent>
            </Popover>
          )}

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-6 w-6 text-foreground-muted hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
          {node.children!.map((child, childIndex) => (
            <OutlineTreeNode
              key={child._id}
              node={child}
              depth={depth + 1}
              parentId={node._id}
              index={childIndex}
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
}
