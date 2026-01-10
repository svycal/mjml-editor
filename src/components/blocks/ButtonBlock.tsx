import { useState, useEffect, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import { BlockWrapper } from './BlockWrapper';
import type { MjmlNode } from '@/types/mjml';

interface ButtonBlockProps {
  node: MjmlNode;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

export function ButtonBlock({ node, isSelected, onSelect }: ButtonBlockProps) {
  const { updateContent } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(node.content || 'Button');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local content with node content
  useEffect(() => {
    if (!isEditing) {
      setLocalContent(node.content || 'Button');
    }
  }, [node.content, isEditing]);

  // Focus input when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localContent !== node.content && node._id) {
      updateContent(node._id, localContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLocalContent(node.content || 'Button');
      setIsEditing(false);
    }
  };

  const backgroundColor = node.attributes['background-color'] || '#414141';
  const textColor = node.attributes.color || '#ffffff';
  const borderRadius = node.attributes['border-radius'] || '3px';
  const fontSize = node.attributes['font-size'] || '13px';
  const fontWeight = node.attributes['font-weight'] || 'normal';

  return (
    <BlockWrapper
      id={node._id!}
      label="Button"
      isSelected={isSelected}
      onSelect={onSelect}
    >
      <div
        className="p-2"
        style={{
          textAlign: (node.attributes.align as React.CSSProperties['textAlign']) || 'center',
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="px-4 py-2 text-center border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
            style={{
              backgroundColor,
              color: textColor,
              borderRadius,
              fontSize,
              fontWeight,
            }}
          />
        ) : (
          <button
            type="button"
            className="px-4 py-2 cursor-default inline-block"
            style={{
              backgroundColor,
              color: textColor,
              borderRadius,
              fontSize,
              fontWeight,
            }}
            onDoubleClick={handleDoubleClick}
          >
            {node.content || 'Button'}
          </button>
        )}
      </div>
    </BlockWrapper>
  );
}
