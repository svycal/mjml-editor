import { useRef, useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';
import { buildPadding } from './helpers';
import { useResolvedAttributes } from './useResolvedAttributes';

interface VisualButtonProps {
  node: MjmlNode;
}

export function VisualButton({ node }: VisualButtonProps) {
  const { state, selectBlock, updateContent } = useEditor();
  const isSelected = state.selectedBlockId === node._id;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const attrs = useResolvedAttributes(node);

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

  // Parse resolved attributes
  const bgColor = attrs['background-color'] || '#414141';
  const textColor = attrs['color'] || '#ffffff';
  const fontSize = attrs['font-size'] || '13px';
  const fontFamily =
    attrs['font-family'] || 'Ubuntu, Helvetica, Arial, sans-serif';
  const fontWeight = attrs['font-weight'] || 'normal';
  const fontStyle = attrs['font-style'] || 'normal';
  const lineHeight = attrs['line-height'] || '120%';
  const letterSpacing = attrs['letter-spacing'];
  const textAlign = attrs['text-align'] || 'center';
  const textDecoration = attrs['text-decoration'] || 'none';
  const textTransform = attrs['text-transform'] || 'none';
  const borderRadius = attrs['border-radius'] || '3px';
  const border = attrs['border'];
  const borderTop = attrs['border-top'];
  const borderRight = attrs['border-right'];
  const borderBottom = attrs['border-bottom'];
  const borderLeft = attrs['border-left'];
  const align = attrs['align'] || 'center';
  const verticalAlign = attrs['vertical-align'] || 'middle';
  const innerPadding = attrs['inner-padding'] || '10px 25px';
  const padding = buildPadding(attrs, '10px 25px');
  const width = attrs['width'];
  const height = attrs['height'];
  const containerBgColor = attrs['container-background-color'];

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
    padding: innerPadding,
    borderRadius,
    width: width || undefined,
    height: height || undefined,
  };

  // Only add border properties if they have values
  if (border) buttonStyle.border = border;
  if (borderTop) buttonStyle.borderTop = borderTop;
  if (borderRight) buttonStyle.borderRight = borderRight;
  if (borderBottom) buttonStyle.borderBottom = borderBottom;
  if (borderLeft) buttonStyle.borderLeft = borderLeft;

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
              textTransform:
                textTransform as React.CSSProperties['textTransform'],
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
