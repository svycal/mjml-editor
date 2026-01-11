import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualSpacerProps {
  node: MjmlNode;
}

export function VisualSpacer({ node }: VisualSpacerProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Parse attributes - Primary
  const height = node.attributes['height'] || '20px';
  const padding = node.attributes['padding'];

  // Advanced attributes
  const containerBgColor = node.attributes['container-background-color'];

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/50'
      )}
      style={{
        height,
        ...(padding && { padding }),
        ...(containerBgColor && { backgroundColor: containerBgColor }),
      }}
      onClick={handleClick}
    >
      {/* Show height indicator when selected */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-indigo-600 bg-white px-1 rounded shadow-sm">
            {height}
          </span>
        </div>
      )}
    </div>
  );
}
