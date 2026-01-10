import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';
import { renderMjmlInteractive } from '@/lib/mjml/renderer';

interface InteractivePreviewProps {
  showHeader?: boolean;
}

export function InteractivePreview({ showHeader = true }: InteractivePreviewProps) {
  const { state, selectBlock } = useEditor();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [debouncedDocument, setDebouncedDocument] = useState(state.document);

  // Debounce document changes for smoother preview updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDocument(state.document);
    }, 300);
    return () => clearTimeout(timer);
  }, [state.document]);

  // Render MJML to HTML with block IDs as CSS classes
  const { html, errors } = useMemo(() => {
    return renderMjmlInteractive(debouncedDocument);
  }, [debouncedDocument]);

  // Handle messages from iframe (block selection)
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'BLOCK_SELECTED') {
      selectBlock(event.data.blockId);
    }
  }, [selectBlock]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // Generate selection highlight style
  const highlightStyle = state.selectedBlockId
    ? `.block-${state.selectedBlockId} { outline: 2px solid #6366f1 !important; outline-offset: -2px; position: relative; }`
    : '';

  // Script to inject into iframe for click handling
  const clickHandlerScript = `
    (function() {
      document.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Find the closest element with a block- class
        var target = e.target;
        while (target && target !== document.body) {
          var blockClass = Array.from(target.classList || []).find(function(c) {
            return c.startsWith('block-');
          });
          if (blockClass) {
            var blockId = blockClass.replace('block-', '');
            window.parent.postMessage({ type: 'BLOCK_SELECTED', blockId: blockId }, '*');
            return;
          }
          target = target.parentElement;
        }
      }, true);

      // Prevent default link behavior
      document.addEventListener('click', function(e) {
        if (e.target.closest('a')) {
          e.preventDefault();
        }
      }, true);
    })();
  `;

  // Update iframe content
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        // Inject the click handler script
        const script = doc.createElement('script');
        script.textContent = clickHandlerScript;
        doc.body.appendChild(script);

        // Inject hover and selection styles
        const style = doc.createElement('style');
        style.textContent = `
          [class*="block-"] {
            cursor: pointer;
            transition: outline 0.15s ease;
          }
          [class*="block-"]:hover {
            outline: 1px dashed #94a3b8 !important;
            outline-offset: -1px;
          }
          ${highlightStyle}
        `;
        doc.head.appendChild(style);
      }
    }
  }, [html, highlightStyle, clickHandlerScript]);

  // Update just the selection highlight without re-rendering the whole iframe
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        // Find or create the selection style element
        let selectionStyle = doc.getElementById('selection-highlight');
        if (!selectionStyle) {
          selectionStyle = doc.createElement('style');
          selectionStyle.id = 'selection-highlight';
          doc.head.appendChild(selectionStyle);
        }
        selectionStyle.textContent = highlightStyle;
      }
    }
  }, [state.selectedBlockId, highlightStyle]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {showHeader && (
        <div className="h-11 px-4 flex items-center justify-between border-b border-border bg-background">
          <span className="text-sm font-semibold text-foreground">Preview</span>
          {errors.length > 0 && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              {errors.length} warning{errors.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Preview iframe */}
      <div className="flex-1 overflow-auto bg-white">
        <iframe
          ref={iframeRef}
          title="Email Preview"
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>

      {/* Errors panel */}
      {errors.length > 0 && (
        <div className="max-h-28 overflow-auto border-t border-border bg-amber-50/50 p-3">
          <div className="text-xs font-semibold text-amber-700 mb-2">Warnings</div>
          <div className="space-y-1">
            {errors.map((error, i) => (
              <div key={i} className="text-xs text-amber-600">
                <span className="font-mono">Line {error.line}:</span> {error.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
