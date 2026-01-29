import { serializeMjml } from './parser';
import type { MjmlNode } from '@/types/mjml';

export interface RenderResult {
  html: string;
  errors: { line: number; message: string; tagName: string }[];
}

/**
 * List of custom attributes that should be stripped before MJML rendering.
 * These are processed server-side and not recognized by mjml-browser.
 */
const CUSTOM_ATTRIBUTES = ['sc-if'];

/**
 * Strip custom attributes from node tree for preview rendering.
 * This prevents "Attribute sc-if is illegal" warnings from mjml-browser.
 */
function stripCustomAttributes(node: MjmlNode): MjmlNode {
  const filteredAttributes = Object.fromEntries(
    Object.entries(node.attributes || {}).filter(
      ([key]) => !CUSTOM_ATTRIBUTES.includes(key)
    )
  );

  return {
    ...node,
    attributes: filteredAttributes,
    children: node.children?.map(stripCustomAttributes),
  };
}

// Lazy-load mjml-browser to avoid SSR issues (it accesses `window` on import)
let mjml2html: typeof import('mjml-browser').default | null = null;

async function getMjml2Html() {
  if (!mjml2html) {
    const mjmlModule = await import('mjml-browser');
    mjml2html = mjmlModule.default;
  }
  return mjml2html;
}

/**
 * Add mj-class attributes with block IDs to all nodes
 * This allows us to identify blocks in the rendered HTML
 */
function addBlockClasses(node: MjmlNode): MjmlNode {
  // Skip non-mj elements and elements without IDs
  if (!node._id || !node.tagName.startsWith('mj-')) {
    return {
      ...node,
      children: node.children?.map(addBlockClasses),
    };
  }

  // Add block-{_id} to mj-class attribute
  const existingClass = node.attributes['mj-class'] || '';
  const blockClass = `block-${node._id}`;
  const newClass = existingClass
    ? `${existingClass} ${blockClass}`
    : blockClass;

  return {
    ...node,
    attributes: { ...node.attributes, 'mj-class': newClass },
    children: node.children?.map(addBlockClasses),
  };
}

/**
 * Serialize MJML node to string, preserving mj-class attributes
 */
function serializeMjmlWithClasses(node: MjmlNode): string {
  return jsonToMjmlWithClasses(node);
}

/**
 * Convert MjmlNode back to MJML XML string, preserving _id-based mj-class
 */
function jsonToMjmlWithClasses(node: MjmlNode, indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  const tagName = node.tagName;

  // Build attributes string (exclude internal _id)
  const attrs = Object.entries(node.attributes || {})
    .filter(
      ([key, value]) => key !== '_id' && value !== '' && value !== undefined
    )
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(' ');

  const openTag = attrs ? `<${tagName} ${attrs}>` : `<${tagName}>`;
  const closeTag = `</${tagName}>`;

  // Handle content (ending tags)
  if (node.content !== undefined) {
    return `${spaces}${openTag}${node.content}${closeTag}`;
  }

  // Handle children
  if (node.children && node.children.length > 0) {
    const childrenStr = node.children
      .map((child) => jsonToMjmlWithClasses(child, indent + 1))
      .join('\n');
    return `${spaces}${openTag}\n${childrenStr}\n${spaces}${closeTag}`;
  }

  // Self-closing style for empty elements
  return `${spaces}${openTag}${closeTag}`;
}

/**
 * Escape special characters in attribute values
 */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Render MJML JSON to HTML.
 * Custom attributes (like sc-if) are stripped to prevent mjml-browser warnings.
 */
export async function renderMjml(document: MjmlNode): Promise<RenderResult> {
  try {
    const mjml = await getMjml2Html();
    // Strip custom attributes before rendering to avoid "illegal attribute" warnings
    const strippedDocument = stripCustomAttributes(document);
    const mjmlString = serializeMjml(strippedDocument);
    const result = mjml(mjmlString, {
      validationLevel: 'soft',
    });

    return {
      html: result.html,
      errors: result.errors || [],
    };
  } catch (error) {
    console.error('MJML render error:', error);
    return {
      html: '<p style="color: #dc2626; padding: 20px; background: white; margin: 0;">Error rendering email preview</p>',
      errors: [{ line: 0, message: String(error), tagName: 'mjml' }],
    };
  }
}

/**
 * Strip custom attributes from an MJML string using regex.
 * This handles cases where we only have a string, not a parsed node tree.
 */
function stripCustomAttributesFromString(mjmlString: string): string {
  // Create a regex pattern that matches any custom attribute
  // Pattern matches: attribute="value" or attribute='value'
  for (const attr of CUSTOM_ATTRIBUTES) {
    const pattern = new RegExp(`\\s+${attr}="[^"]*"`, 'g');
    mjmlString = mjmlString.replace(pattern, '');
    const patternSingleQuote = new RegExp(`\\s+${attr}='[^']*'`, 'g');
    mjmlString = mjmlString.replace(patternSingleQuote, '');
  }
  return mjmlString;
}

/**
 * Render MJML string to HTML.
 * Custom attributes (like sc-if) are stripped to prevent mjml-browser warnings.
 */
export async function renderMjmlString(
  mjmlString: string
): Promise<RenderResult> {
  try {
    const mjml = await getMjml2Html();
    // Strip custom attributes before rendering to avoid "illegal attribute" warnings
    const strippedMjml = stripCustomAttributesFromString(mjmlString);
    const result = mjml(strippedMjml, {
      validationLevel: 'soft',
    });

    return {
      html: result.html,
      errors: result.errors || [],
    };
  } catch (error) {
    console.error('MJML render error:', error);
    return {
      html: '<p style="color: #dc2626; padding: 20px; background: white; margin: 0;">Error rendering email preview</p>',
      errors: [{ line: 0, message: String(error), tagName: 'mjml' }],
    };
  }
}

/**
 * Render MJML JSON to HTML with block IDs preserved as CSS classes.
 * This allows clicking elements in the preview to identify the source block.
 * Custom attributes (like sc-if) are stripped to prevent mjml-browser warnings.
 */
export async function renderMjmlInteractive(
  document: MjmlNode
): Promise<RenderResult> {
  try {
    const mjml = await getMjml2Html();
    // Strip custom attributes first, then add mj-class attributes with block IDs
    const strippedDocument = stripCustomAttributes(document);
    const withClasses = addBlockClasses(strippedDocument);
    const mjmlString = serializeMjmlWithClasses(withClasses);

    const result = mjml(mjmlString, {
      validationLevel: 'soft',
    });

    return {
      html: result.html,
      errors: result.errors || [],
    };
  } catch (error) {
    console.error('MJML render error:', error);
    return {
      html: '<p style="color: #dc2626; padding: 20px; background: white; margin: 0;">Error rendering email preview</p>',
      errors: [{ line: 0, message: String(error), tagName: 'mjml' }],
    };
  }
}
