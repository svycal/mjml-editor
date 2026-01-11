import { useRef, useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualTextProps {
  node: MjmlNode;
}

// Convert HTML to plain text, preserving line breaks
function htmlToText(html: string): string {
  // Replace <br>, <br/>, <br /> with newlines
  const withNewlines = html.replace(/<br\s*\/?>/gi, '\n');
  // Strip remaining HTML tags
  const doc = new DOMParser().parseFromString(withNewlines, 'text/html');
  return doc.body.textContent || '';
}

// Convert plain text to HTML, converting newlines to <br />
function textToHtml(text: string): string {
  return text.replace(/\n/g, '<br />');
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
    // Initialize edit value with plain text (br tags become newlines)
    setEditValue(htmlToText(node.content || ''));
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Convert newlines to <br /> when saving
    const newContent = textToHtml(editValue);
    if (newContent !== node.content) {
      updateContent(node._id!, newContent);
    }
  };

  // Auto-resize textarea to fit content
  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  // Focus textarea and resize when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      resizeTextarea();
    }
  }, [isEditing]);

  // Resize textarea when content changes
  useEffect(() => {
    if (isEditing) {
      resizeTextarea();
    }
  }, [editValue, isEditing]);

  // Parse styles from attributes
  const color = node.attributes['color'] || '#000000';
  const fontSize = node.attributes['font-size'] || '13px';
  const fontFamily =
    node.attributes['font-family'] || 'Ubuntu, Helvetica, Arial, sans-serif';
  const fontWeight = node.attributes['font-weight'] || 'normal';
  const fontStyle = node.attributes['font-style'] || 'normal';
  const textAlign = (node.attributes['align'] || 'left') as
    | 'left'
    | 'center'
    | 'right'
    | 'justify';
  const lineHeight = node.attributes['line-height'] || '1';
  const letterSpacing = node.attributes['letter-spacing'];
  const textDecoration = node.attributes['text-decoration'] || 'none';
  const textTransform = node.attributes['text-transform'] || 'none';
  const padding = node.attributes['padding'] || '10px 25px';
  const height = node.attributes['height'];
  const containerBgColor = node.attributes['container-background-color'];

  const textStyle: React.CSSProperties = {
    color,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    textAlign,
    lineHeight,
    textDecoration,
    textTransform: textTransform as React.CSSProperties['textTransform'],
  };

  // Only add optional properties if they have values
  if (letterSpacing) textStyle.letterSpacing = letterSpacing;

  // Get display content (convert br tags to newlines for display)
  const displayContent = htmlToText(node.content || '');

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && !isEditing && 'ring-2 ring-indigo-500 ring-inset',
        isEditing && 'ring-2 ring-indigo-500'
      )}
      style={{
        padding,
        ...(height && { height }),
        ...(containerBgColor && { backgroundColor: containerBgColor }),
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Display text when not editing */}
      {!isEditing && (
        <div className="whitespace-pre-wrap" style={textStyle}>
          {displayContent || '\u00A0'}
        </div>
      )}

      {/* Textarea for editing (in normal flow so it sizes the container) */}
      {isEditing && (
        <textarea
          ref={textareaRef}
          rows={1}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full resize-none outline-none bg-transparent"
          style={textStyle}
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
