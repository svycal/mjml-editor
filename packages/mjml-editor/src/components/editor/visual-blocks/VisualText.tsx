import { useRef, useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualTextProps {
  node: MjmlNode;
}

// Strip HTML tags to get plain text
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

export function VisualText({ node }: VisualTextProps) {
  const { state, selectBlock, updateContent } = useEditor();
  const isSelected = state.selectedBlockId === node._id;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Initialize edit value with plain text content
    setEditValue(stripHtml(node.content || ''));
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== stripHtml(node.content || '')) {
      updateContent(node._id!, editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
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

  const textStyle = {
    color,
    fontSize,
    fontFamily,
    fontWeight,
    textAlign,
    lineHeight,
  };

  // Get display content (strip HTML for plain text display)
  const displayContent = stripHtml(node.content || '');

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
      {/* Display text (hidden when editing) */}
      <div
        className={cn('whitespace-pre-wrap', isEditing && 'invisible')}
        style={textStyle}
      >
        {displayContent || '\u00A0'}
      </div>

      {/* Textarea overlay for editing */}
      {isEditing && (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full resize-none outline-none bg-transparent"
          style={{ ...textStyle, padding }}
        />
      )}

      {/* Edit hint */}
      {isSelected && !isEditing && (
        <div className="absolute -top-6 left-0 text-xs text-indigo-600 bg-white px-1 rounded shadow-sm">
          Double-click to edit
        </div>
      )}
    </div>
  );
}
