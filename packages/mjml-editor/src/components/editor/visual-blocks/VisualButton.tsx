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
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    selectBlock(node._id!);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditValue(node.content || '');
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== node.content) {
      updateContent(node._id!, editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
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
  const justifyContent =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  const buttonStyle = {
    backgroundColor: bgColor,
    color: textColor,
    fontSize,
    fontWeight,
    borderRadius,
    padding: innerPadding,
    textDecoration: 'none',
  };

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
        className={cn(
          'relative inline-block cursor-pointer',
          isEditing && 'ring-2 ring-indigo-500'
        )}
        style={buttonStyle}
      >
        {/* Display text (invisible when editing to maintain size) */}
        <span className={cn(isEditing && 'invisible')}>
          {node.content || 'Button'}
        </span>

        {/* Input overlay for editing */}
        {isEditing && (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full text-center outline-none bg-transparent"
            style={{
              color: textColor,
              fontSize,
              fontWeight,
            }}
          />
        )}
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
