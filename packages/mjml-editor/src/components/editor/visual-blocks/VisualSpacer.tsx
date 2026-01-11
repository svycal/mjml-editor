import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';
import { buildPadding } from './helpers';
import { useResolvedAttributes } from './useResolvedAttributes';

interface VisualSpacerProps {
  node: MjmlNode;
}

export function VisualSpacer({ node }: VisualSpacerProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;
  const attrs = useResolvedAttributes(node);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Parse resolved attributes - Primary
  const height = attrs['height'] || '20px';
  const padding = buildPadding(attrs);

  // Advanced attributes
  const containerBgColor = attrs['container-background-color'];

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/50',
        attrs['css-class']
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
