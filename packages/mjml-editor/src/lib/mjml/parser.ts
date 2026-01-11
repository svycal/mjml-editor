import { v4 as uuidv4 } from 'uuid';
import type { MjmlNode } from '@/types/mjml';

/**
 * Escape unescaped ampersands in attribute values for XML parsing.
 * This handles URLs like Google Fonts that contain & characters.
 */
function escapeAmpersandsInAttributes(mjmlString: string): string {
  // Match attribute values with double or single quotes: attr="value" or attr='value'
  return mjmlString.replace(/=["']([^"']*)["']/g, (_match, value, offset, string) => {
    // Determine which quote was used
    const quote = string[offset + 1];
    // Replace & that's not already part of a valid XML entity
    const escaped = value.replace(
      /&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/gi,
      '&amp;'
    );
    return `=${quote}${escaped}${quote}`;
  });
}

/**
 * Parse MJML markup string into a JSON AST with internal IDs
 * Browser-compatible implementation using DOMParser
 */
export function parseMjml(mjmlString: string): MjmlNode {
  const preprocessed = escapeAmpersandsInAttributes(mjmlString);
  const parser = new DOMParser();
  const doc = parser.parseFromString(preprocessed, 'text/xml');

  // Check for parsing errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    console.error('MJML parse error:', parseError.textContent);
    return createEmptyDocument();
  }

  const root = doc.documentElement;
  const json = elementToJson(root);
  return addIds(json);
}

/**
 * Convert a DOM element to MjmlNode
 */
function elementToJson(element: Element): MjmlNode {
  const tagName = element.tagName.toLowerCase();
  const attributes: Record<string, string> = {};

  // Extract attributes
  for (const attr of Array.from(element.attributes)) {
    attributes[attr.name] = attr.value;
  }

  // Check if this is an "ending tag" (content-only, no children)
  const endingTags = [
    'mj-text',
    'mj-button',
    'mj-title',
    'mj-preview',
    'mj-style',
    'mj-raw',
  ];
  const isEndingTag = endingTags.includes(tagName);

  if (isEndingTag) {
    // Get inner HTML as content
    return {
      tagName,
      attributes,
      content: element.innerHTML.trim(),
    };
  }

  // Get child elements
  const children: MjmlNode[] = [];
  for (const child of Array.from(element.children)) {
    children.push(elementToJson(child));
  }

  return {
    tagName,
    attributes,
    children: children.length > 0 ? children : undefined,
  };
}

/**
 * Serialize JSON AST back to MJML markup string
 */
export function serializeMjml(node: MjmlNode): string {
  return jsonToMjml(stripIds(node));
}

/**
 * Convert MjmlNode back to MJML XML string
 */
function jsonToMjml(node: MjmlNode, indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  const tagName = node.tagName;

  // Build attributes string
  const attrs = Object.entries(node.attributes || {})
    .filter(([, value]) => value !== '' && value !== undefined)
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
      .map((child) => jsonToMjml(child, indent + 1))
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
 * Add unique IDs to all nodes in the tree (for React keys and selection)
 */
export function addIds(node: MjmlNode): MjmlNode {
  return {
    ...node,
    _id: node._id || uuidv4(),
    children: node.children?.map(addIds),
  };
}

/**
 * Strip internal IDs from nodes before serialization
 */
export function stripIds(node: MjmlNode): MjmlNode {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = node;
  return {
    ...rest,
    children: node.children?.map(stripIds),
  };
}

/**
 * Find a node by ID in the tree
 */
export function findNodeById(root: MjmlNode, id: string): MjmlNode | null {
  if (root._id === id) return root;
  if (!root.children) return null;

  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

/**
 * Find parent node of a given node ID
 */
export function findParentNode(root: MjmlNode, id: string): MjmlNode | null {
  if (!root.children) return null;

  for (const child of root.children) {
    if (child._id === id) return root;
    const found = findParentNode(child, id);
    if (found) return found;
  }
  return null;
}

/**
 * Get the mj-body node from the document
 */
export function getBody(root: MjmlNode): MjmlNode | null {
  if (root.tagName === 'mj-body') return root;
  return root.children?.find((c) => c.tagName === 'mj-body') || null;
}

/**
 * Get all sections from the body
 */
export function getSections(root: MjmlNode): MjmlNode[] {
  const body = getBody(root);
  if (!body?.children) return [];
  return body.children.filter((c) => c.tagName === 'mj-section');
}

/**
 * Create a deep clone of a node
 */
export function cloneNode(node: MjmlNode): MjmlNode {
  return JSON.parse(JSON.stringify(node));
}

/**
 * Update a node in the tree immutably
 */
export function updateNode(
  root: MjmlNode,
  id: string,
  updater: (node: MjmlNode) => MjmlNode
): MjmlNode {
  if (root._id === id) {
    return updater(root);
  }

  if (!root.children) return root;

  return {
    ...root,
    children: root.children.map((child) => updateNode(child, id, updater)),
  };
}

/**
 * Delete a node from the tree
 */
export function deleteNode(root: MjmlNode, id: string): MjmlNode {
  if (!root.children) return root;

  return {
    ...root,
    children: root.children
      .filter((child) => child._id !== id)
      .map((child) => deleteNode(child, id)),
  };
}

/**
 * Insert a node at a specific position
 */
export function insertNode(
  root: MjmlNode,
  parentId: string,
  index: number,
  newNode: MjmlNode
): MjmlNode {
  if (root._id === parentId) {
    const children = [...(root.children || [])];
    children.splice(index, 0, addIds(newNode));
    return { ...root, children };
  }

  if (!root.children) return root;

  return {
    ...root,
    children: root.children.map((child) =>
      insertNode(child, parentId, index, newNode)
    ),
  };
}

/**
 * Move a node to a new parent at a specific index
 */
export function moveNode(
  root: MjmlNode,
  nodeId: string,
  newParentId: string,
  newIndex: number
): MjmlNode {
  // Find the node to move
  const nodeToMove = findNodeById(root, nodeId);
  if (!nodeToMove) return root;

  // Clone the node
  const clonedNode = cloneNode(nodeToMove);

  // Remove from old position
  let result = deleteNode(root, nodeId);

  // Insert at new position
  result = insertNode(result, newParentId, newIndex, clonedNode);

  return result;
}

/**
 * Create a default empty document
 */
export function createEmptyDocument(): MjmlNode {
  return addIds({
    tagName: 'mjml',
    attributes: {},
    children: [
      {
        tagName: 'mj-body',
        attributes: {},
        children: [
          {
            tagName: 'mj-section',
            attributes: {},
            children: [
              {
                tagName: 'mj-column',
                attributes: {},
                children: [
                  {
                    tagName: 'mj-text',
                    attributes: {},
                    content: 'Start editing your email here...',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
}

/**
 * Create a new section with a single column
 */
export function createSection(): MjmlNode {
  return addIds({
    tagName: 'mj-section',
    attributes: {},
    children: [
      {
        tagName: 'mj-column',
        attributes: {},
        children: [],
      },
    ],
  });
}

/**
 * Create a new column
 */
export function createColumn(): MjmlNode {
  return addIds({
    tagName: 'mj-column',
    attributes: {},
    children: [],
  });
}
