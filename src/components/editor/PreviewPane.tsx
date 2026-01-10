import { useMemo, useEffect, useRef, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { renderMjml } from '@/lib/mjml/renderer';

export function PreviewPane() {
  const { state } = useEditor();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [debouncedDocument, setDebouncedDocument] = useState(state.document);

  // Debounce document changes for smoother preview updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDocument(state.document);
    }, 300);
    return () => clearTimeout(timer);
  }, [state.document]);

  // Render MJML to HTML
  const { html, errors } = useMemo(() => {
    return renderMjml(debouncedDocument);
  }, [debouncedDocument]);

  // Update iframe content
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">Preview</span>
        {errors.length > 0 && (
          <span className="text-xs text-destructive">
            {errors.length} warning{errors.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Preview iframe */}
      <div className="flex-1 overflow-auto bg-white">
        <iframe
          ref={iframeRef}
          title="Email Preview"
          className="w-full h-full border-0"
          sandbox="allow-same-origin"
        />
      </div>

      {/* Errors panel */}
      {errors.length > 0 && (
        <div className="max-h-32 overflow-auto border-t border-border bg-destructive/10 p-2">
          <div className="text-xs font-medium text-destructive mb-1">Warnings:</div>
          {errors.map((error, i) => (
            <div key={i} className="text-xs text-destructive/80">
              Line {error.line}: {error.message} ({error.tagName})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
