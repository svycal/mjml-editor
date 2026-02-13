import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ChangeEvent } from 'react';
import { EditorProvider } from '@/context/EditorContext';
import { parseMjml } from '@/lib/mjml/parser';
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
  const onApply = vi.fn();
  const onDirtyChange = vi.fn();

  render(
    <EditorProvider initialDocument={parseMjml(INITIAL_MJML)}>
      <SourceEditor onApply={onApply} onDirtyChange={onDirtyChange} />
    </EditorProvider>
  );

  return { onApply, onDirtyChange };
}

describe('SourceEditor', () => {
  it('tracks dirty state and applies valid MJML', async () => {
    const { onApply, onDirtyChange } = renderSourceEditor();
    const input = screen.getByTestId('source-editor-input');
    const applyButton = screen.getByRole('button', { name: 'Apply' });

    expect((applyButton as HTMLButtonElement).disabled).toBe(true);

    fireEvent.change(input, { target: { value: UPDATED_MJML } });

    expect((applyButton as HTMLButtonElement).disabled).toBe(false);
    expect(screen.getByText('Unsaved changes')).toBeTruthy();
    expect(onDirtyChange).toHaveBeenCalledWith(true);

    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(onApply).toHaveBeenCalledTimes(1);
    });
    expect(onApply.mock.calls[0][0]).toContain('<mj-text>Updated</mj-text>');

    await waitFor(() => {
      const lastCall =
        onDirtyChange.mock.calls[onDirtyChange.mock.calls.length - 1];
      expect(lastCall?.[0]).toBe(false);
    });
  });

  it('shows parse error and does not apply invalid root', () => {
    const { onApply } = renderSourceEditor();
    const input = screen.getByTestId('source-editor-input');
    const applyButton = screen.getByRole('button', { name: 'Apply' });

    fireEvent.change(input, { target: { value: '<mj-body></mj-body>' } });
    fireEvent.click(applyButton);

    expect(onApply).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        'Invalid MJML: Document must have an <mjml> root element'
      )
    ).toBeTruthy();
  });

  it('applies on Cmd/Ctrl+Enter', async () => {
    const { onApply } = renderSourceEditor();
    const input = screen.getByTestId('source-editor-input');

    fireEvent.change(input, { target: { value: UPDATED_MJML } });
    fireEvent.keyDown(input, { key: 'Enter', metaKey: true });

    await waitFor(() => {
      expect(onApply).toHaveBeenCalledTimes(1);
    });
    expect(onApply.mock.calls[0][0]).toContain('<mj-text>Updated</mj-text>');
  });
});
