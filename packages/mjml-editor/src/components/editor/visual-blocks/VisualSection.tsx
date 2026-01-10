import { useEditor } from '@/context/EditorContext';
import { VisualColumn } from './VisualColumn';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualSectionProps {
  node: MjmlNode;
}

export function VisualSection({ node }: VisualSectionProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Handle wrapper - render children sections
  if (node.tagName === 'mj-wrapper') {
    const bgColor = node.attributes['background-color'] || 'transparent';
    const padding = node.attributes['padding'] || '20px 0';

    return (
      <div
        className={cn(
          'relative cursor-pointer transition-all',
          isSelected && 'ring-2 ring-indigo-500 ring-offset-2'
        )}
        style={{
          backgroundColor: bgColor,
          padding: padding,
        }}
        onClick={handleClick}
      >
        {node.children?.map((child) => (
          <VisualSection key={child._id} node={child} />
        ))}
      </div>
    );
  }

  // Handle section
  if (node.tagName === 'mj-section') {
    const bgColor = node.attributes['background-color'] || '#ffffff';
    const bgUrl = node.attributes['background-url'];
    const padding = node.attributes['padding'] || '20px 0';
    const fullWidth = node.attributes['full-width'] === 'full-width';

    // Get columns
    const columns = node.children?.filter((c) => c.tagName === 'mj-column') || [];
    const columnCount = columns.length || 1;

    return (
      <div
        className={cn(
          'relative cursor-pointer transition-all',
          isSelected && 'ring-2 ring-indigo-500 ring-offset-2',
          !fullWidth && 'bg-white'
        )}
        style={{
          backgroundColor: bgColor,
          backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: padding,
        }}
        onClick={handleClick}
      >
        {/* Columns container */}
        <div
          className="flex"
          style={{
            margin: '0 auto',
            maxWidth: fullWidth ? '100%' : '600px',
          }}
        >
          {columns.map((column) => (
            <VisualColumn
              key={column._id}
              node={column}
              totalColumns={columnCount}
            />
          ))}
        </div>

        {/* Empty section state */}
        {columns.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Empty section - add a column
          </div>
        )}
      </div>
    );
  }

  // Handle group (similar to section but columns don't stack on mobile)
  if (node.tagName === 'mj-group') {
    const columns = node.children?.filter((c) => c.tagName === 'mj-column') || [];
    const columnCount = columns.length || 1;

    return (
      <div
        className={cn(
          'relative cursor-pointer transition-all flex',
          isSelected && 'ring-2 ring-indigo-500 ring-offset-2'
        )}
        onClick={handleClick}
      >
        {columns.map((column) => (
          <VisualColumn
            key={column._id}
            node={column}
            totalColumns={columnCount}
          />
        ))}
      </div>
    );
  }

  // Fallback for unknown section types
  return (
    <div
      className={cn(
        'p-4 bg-muted border border-dashed border-border cursor-pointer',
        isSelected && 'ring-2 ring-indigo-500'
      )}
      onClick={handleClick}
    >
      <span className="text-sm text-muted-foreground">Unknown: {node.tagName}</span>
    </div>
  );
}
