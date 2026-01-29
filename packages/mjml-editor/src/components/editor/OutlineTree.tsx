import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Tree,
  type NodeRendererProps,
  type TreeApi,
  type NodeApi,
} from 'react-arborist';
import {
  Plus,
  Columns,
  Type,
  Image,
  MousePointerClick,
  Minus,
  MoveVertical,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Trash2,
  Mail,
  Palette,
  PanelLeftClose,
} from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { useExtensions } from '@/context/ExtensionsContext';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { contentBlockTypes } from '@/lib/mjml/schema';
import { canBeChildOf, isContentBlock } from '@/lib/mjml/nesting-rules';
import type { MjmlNode, ContentBlockType } from '@/types/mjml';
import { cn } from '@/lib/utils';

// Special ID for global styles selection
export const GLOBAL_STYLES_ID = '__global_styles__';

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
  return [
    'mj-section',
    'mj-column',
    'mj-wrapper',
    'mj-group',
    'mj-hero',
  ].includes(tagName);
}

function canAddContentBlocks(tagName: string): boolean {
  return tagName === 'mj-column';
}

function canAddColumns(tagName: string): boolean {
  return tagName === 'mj-section' || tagName === 'mj-group';
}

// Custom node renderer for the tree
function TreeNode({ node, style, dragHandle }: NodeRendererProps<MjmlNode>) {
  const { state, selectBlock, deleteBlock, addBlock, addColumn } = useEditor();
  const extensions = useExtensions();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const data = node.data;
  const isSelected = state.selectedBlockId === data._id;
  const hasChildren = node.children && node.children.length > 0;
  const showExpandButton = canHaveChildren(data.tagName);

  // Only show condition indicator if extension is enabled
  const condition = extensions.conditionalBlocks
    ? data.attributes['sc-if']
    : undefined;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    node.select();
    selectBlock(data._id!);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBlock(data._id!);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    node.toggle();
  };

  const handleAddBlock = (type: ContentBlockType) => {
    const insertIndex = data.children?.length || 0;
    addBlock(data._id!, insertIndex, type);
    setIsAddOpen(false);
  };

  const handleAddColumn = () => {
    addColumn(data._id!);
    setIsAddOpen(false);
  };

  return (
    <div
      style={style}
      className={cn(
        'group flex items-center h-8 pr-2 cursor-pointer',
        'hover:bg-accent/50 transition-colors',
        isSelected && 'bg-accent',
        node.state.isDragging && 'opacity-50'
      )}
      onClick={handleSelect}
    >
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
            node.isOpen ? (
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
        {blockIcons[data.tagName] || (
          <div className="w-3 h-3 bg-foreground-muted rounded-sm" />
        )}
      </div>

      {/* Label */}
      <span className="flex-1 ml-2 text-sm truncate text-foreground">
        {getDisplayName(data.tagName)}
      </span>

      {/* Conditional indicator */}
      {condition && (
        <span
          className="text-[10px] px-1 py-0.5 bg-amber-500 text-white rounded font-mono mr-1"
          title={`Condition: ${condition}`}
        >
          if
        </span>
      )}

      {/* Action buttons - visible on hover */}
      <div
        className={cn(
          'flex items-center gap-0.5',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )}
      >
        {/* Drag handle */}
        <div
          ref={dragHandle}
          className={cn(
            'flex items-center justify-center w-6 h-6 cursor-grab rounded-md',
            'text-foreground-muted hover:text-foreground hover:bg-accent/50'
          )}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>

        {/* Add button */}
        {(canAddContentBlocks(data.tagName) || canAddColumns(data.tagName)) && (
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
              {canAddColumns(data.tagName) && (
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
              {canAddContentBlocks(data.tagName) && (
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
  );
}

interface OutlineTreeProps {
  onTogglePanel?: () => void;
}

export function OutlineTree({ onTogglePanel }: OutlineTreeProps) {
  const { state, moveBlock, addSection, selectBlock } = useEditor();
  const treeRef = useRef<TreeApi<MjmlNode>>(null);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [treeHeight, setTreeHeight] = useState(400);

  // Track container height for the tree
  useEffect(() => {
    const container = treeContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTreeHeight(entry.contentRect.height);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Get the body node's children as the tree data
  const body = state.document.children?.find((c) => c.tagName === 'mj-body');
  const treeData = body?.children || [];

  // Handle node moves from drag-and-drop
  const handleMove = ({
    dragIds,
    parentId,
    index,
  }: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) => {
    const nodeId = dragIds[0];
    // If parentId is null, it means dropping at root level (into mj-body)
    const targetParentId = parentId || body?._id;
    if (nodeId && targetParentId) {
      moveBlock(nodeId, targetParentId, index);
    }
  };

  // Validate if a drop operation should be allowed based on MJML nesting rules
  const handleDisableDrop = useCallback(
    ({
      parentNode,
      dragNodes,
    }: {
      parentNode: NodeApi<MjmlNode> | null;
      dragNodes: NodeApi<MjmlNode>[];
    }): boolean => {
      // When parentNode is null, we're dropping at root level (into mj-body)
      const parentTagName = parentNode?.data?.tagName || 'mj-body';

      // Content blocks can't accept children
      if (isContentBlock(parentTagName)) {
        return true;
      }

      // Check each dragged node
      for (const dragNode of dragNodes) {
        // Check if the dragged node can be a child of the target parent
        if (!canBeChildOf(dragNode.data.tagName, parentTagName)) {
          return true;
        }

        // Prevent dropping a node into itself or its descendants
        if (parentNode && dragNode.isAncestorOf(parentNode)) {
          return true;
        }
      }

      return false;
    },
    []
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-11 px-3 border-b border-border bg-background">
        <span className="text-sm font-semibold text-foreground">
          Email Structure
        </span>
        {onTogglePanel && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onTogglePanel}
            className="h-7 w-7 rounded-md text-foreground-muted hover:text-foreground hover:bg-accent"
            title="Collapse panel"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Add Section button */}
      <div className="px-3 py-2 border-b border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={addSection}
          disabled={!body}
          className="w-full h-8 gap-1.5 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Section
        </Button>
      </div>

      {/* Global Styles and Body links */}
      <div className="px-3 py-1 border-b border-border space-y-0.5">
        <button
          onClick={() => selectBlock(GLOBAL_STYLES_ID)}
          className={cn(
            'flex items-center gap-2 w-full h-8 px-2 rounded-md text-sm',
            'hover:bg-accent/50 transition-colors',
            state.selectedBlockId === GLOBAL_STYLES_ID && 'bg-accent'
          )}
        >
          <Palette className="h-4 w-4 text-foreground-muted" />
          <span className="text-foreground">Global Styles</span>
        </button>
        <button
          onClick={() => selectBlock(body?._id || null)}
          className={cn(
            'flex items-center gap-2 w-full h-8 px-2 rounded-md text-sm',
            'hover:bg-accent/50 transition-colors',
            state.selectedBlockId === body?._id && 'bg-accent'
          )}
        >
          <Mail className="h-4 w-4 text-foreground-muted" />
          <span className="text-foreground">Body</span>
        </button>
      </div>

      {/* Tree content */}
      <div ref={treeContainerRef} className="flex-1 min-h-0">
        {treeData.length > 0 ? (
          <Tree<MjmlNode>
            ref={treeRef}
            data={treeData}
            idAccessor={(node) => node._id!}
            childrenAccessor={(node) => node.children || null}
            openByDefault={true}
            width="100%"
            height={treeHeight}
            indent={16}
            rowHeight={32}
            paddingTop={8}
            paddingBottom={8}
            onMove={handleMove}
            disableDrop={handleDisableDrop}
          >
            {TreeNode}
          </Tree>
        ) : (
          <div className="flex-1 px-3 py-8 text-center text-sm text-muted-foreground">
            No content yet
          </div>
        )}
      </div>
    </div>
  );
}
