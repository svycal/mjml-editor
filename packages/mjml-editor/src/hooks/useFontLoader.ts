import { useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';

const LINK_ID_PREFIX = 'mjml-editor-font-';

/**
 * Hook that injects <link> tags into the document head for each mj-font.
 * This enables custom fonts to render in the visual editor.
 */
export function useFontLoader() {
  const { fonts } = useEditor();

  useEffect(() => {
    // Remove any font links that are no longer needed
    document.querySelectorAll(`link[id^="${LINK_ID_PREFIX}"]`).forEach((el) => {
      const fontName = el.id.replace(LINK_ID_PREFIX, '').replace(/-/g, ' ');
      // Check both hyphenated and original versions since we replace spaces with hyphens
      const matches = fonts.some(
        (f) =>
          f.name === fontName ||
          f.name.replace(/\s+/g, '-') === el.id.replace(LINK_ID_PREFIX, '')
      );
      if (!matches) {
        el.remove();
      }
    });

    // Add or update link tags for each font
    fonts.forEach((font) => {
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
  }, [fonts]);
}
