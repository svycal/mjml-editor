import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { serializeMjml, parseMjml } from '@/lib/mjml/parser';
import { ResizableSplitPane } from '@/components/ui/resizable-split-pane';
import { SourcePreview } from './SourcePreview';

export function SourceEditor() {
  const { state, setDocument } = useEditor();
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const mjmlString = serializeMjml(state.document);
    setSource(mjmlString);
    setIsDirty(false);
    setError(null);
  }, [state.document]);

  const handleApply = () => {
    try {
      const parsed = parseMjml(source);
      if (parsed.tagName !== 'mjml') {
        setError('Invalid MJML: Document must have an <mjml> root element');
        return;
      }
      setDocument(parsed);
      setError(null);
      setIsDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse MJML');
    }
  };

  const handleChange = (value: string) => {
    setSource(value);
    setIsDirty(true);
    setError(null);
  };

  return (
    <ResizableSplitPane defaultLeftWidth={50} minLeftWidth={30} maxLeftWidth={70}>
      <div className="flex flex-col h-full bg-background">
        <div className="px-4 pt-4">
          <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              You are editing the raw MJML source. Changes may affect the visual
              editor.
            </p>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-4">
          <textarea
            value={source}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-muted border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
        </div>

        <div className="px-4 pb-4 flex items-center gap-3">
          <button
            onClick={handleApply}
            disabled={!isDirty}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
          {isDirty && !error && (
            <span className="text-sm text-foreground-muted">Unsaved changes</span>
          )}
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
      </div>

      <SourcePreview mjmlSource={source} debounceMs={300} />
    </ResizableSplitPane>
  );
}
