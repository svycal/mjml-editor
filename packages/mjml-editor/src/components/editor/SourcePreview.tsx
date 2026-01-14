import { useEffect, useRef, useState } from 'react';
import { renderMjmlString, type RenderResult } from '@/lib/mjml/renderer';

interface SourcePreviewProps {
  mjmlSource: string;
  debounceMs?: number;
}

export function SourcePreview({
  mjmlSource,
  debounceMs = 300,
}: SourcePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [debouncedSource, setDebouncedSource] = useState(mjmlSource);
  const [renderResult, setRenderResult] = useState<RenderResult>({
    html: '',
    errors: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSource(mjmlSource);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [mjmlSource, debounceMs]);

  useEffect(() => {
    if (!debouncedSource.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: clear result for empty input
      setRenderResult({ html: '', errors: [] });
      return;
    }
    let cancelled = false;
    renderMjmlString(debouncedSource).then((result) => {
      if (!cancelled) {
        setRenderResult(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedSource]);

  const { html, errors } = renderResult;

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
      <div className="h-11 px-4 flex items-center justify-between border-b border-border bg-background">
        <span className="text-sm font-semibold text-foreground">Preview</span>
        {errors.length > 0 && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
            {errors.length} warning{errors.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto bg-muted">
        <iframe
          ref={iframeRef}
          title="Source Preview"
          className="w-full h-full border-0 bg-white"
          sandbox="allow-same-origin"
        />
      </div>

      {errors.length > 0 && (
        <div className="max-h-28 overflow-auto border-t border-border bg-amber-50/50 p-3">
          <div className="text-xs font-semibold text-amber-700 mb-2">
            Warnings
          </div>
          <div className="space-y-1">
            {errors.map((error, i) => (
              <div key={i} className="text-xs text-amber-600">
                <span className="font-mono">Line {error.line}:</span>{' '}
                {error.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
