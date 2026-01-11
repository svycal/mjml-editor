import { useEffect, useMemo } from 'react';
import { useEditor } from '@/context/EditorContext';
import { extractStyles } from '@/lib/mjml/attributes';
import { scopeCSS } from '@/lib/mjml/scopeCSS';

const STYLE_ID = 'mjml-editor-styles';

/**
 * Scope class applied to the visual editor container.
 * CSS from mj-style blocks is scoped to this class to prevent leaking.
 */
export const VISUAL_EDITOR_SCOPE_CLASS = 'mjml-visual-editor-scope';

/**
 * Hook that injects a scoped <style> tag into the document head for mj-style CSS.
 * This enables css-class styles to render in the visual editor.
 */
export function useStyleLoader() {
  const { state } = useEditor();

  // Extract and combine all mj-style CSS
  const rawCSS = useMemo(
    () => extractStyles(state.document).join('\n'),
    [state.document]
  );

  // Scope the CSS to prevent leaking to parent page
  const scopedCSS = useMemo(
    () => scopeCSS(rawCSS, VISUAL_EDITOR_SCOPE_CLASS),
    [rawCSS]
  );

  useEffect(() => {
    // Get or create the style element
    let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }

    // Update content
    styleEl.textContent = scopedCSS;

    // Cleanup on unmount
    return () => {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    };
  }, [scopedCSS]);
}
