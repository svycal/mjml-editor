import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Undo2, Redo2, Plus } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { OutlineTreeNode } from './OutlineTreeNode';
import { findParentNode } from '@/lib/mjml/parser';

export function OutlineTree() {
  const { state, undo, redo, canUndo, canRedo, moveBlock, addSection } = useEditor();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get the body node
  const body = state.document.children?.find((c) => c.tagName === 'mj-body');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    // Find the parent of the active item
    const activeParent = findParentNode(state.document, activeId);
    const overParent = findParentNode(state.document, overId);

    if (!activeParent || !overParent) {
      return;
    }

    // Get the index of the over item in its parent
    const overIndex = overParent.children?.findIndex((c) => c._id === overId) ?? -1;

    if (overIndex === -1) {
      return;
    }

    // If moving within the same parent
    if (activeParent._id === overParent._id) {
      const activeIndex = activeParent.children?.findIndex((c) => c._id === activeId) ?? -1;
      if (activeIndex === -1) return;

      // Calculate the new index
      const newIndex = activeIndex < overIndex ? overIndex : overIndex;
      moveBlock(activeId, activeParent._id!, newIndex);
    } else {
      // Moving to a different parent
      moveBlock(activeId, overParent._id!, overIndex);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-11 px-3 border-b border-border bg-background">
        <span className="text-sm font-semibold text-foreground">Email Structure</span>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={undo}
            disabled={!canUndo}
            className="h-7 w-7 rounded-md text-foreground-muted hover:text-foreground hover:bg-accent disabled:opacity-40"
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={redo}
            disabled={!canRedo}
            className="h-7 w-7 rounded-md text-foreground-muted hover:text-foreground hover:bg-accent disabled:opacity-40"
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tree content */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={body?.children?.map((c) => c._id!) || []}
              strategy={verticalListSortingStrategy}
            >
              {body?.children?.map((child, index) => (
                <OutlineTreeNode
                  key={child._id}
                  node={child}
                  depth={0}
                  parentId={body._id}
                  index={index}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Empty state */}
          {(!body?.children || body.children.length === 0) && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No content yet
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add Section button */}
      <div className="px-3 py-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={addSection}
          className="w-full h-8 gap-1.5 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Section
        </Button>
      </div>
    </div>
  );
}
