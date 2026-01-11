import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { serializeMjml, parseMjml } from '@/lib/mjml/parser';

export function SourceEditor() {
  const { state, setDocument } = useEditor();
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize/sync source from document
  useEffect(() => {
    const mjmlString = serializeMjml(state.document);
    setSource(mjmlString);
    setIsDirty(false);
    setError(null);
  }, [state.document]);

  const handleApply = () => {
    try {
      const parsed = parseMjml(source);
      // Check if parsing resulted in a valid document (not empty fallback)
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
    <div className="flex flex-col h-full bg-background">
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
  );
}
