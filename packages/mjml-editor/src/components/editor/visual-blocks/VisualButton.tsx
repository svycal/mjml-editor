import { useRef, useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualButtonProps {
  node: MjmlNode;
}

export function VisualButton({ node }: VisualButtonProps) {
  const { state, selectBlock, updateContent } = useEditor();
  const isSelected = state.selectedBlockId === node._id;
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    selectBlock(node._id!);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (contentRef.current) {
      const newContent = contentRef.current.textContent || '';
      if (newContent !== node.content) {
        updateContent(node._id!, newContent);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      contentRef.current?.blur();
    }
  };

  // Focus content when entering edit mode
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      // Select all text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(contentRef.current);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  // Parse attributes
  const bgColor = node.attributes['background-color'] || '#414141';
  const textColor = node.attributes['color'] || '#ffffff';
  const fontSize = node.attributes['font-size'] || '13px';
  const fontWeight = node.attributes['font-weight'] || 'normal';
  const borderRadius = node.attributes['border-radius'] || '3px';
  const align = node.attributes['align'] || 'center';
  const innerPadding = node.attributes['inner-padding'] || '10px 25px';
  const padding = node.attributes['padding'] || '10px 25px';

  // Convert align to flexbox
  const justifyContent = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  return (
    <div
      className={cn(
        'relative transition-all',
        isSelected && !isEditing && 'ring-2 ring-indigo-500 ring-offset-2'
      )}
      style={{
        padding,
        display: 'flex',
        justifyContent,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <span
        ref={contentRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-block cursor-pointer outline-none',
          isEditing && 'cursor-text ring-2 ring-indigo-500'
        )}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontSize,
          fontWeight,
          borderRadius,
          padding: innerPadding,
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        {node.content || 'Button'}
      </span>

      {/* Edit hint */}
      {isSelected && !isEditing && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-indigo-600 bg-white px-1 rounded shadow-sm whitespace-nowrap">
          Double-click to edit
        </div>
      )}
    </div>
  );
}
