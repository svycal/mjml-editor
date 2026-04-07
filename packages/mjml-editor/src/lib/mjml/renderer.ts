import { serializeMjml } from './parser';
import type { MjmlNode } from '@/types/mjml';

export interface RenderResult {
  html: string;
  errors: { line: number; message: string; tagName: string }[];
}

/**
 * List of custom attributes that should be stripped before MJML rendering.
 * These are processed server-side and not recognized by the MJML renderer.
 */
const CUSTOM_ATTRIBUTES = ['sc-if'];

/**
 * Strip custom attributes from node tree for preview rendering.
 * This prevents "Attribute sc-if is illegal" warnings from the renderer.
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

/**
 * POST an MJML string to the render endpoint and return the result.
 */
async function fetchRenderedHtml(
  renderEndpoint: string,
  mjmlString: string
): Promise<RenderResult> {
  const response = await fetch(renderEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: mjmlString,
  });

  if (!response.ok) {
    throw new Error(`Render endpoint returned ${response.status}`);
  }

  return response.json();
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
 * Render MJML JSON to HTML via the render endpoint.
 * Custom attributes (like sc-if) are stripped to prevent warnings.
 */
export async function renderMjml(
  document: MjmlNode,
  renderEndpoint: string
): Promise<RenderResult> {
  try {
    const strippedDocument = stripCustomAttributes(document);
    const mjmlString = serializeMjml(strippedDocument);
    return await fetchRenderedHtml(renderEndpoint, mjmlString);
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
 * Render MJML string to HTML via the render endpoint.
 * Custom attributes (like sc-if) are stripped to prevent warnings.
 */
export async function renderMjmlString(
  mjmlString: string,
  renderEndpoint: string
): Promise<RenderResult> {
  try {
    const strippedMjml = stripCustomAttributesFromString(mjmlString);
    return await fetchRenderedHtml(renderEndpoint, strippedMjml);
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
 * Custom attributes (like sc-if) are stripped to prevent warnings.
 */
export async function renderMjmlInteractive(
  document: MjmlNode,
  renderEndpoint: string
): Promise<RenderResult> {
  try {
    const strippedDocument = stripCustomAttributes(document);
    const withClasses = addBlockClasses(strippedDocument);
    const mjmlString = jsonToMjmlWithClasses(withClasses);
    return await fetchRenderedHtml(renderEndpoint, mjmlString);
  } catch (error) {
    console.error('MJML render error:', error);
    return {
      html: '<p style="color: #dc2626; padding: 20px; background: white; margin: 0;">Error rendering email preview</p>',
      errors: [{ line: 0, message: String(error), tagName: 'mjml' }],
    };
  }
}
