/**
 * MJML Nesting Rules
 *
 * Defines which MJML elements can be children of which parents.
 * Used to validate drag-and-drop operations in the tree.
 */

/**
 * Map of parent tag names to their allowed child tag names
 */
export const ALLOWED_CHILDREN: Record<string, string[]> = {
  'mj-body': ['mj-section', 'mj-wrapper', 'mj-hero'],
  'mj-wrapper': ['mj-section'],
  'mj-section': ['mj-column', 'mj-group'],
  'mj-group': ['mj-column'],
  'mj-column': [
    'mj-text',
    'mj-image',
    'mj-button',
    'mj-divider',
    'mj-spacer',
    'mj-social',
    'mj-navbar',
    'mj-table',
    'mj-raw',
    'mj-accordion',
    'mj-carousel',
  ],
  'mj-hero': [
    'mj-text',
    'mj-image',
    'mj-button',
    'mj-divider',
    'mj-spacer',
    'mj-social',
    'mj-navbar',
    'mj-raw',
  ],
};

/**
 * Check if a child tag can be placed inside a parent tag
 */
export function canBeChildOf(childTag: string, parentTag: string): boolean {
  return ALLOWED_CHILDREN[parentTag]?.includes(childTag) ?? false;
}

/**
 * Check if a tag is a content block (leaf node that cannot have children)
 */
export function isContentBlock(tagName: string): boolean {
  return !ALLOWED_CHILDREN[tagName];
}
