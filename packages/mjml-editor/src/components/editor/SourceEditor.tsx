import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type KeyboardEvent,
} from 'react';
import { AlertTriangle } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorState } from '@codemirror/state';
import {
  bracketMatching,
  indentUnit,
  syntaxHighlighting,
  defaultHighlightStyle,
} from '@codemirror/language';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from '@codemirror/view';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { xml } from '@codemirror/lang-xml';
import { useEditor } from '@/context/EditorContext';
import { serializeMjml, parseMjml } from '@/lib/mjml/parser';
import { ResizableSplitPane } from '@/components/ui/resizable-split-pane';
import { SourcePreview } from './SourcePreview';

interface SourceEditorProps {
  onApply?: (mjml: string) => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function SourceEditor({ onApply, onDirtyChange }: SourceEditorProps) {
  const { state, setDocument } = useEditor();
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const mjmlString = serializeMjml(state.document);
    /* eslint-disable react-hooks/set-state-in-effect -- Intentional: sync source editor state with document state */
    setSource(mjmlString);
    setIsDirty(false);
    setError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [state.document]);

  const handleApply = useCallback(() => {
    try {
      const parsed = parseMjml(source);
      if (parsed.tagName !== 'mjml') {
        setError('Invalid MJML: Document must have an <mjml> root element');
        return;
      }
      const appliedMjml = serializeMjml(parsed);
      setDocument(parsed);
      onApply?.(appliedMjml);
      setError(null);
      setIsDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse MJML');
    }
  }, [source, setDocument, onApply]);

  const editorExtensions = useMemo(
    () => [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      history(),
      EditorState.tabSize.of(2),
      indentUnit.of('  '),
      bracketMatching(),
      highlightSelectionMatches(),
      syntaxHighlighting(defaultHighlightStyle),
      EditorView.lineWrapping,
      keymap.of([
        indentWithTab,
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
      ]),
      xml(),
    ],
    []
  );

  const handleChange = useCallback((value: string) => {
    setSource(value);
    setIsDirty(true);
    setError(null);
  }, []);

  const handleSourceKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        handleApply();
      }
    },
    [handleApply]
  );

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(
    () => () => {
      onDirtyChange?.(false);
    },
    [onDirtyChange]
  );

  return (
    <ResizableSplitPane
      defaultLeftWidth={50}
      minLeftWidth={30}
      maxLeftWidth={70}
    >
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

        <div className="flex-1 min-h-0 p-4" onKeyDown={handleSourceKeyDown}>
          <CodeMirror
            value={source}
            onChange={handleChange}
            extensions={editorExtensions}
            basicSetup={false}
            theme="none"
            className="source-editor h-full overflow-hidden rounded-md border border-border bg-muted text-foreground"
            height="100%"
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
            <span className="text-sm text-foreground-muted">
              Unsaved changes
            </span>
          )}
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
      </div>

      <SourcePreview mjmlSource={source} debounceMs={300} />
    </ResizableSplitPane>
  );
}
