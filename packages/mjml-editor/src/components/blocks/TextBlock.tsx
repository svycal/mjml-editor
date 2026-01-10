import { useState, useEffect, useRef } from "react";
import { useEditor } from "@/context/EditorContext";
import { BlockWrapper } from "./BlockWrapper";
import type { MjmlNode } from "@/types/mjml";

interface TextBlockProps {
  node: MjmlNode;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

export function TextBlock({ node, isSelected, onSelect }: TextBlockProps) {
  const { updateContent } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use node content when not editing, local state when editing
  const displayContent = isEditing ? editingContent : node.content || "";

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingContent(node.content || "");
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editingContent !== node.content && node._id) {
      updateContent(node._id, editingContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <BlockWrapper
      id={node._id!}
      label="Text"
      isSelected={isSelected}
      onSelect={onSelect}
    >
      <div className="p-2" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[60px] p-2 text-sm border border-primary rounded resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            style={{
              color: node.attributes.color || undefined,
              fontSize: node.attributes["font-size"] || undefined,
              fontFamily: node.attributes["font-family"] || undefined,
              textAlign:
                (node.attributes.align as React.CSSProperties["textAlign"]) ||
                undefined,
            }}
          />
        ) : (
          <div
            className="min-h-[24px] text-sm cursor-text"
            style={{
              color: node.attributes.color || undefined,
              fontSize: node.attributes["font-size"] || undefined,
              fontFamily: node.attributes["font-family"] || undefined,
              fontWeight: node.attributes["font-weight"] || undefined,
              textAlign:
                (node.attributes.align as React.CSSProperties["textAlign"]) ||
                undefined,
              lineHeight: node.attributes["line-height"] || undefined,
            }}
            dangerouslySetInnerHTML={{
              __html: displayContent || "<em>Double-click to edit</em>",
            }}
          />
        )}
      </div>
    </BlockWrapper>
  );
}
