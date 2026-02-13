import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorState } from '@codemirror/state';
import {
  bracketMatching,
  indentUnit,
  HighlightStyle,
  syntaxHighlighting,
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
import { tags } from '@lezer/highlight';
import { useEditor } from '@/context/EditorContext';
import { serializeMjml, parseMjml } from '@/lib/mjml/parser';
import { ResizableSplitPane } from '@/components/ui/resizable-split-pane';
import { SourcePreview } from './SourcePreview';

const SOURCE_SYNC_DEBOUNCE_MS = 350;

const mjmlHighlightStyle = HighlightStyle.define([
  {
    tag: tags.tagName,
    color: 'var(--cm-tag, oklch(0.74 0.1 158))',
    fontWeight: '600',
  },
  {
    tag: tags.attributeName,
    color: 'var(--cm-attribute-name, oklch(0.76 0.09 80))',
  },
  {
    tag: [tags.attributeValue, tags.string],
    color: 'var(--cm-attribute-value, oklch(0.77 0.1 255))',
  },
  {
    tag: [tags.angleBracket, tags.bracket],
    color: 'var(--cm-punctuation, oklch(0.7 0.02 250))',
  },
  { tag: tags.comment, color: 'var(--cm-comment, oklch(0.63 0.01 250))' },
  {
    tag: tags.invalid,
    color: 'var(--cm-invalid, oklch(0.7 0.16 25))',
    textDecoration: 'underline',
  },
]);

export function SourceEditor() {
  const { state, setDocument } = useEditor();
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>(null);
  const suppressNextDocumentSyncRef = useRef(false);
  const lastDocumentSourceRef = useRef('');

  useEffect(() => {
    if (suppressNextDocumentSyncRef.current) {
      suppressNextDocumentSyncRef.current = false;
      return;
    }

    const mjmlString = serializeMjml(state.document);
    lastDocumentSourceRef.current = mjmlString;
    /* eslint-disable react-hooks/set-state-in-effect -- Intentional: sync source editor with canonical document changes */
    setSource(mjmlString);
    setError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [state.document]);

  const validateAndSyncSource = useCallback(
    (value: string) => {
      try {
        const parsed = parseMjml(value);
        if (parsed.tagName !== 'mjml') {
          setError('Invalid MJML: Document must have an <mjml> root element');
          return;
        }

        lastDocumentSourceRef.current = serializeMjml(parsed);
        suppressNextDocumentSyncRef.current = true;
        setDocument(parsed);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse MJML');
      }
    },
    [setDocument]
  );

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
      syntaxHighlighting(mjmlHighlightStyle),
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
    setError(null);
  }, []);

  useEffect(() => {
    if (source === lastDocumentSourceRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      validateAndSyncSource(source);
    }, SOURCE_SYNC_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [source, validateAndSyncSource]);

  return (
    <ResizableSplitPane
      defaultLeftWidth={50}
      minLeftWidth={30}
      maxLeftWidth={70}
    >
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 min-h-0 p-4">
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
          {!error && (
            <span className="text-sm text-foreground-muted">
              Changes sync automatically
            </span>
          )}
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
      </div>

      <SourcePreview mjmlSource={source} debounceMs={300} />
    </ResizableSplitPane>
  );
}
