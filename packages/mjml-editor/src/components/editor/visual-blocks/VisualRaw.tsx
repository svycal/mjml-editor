import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualRawProps {
  node: MjmlNode;
}

export function VisualRaw({ node }: VisualRawProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // For raw HTML, we show a placeholder since rendering arbitrary HTML is risky
  // and the actual content is in the content field
  const hasContent = node.content && node.content.trim().length > 0;

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all p-4',
        isSelected && 'ring-2 ring-indigo-500 ring-inset',
        'bg-gray-50 border border-dashed border-gray-300'
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 text-gray-500">
        <span className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded">
          {'</>'}
        </span>
        <span className="text-sm">
          {hasContent ? 'Raw HTML Block' : 'Empty Raw HTML Block'}
        </span>
      </div>
      {hasContent && (
        <div className="mt-2 text-xs font-mono text-gray-400 truncate max-w-full">
          {node.content?.substring(0, 100)}
          {(node.content?.length || 0) > 100 && '...'}
        </div>
      )}
    </div>
  );
}
