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
      <div className="h-11 px-4 flex items-center justify-between border-b border-border bg-background">
        <span className="text-sm font-semibold text-foreground">Preview</span>
        {errors.length > 0 && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
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
