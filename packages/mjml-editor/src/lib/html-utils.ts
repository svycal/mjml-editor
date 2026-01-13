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

  // Match {{ ... }} patterns (variables)
  let result = html.replace(
    /(\{\{[^{}]*\}\})/g,
    '<span class="liquid-highlight">$1</span>'
  );

  // Match {% ... %} patterns (tags)
  result = result.replace(
    /(\{%[^{}]*%\})/g,
    '<span class="liquid-highlight">$1</span>'
  );

  return result;
}
