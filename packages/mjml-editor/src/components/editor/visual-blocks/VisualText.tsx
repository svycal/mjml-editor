import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import { highlightLiquidTags } from '@/lib/html-utils';
import type { MjmlNode } from '@/types/mjml';
import { buildPadding } from './helpers';
import { useResolvedAttributes } from './useResolvedAttributes';
import { TiptapEditor, type TiptapEditorRef } from '../TiptapEditor';

interface VisualTextProps {
  node: MjmlNode;
}

export function VisualText({ node }: VisualTextProps) {
  const { state, selectBlock, updateContent } = useEditor();
  const isSelected = state.selectedBlockId === node._id;
  const [isEditing, setIsEditing] = useState(false);
  const [pendingContent, setPendingContent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<TiptapEditorRef>(null);
  // Track if we've ever entered edit mode (to mount editor once)
  const [hasEditedOnce, setHasEditedOnce] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasEditedOnce(true);
    setIsEditing(true);
    // Focus editor after state update
    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  };

  const handleUpdate = useCallback((html: string) => {
    setPendingContent(html);
  }, []);

  const saveAndExit = useCallback(() => {
    if (pendingContent !== null && pendingContent !== node.content) {
      updateContent(node._id!, pendingContent);
    }
    setPendingContent(null);
    setIsEditing(false);
  }, [pendingContent, node.content, node._id, updateContent]);

  const cancelEdit = useCallback(() => {
    setPendingContent(null);
    setIsEditing(false);
  }, []);

  // Handle click outside to save and exit
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        // Check if click is inside a popover (for link editing)
        const popover = document.querySelector(
          '[data-radix-popper-content-wrapper]'
        );
        if (popover?.contains(e.target as Node)) {
          return;
        }
        // Check if click is inside the bubble menu (Tippy)
        const bubbleMenu = document.querySelector('.tippy-box');
        if (bubbleMenu?.contains(e.target as Node)) {
          return;
        }
        saveAndExit();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, saveAndExit]);

  // Handle escape key to exit editing without saving
  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelEdit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, cancelEdit]);

  // Get resolved attributes (includes mj-attributes defaults)
  const attrs = useResolvedAttributes(node);

  // Parse styles from resolved attributes
  const color = attrs['color'] || '#000000';
  const fontSize = attrs['font-size'] || '13px';
  const fontFamily =
    attrs['font-family'] || 'Ubuntu, Helvetica, Arial, sans-serif';
  const fontWeight = attrs['font-weight'] || 'normal';
  const fontStyle = attrs['font-style'] || 'normal';
  const textAlign = (attrs['align'] || 'left') as
    | 'left'
    | 'center'
    | 'right'
    | 'justify';
  const lineHeight = attrs['line-height'] || '1';
  const letterSpacing = attrs['letter-spacing'];
  const textDecoration = attrs['text-decoration'] || 'none';
  const textTransform = attrs['text-transform'] || 'none';
  const padding = buildPadding(attrs, '10px 25px');
  const height = attrs['height'];
  const containerBgColor = attrs['container-background-color'];

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

  if (letterSpacing) textStyle.letterSpacing = letterSpacing;

  const content = node.content || '';

  // Highlight Liquid tags for display in resting state
  const highlightedContent = useMemo(
    () => highlightLiquidTags(content) || '\u00A0',
    [content]
  );

  return (
    <div
      ref={containerRef}
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
      {/* Display HTML when not editing */}
      <div
        className={cn(
          '[&_a]:text-inherit [&_a]:underline',
          isEditing && 'hidden',
          attrs['css-class']
        )}
        style={textStyle}
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />

      {/*
        Tiptap editor - mounted once user enters edit mode, never unmounted.
        We hide it with CSS instead of unmounting to avoid React/ProseMirror conflicts.
      */}
      {hasEditedOnce && (
        <div className={cn(!isEditing && 'hidden')}>
          <TiptapEditor
            ref={editorRef}
            content={content}
            onUpdate={handleUpdate}
            style={textStyle}
          />
        </div>
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
