import { useRef, useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualTextProps {
  node: MjmlNode;
}

export function VisualText({ node }: VisualTextProps) {
  const { state, selectBlock, updateContent } = useEditor();
  const isSelected = state.selectedBlockId === node._id;
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      if (newContent !== node.content) {
        updateContent(node._id!, newContent);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      contentRef.current?.blur();
    }
  };

  // Focus content when entering edit mode
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  // Parse styles from attributes
  const color = node.attributes['color'] || '#000000';
  const fontSize = node.attributes['font-size'] || '13px';
  const fontFamily = node.attributes['font-family'] || 'Ubuntu, Helvetica, Arial, sans-serif';
  const fontWeight = node.attributes['font-weight'] || 'normal';
  const textAlign = (node.attributes['align'] || 'left') as 'left' | 'center' | 'right' | 'justify';
  const lineHeight = node.attributes['line-height'] || '1.5';
  const padding = node.attributes['padding'] || '10px 25px';

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && !isEditing && 'ring-2 ring-indigo-500 ring-inset',
        isEditing && 'ring-2 ring-indigo-500'
      )}
      style={{ padding }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        ref={contentRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'outline-none',
          isEditing && 'cursor-text'
        )}
        style={{
          color,
          fontSize,
          fontFamily,
          fontWeight,
          textAlign,
          lineHeight,
        }}
        dangerouslySetInnerHTML={{ __html: node.content || '' }}
      />

      {/* Edit hint */}
      {isSelected && !isEditing && (
        <div className="absolute -top-6 left-0 text-xs text-indigo-600 bg-white px-1 rounded shadow-sm">
          Double-click to edit
        </div>
      )}
    </div>
  );
}
