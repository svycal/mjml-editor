import { useEffect, useMemo } from 'react';
import { useEditor } from '@/context/EditorContext';

const LINK_ID_PREFIX = 'mjml-editor-font-';

// MJML default font - Ubuntu is injected by MJML when rendering
const MJML_DEFAULT_FONT = {
  name: 'Ubuntu',
  href: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700',
};

/**
 * Hook that injects <link> tags into the document head for each mj-font.
 * Also loads MJML's default Ubuntu font to match preview rendering.
 * This enables custom fonts to render in the visual editor.
 */
export function useFontLoader() {
  const { fonts } = useEditor();

  // Include MJML default font alongside custom fonts
  const allFonts = useMemo(() => [MJML_DEFAULT_FONT, ...fonts], [fonts]);

  useEffect(() => {
    // Remove any font links that are no longer needed
    document.querySelectorAll(`link[id^="${LINK_ID_PREFIX}"]`).forEach((el) => {
      const fontName = el.id.replace(LINK_ID_PREFIX, '').replace(/-/g, ' ');
      // Check both hyphenated and original versions since we replace spaces with hyphens
      const matches = allFonts.some(
        (f) =>
          f.name === fontName ||
          f.name.replace(/\s+/g, '-') === el.id.replace(LINK_ID_PREFIX, '')
      );
      if (!matches) {
        el.remove();
      }
    });

    // Add or update link tags for each font
    allFonts.forEach((font) => {
      const linkId = `${LINK_ID_PREFIX}${font.name.replace(/\s+/g, '-')}`;
      let link = document.getElementById(linkId) as HTMLLinkElement | null;

      if (link) {
        // Update href if changed
        if (link.href !== font.href) {
          link.href = font.href;
        }
      } else {
        // Create new link element
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = font.href;
        document.head.appendChild(link);
      }
    });

    // Cleanup function removes all font links when component unmounts
    return () => {
      document
        .querySelectorAll(`link[id^="${LINK_ID_PREFIX}"]`)
        .forEach((el) => el.remove());
    };
  }, [allFonts]);
}
