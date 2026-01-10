import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BlockTree } from './BlockTree';
import { findParentNode } from '@/lib/mjml/parser';

export function EditorPane() {
  const { state, addSection, undo, redo, canUndo, canRedo, moveBlock } = useEditor();

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
      // Moving to a different parent (column)
      moveBlock(activeId, overParent._id!, overIndex);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
        >
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
        >
          Redo
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={addSection}
        >
          + Section
        </Button>
      </div>

      {/* Block tree with drag and drop */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {body?.children?.map((section, index) => (
              <BlockTree key={section._id} node={section} index={index} />
            ))}
          </DndContext>

          {/* Add section placeholder when empty */}
          {(!body?.children || body.children.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="mb-4">No sections yet</p>
              <Button onClick={addSection}>Add your first section</Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
