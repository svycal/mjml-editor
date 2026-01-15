import { serializeMjml } from './parser';
import type { MjmlNode } from '@/types/mjml';

export interface RenderResult {
  html: string;
  errors: { line: number; message: string; tagName: string }[];
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
 * Render MJML JSON to HTML
 */
export async function renderMjml(document: MjmlNode): Promise<RenderResult> {
  try {
    const mjml = await getMjml2Html();
    const mjmlString = serializeMjml(document);
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
 * Render MJML string to HTML
 */
export async function renderMjmlString(
  mjmlString: string
): Promise<RenderResult> {
  try {
    const mjml = await getMjml2Html();
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
 * Render MJML JSON to HTML with block IDs preserved as CSS classes
 * This allows clicking elements in the preview to identify the source block
 */
export async function renderMjmlInteractive(
  document: MjmlNode
): Promise<RenderResult> {
  try {
    const mjml = await getMjml2Html();
    // Add mj-class attributes with block IDs
    const withClasses = addBlockClasses(document);
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
