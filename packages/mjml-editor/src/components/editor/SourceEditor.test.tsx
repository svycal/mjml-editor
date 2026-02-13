import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ChangeEvent } from 'react';
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { parseMjml, serializeMjml } from '@/lib/mjml/parser';
import { SourceEditor } from './SourceEditor';

vi.mock('./SourcePreview', () => ({
  SourcePreview: ({ mjmlSource }: { mjmlSource: string }) => (
    <div data-testid="source-preview">{mjmlSource.length}</div>
  ),
}));

vi.mock('@uiw/react-codemirror', () => ({
  default: ({
    value,
    onChange,
    className,
  }: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
  }) => (
    <textarea
      data-testid="source-editor-input"
      value={value}
      className={className}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
        onChange(event.target.value)
      }
    />
  ),
}));

const INITIAL_MJML = `<mjml><mj-body><mj-section><mj-column><mj-text>Hello</mj-text></mj-column></mj-section></mj-body></mjml>`;
const UPDATED_MJML = `<mjml><mj-body><mj-section><mj-column><mj-text>Updated</mj-text></mj-column></mj-section></mj-body></mjml>`;

function renderSourceEditor() {
  function DocumentProbe() {
    const { state } = useEditor();
    return (
      <div data-testid="document-output">{serializeMjml(state.document)}</div>
    );
  }

  render(
    <EditorProvider initialDocument={parseMjml(INITIAL_MJML)}>
      <SourceEditor />
      <DocumentProbe />
    </EditorProvider>
  );
}

describe('SourceEditor', () => {
  it('syncs valid MJML changes automatically', async () => {
    renderSourceEditor();
    const input = screen.getByTestId('source-editor-input');

    fireEvent.change(input, { target: { value: UPDATED_MJML } });

    await waitFor(() => {
      expect(screen.getByTestId('document-output').textContent).toContain(
        '<mj-text>Updated</mj-text>'
      );
    });

    expect(screen.queryByRole('button', { name: 'Apply' })).toBeNull();
    expect(screen.getByText('Changes sync automatically')).toBeTruthy();
  });

  it('shows parse error and does not sync invalid root', async () => {
    renderSourceEditor();
    const input = screen.getByTestId('source-editor-input');

    fireEvent.change(input, { target: { value: '<mj-body></mj-body>' } });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Invalid MJML: Document must have an <mjml> root element'
        )
      ).toBeTruthy();
    });

    expect(screen.getByTestId('document-output').textContent).toContain(
      '<mj-text>Hello</mj-text>'
    );
  });

  it('syncs again after invalid source is fixed', async () => {
    renderSourceEditor();
    const input = screen.getByTestId('source-editor-input');

    fireEvent.change(input, { target: { value: '<mj-body></mj-body>' } });
    await waitFor(() => {
      expect(
        screen.getByText(
          'Invalid MJML: Document must have an <mjml> root element'
        )
      ).toBeTruthy();
    });

    fireEvent.change(input, { target: { value: UPDATED_MJML } });
    await waitFor(() => {
      expect(screen.getByTestId('document-output').textContent).toContain(
        '<mj-text>Updated</mj-text>'
      );
    });
  });
});
