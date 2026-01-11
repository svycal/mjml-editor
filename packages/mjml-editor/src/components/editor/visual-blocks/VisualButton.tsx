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
  const fontFamily =
    node.attributes['font-family'] || 'Ubuntu, Helvetica, Arial, sans-serif';
  const fontWeight = node.attributes['font-weight'] || 'normal';
  const fontStyle = node.attributes['font-style'] || 'normal';
  const lineHeight = node.attributes['line-height'] || '120%';
  const letterSpacing = node.attributes['letter-spacing'];
  const textAlign = node.attributes['text-align'] || 'center';
  const textDecoration = node.attributes['text-decoration'] || 'none';
  const textTransform = node.attributes['text-transform'] || 'none';
  const borderRadius = node.attributes['border-radius'] || '3px';
  const border = node.attributes['border'] || 'none';
  const borderTop = node.attributes['border-top'];
  const borderRight = node.attributes['border-right'];
  const borderBottom = node.attributes['border-bottom'];
  const borderLeft = node.attributes['border-left'];
  const align = node.attributes['align'] || 'center';
  const verticalAlign = node.attributes['vertical-align'] || 'middle';
  const innerPadding = node.attributes['inner-padding'] || '10px 25px';
  const padding = node.attributes['padding'] || '10px 25px';
  const width = node.attributes['width'];
  const height = node.attributes['height'];
  const containerBgColor = node.attributes['container-background-color'];

  // Convert align to flexbox
  const justifyContent =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  // Convert vertical-align to flexbox
  const alignItems =
    verticalAlign === 'top'
      ? 'flex-start'
      : verticalAlign === 'bottom'
        ? 'flex-end'
        : 'center';

  const buttonStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    lineHeight,
    letterSpacing: letterSpacing || undefined,
    textAlign: textAlign as React.CSSProperties['textAlign'],
    textDecoration,
    textTransform: textTransform as React.CSSProperties['textTransform'],
    borderRadius,
    border,
    borderTop: borderTop || undefined,
    borderRight: borderRight || undefined,
    borderBottom: borderBottom || undefined,
    borderLeft: borderLeft || undefined,
    padding: innerPadding,
    width: width || undefined,
    height: height || undefined,
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
        alignItems,
        backgroundColor: containerBgColor || undefined,
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
            className="absolute inset-0 w-full h-full outline-none bg-transparent"
            style={{
              color: textColor,
              fontSize,
              fontFamily,
              fontWeight,
              fontStyle,
              lineHeight,
              letterSpacing: letterSpacing || undefined,
              textAlign: textAlign as React.CSSProperties['textAlign'],
              textDecoration,
              textTransform: textTransform as React.CSSProperties['textTransform'],
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
