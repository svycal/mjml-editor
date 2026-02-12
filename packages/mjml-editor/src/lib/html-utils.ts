/**
 * Sanitize HTML output from Tiptap for MJML compatibility.
 *
 * Tiptap outputs semantic HTML with <p> tags that may not render well
 * in all email clients. This function normalizes the output to use
 * <br /> for line breaks.
 */
export function sanitizeHtmlForMjml(html: string): string {
  // Handle empty content
  if (!html || html === '<p></p>') {
    return '';
  }

  // Remove opening <p> tags
  let result = html.replace(/<p>/g, '');

  // Replace closing </p> tags with <br /> (except the last one)
  result = result.replace(/<\/p>/g, '<br />');

  // Clean up trailing <br />
  result = result.replace(/(<br\s*\/?>)+$/, '');

  // Ensure self-closing tags for MJML/XHTML compatibility
  result = result.replace(/<br>/gi, '<br />');

  return result;
}

/**
 * Convert MJML content to Tiptap-compatible HTML.
 *
 * MJML content uses <br /> for line breaks. Tiptap expects
 * content wrapped in <p> tags.
 */
export function mjmlToTiptapHtml(content: string): string {
  if (!content || content.trim() === '') {
    return '<p></p>';
  }

  // If content already has <p> tags, return as-is
  if (content.includes('<p>')) {
    return content;
  }

  // Split by line breaks and wrap each line in a paragraph
  const lines = content.split(/<br\s*\/?>/gi);

  return lines.map((line) => `<p>${line}</p>`).join('');
}

/**
 * Highlight Liquid template syntax in HTML content.
 *
 * Wraps {{ variable }} and {% tag %} patterns with a span
 * that has the liquid-highlight class for visual styling.
 */
export function highlightLiquidTags(html: string): string {
  if (!html) return html;

  if (typeof document === 'undefined') {
    return html;
  }

  try {
    const container = document.createElement('div');
    container.innerHTML = html;
    const liquidPattern = /(\{\{[^{}]*\}\}|\{%[^{}]*%\})/g;
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node = walker.nextNode();
    while (node) {
      textNodes.push(node as Text);
      node = walker.nextNode();
    }

    for (const textNode of textNodes) {
      const parentElement = textNode.parentElement;
      if (!parentElement) continue;

      // Never mutate script/style text or already-highlighted content
      const parentTag = parentElement.tagName.toLowerCase();
      if (parentTag === 'script' || parentTag === 'style') continue;
      if (parentElement.closest('.liquid-highlight')) continue;

      const text = textNode.textContent || '';
      liquidPattern.lastIndex = 0;

      const matches = Array.from(text.matchAll(liquidPattern));
      if (matches.length === 0) continue;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      for (const match of matches) {
        const token = match[0];
        const index = match.index ?? -1;
        if (index < 0) continue;

        if (index > lastIndex) {
          fragment.appendChild(
            document.createTextNode(text.slice(lastIndex, index))
          );
        }

        const span = document.createElement('span');
        span.className = 'liquid-highlight';
        span.textContent = token;
        fragment.appendChild(span);

        lastIndex = index + token.length;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      textNode.parentNode?.replaceChild(fragment, textNode);
    }

    return container.innerHTML;
  } catch {
    return html;
  }
}
