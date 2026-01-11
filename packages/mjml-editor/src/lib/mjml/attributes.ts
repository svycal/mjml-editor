/**
 * Attribute resolution system for mj-attributes support.
 *
 * This module provides utilities for extracting mj-attributes configuration
 * from mj-head and resolving effective attributes for nodes following the
 * MJML cascade order:
 *
 * 1. mj-all (global defaults)
 * 2. Element-type defaults (mj-text, mj-section, etc.)
 * 3. mj-class (named style classes)
 * 4. Per-element attributes (highest priority)
 */

import type { MjmlNode, ComponentSchema } from '@/types/mjml';
import { getSchemaForTag } from './schema';

/**
 * Configuration extracted from mj-attributes in mj-head
 */
export interface MjmlAttributesConfig {
  /** Attributes from mj-all that apply to all elements */
  all: Record<string, string>;
  /** Element-specific defaults (tagName -> attributes) */
  elements: Record<string, Record<string, string>>;
  /** Named classes (className -> attributes) */
  classes: Record<string, Record<string, string>>;
}

/**
 * Create an empty mj-attributes configuration
 */
export function createEmptyConfig(): MjmlAttributesConfig {
  return {
    all: {},
    elements: {},
    classes: {},
  };
}

/**
 * Get the mj-head node from a document
 */
export function getHead(document: MjmlNode): MjmlNode | null {
  return document.children?.find((c) => c.tagName === 'mj-head') || null;
}

/**
 * Get the mj-body node from a document
 */
export function getBody(document: MjmlNode): MjmlNode | null {
  return document.children?.find((c) => c.tagName === 'mj-body') || null;
}

/**
 * Get the mj-attributes node from mj-head
 */
export function getMjAttributes(document: MjmlNode): MjmlNode | null {
  const head = getHead(document);
  return head?.children?.find((c) => c.tagName === 'mj-attributes') || null;
}

/**
 * Extract mj-attributes configuration from a document's mj-head
 */
export function extractMjmlAttributes(
  document: MjmlNode
): MjmlAttributesConfig {
  const config = createEmptyConfig();
  const mjAttributes = getMjAttributes(document);

  if (!mjAttributes?.children) {
    return config;
  }

  for (const child of mjAttributes.children) {
    if (child.tagName === 'mj-all') {
      // mj-all applies to all elements
      Object.assign(config.all, child.attributes);
    } else if (child.tagName === 'mj-class') {
      // mj-class defines a named class
      const className = child.attributes['name'];
      if (className) {
        // Copy attributes except 'name'
        const classAttrs = { ...child.attributes };
        delete classAttrs['name'];
        config.classes[className] = classAttrs;
      }
    } else if (child.tagName.startsWith('mj-')) {
      // Element-specific defaults (mj-text, mj-section, etc.)
      config.elements[child.tagName] = { ...child.attributes };
    }
  }

  return config;
}

/**
 * Parse space-separated class names from mj-class attribute value
 */
export function parseClassNames(mjClassValue: string | undefined): string[] {
  if (!mjClassValue) return [];
  return mjClassValue
    .split(/\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Get list of defined class names from the document
 */
export function getDefinedClasses(document: MjmlNode): string[] {
  const config = extractMjmlAttributes(document);
  return Object.keys(config.classes);
}

/**
 * Resolve effective attributes for a node by applying the MJML cascade.
 *
 * Order of precedence (later overrides earlier):
 * 1. mj-all attributes
 * 2. Element-type defaults (mj-text, mj-section, etc.)
 * 3. mj-class attributes (if node has mj-class)
 * 4. Per-element attributes
 *
 * Note: Schema defaults are NOT included here - they are handled
 * at the component level for backward compatibility.
 */
export function resolveAttributes(
  node: MjmlNode,
  mjmlAttributes: MjmlAttributesConfig
): Record<string, string> {
  const result: Record<string, string> = {};

  // 1. Apply mj-all (global defaults)
  Object.assign(result, mjmlAttributes.all);

  // 2. Apply element-type defaults
  const elementDefaults = mjmlAttributes.elements[node.tagName];
  if (elementDefaults) {
    Object.assign(result, elementDefaults);
  }

  // 3. Apply mj-class (supports multiple space-separated classes)
  const classNames = parseClassNames(node.attributes['mj-class']);
  for (const className of classNames) {
    const classAttrs = mjmlAttributes.classes[className];
    if (classAttrs) {
      Object.assign(result, classAttrs);
    }
  }

  // 4. Apply per-element attributes (highest priority)
  Object.assign(result, node.attributes);

  return result;
}

/**
 * Get the inherited value for a specific attribute (for placeholder display).
 *
 * This returns the value that would be used if the node doesn't override it,
 * computed from the cascade (mj-all -> element-type -> mj-class -> schema default).
 *
 * Returns undefined if there is no inherited value.
 */
export function getInheritedValue(
  node: MjmlNode,
  attributeKey: string,
  mjmlAttributes: MjmlAttributesConfig,
  schema: ComponentSchema | null
): string | undefined {
  // Build cascade without per-element attributes
  let value: string | undefined;

  // 1. Check mj-all
  if (mjmlAttributes.all[attributeKey]) {
    value = mjmlAttributes.all[attributeKey];
  }

  // 2. Check element-type defaults
  const elementDefaults = mjmlAttributes.elements[node.tagName];
  if (elementDefaults?.[attributeKey]) {
    value = elementDefaults[attributeKey];
  }

  // 3. Check mj-class
  const classNames = parseClassNames(node.attributes['mj-class']);
  for (const className of classNames) {
    const classAttrs = mjmlAttributes.classes[className];
    if (classAttrs?.[attributeKey]) {
      value = classAttrs[attributeKey];
    }
  }

  // 4. Fall back to schema default if no inherited value
  if (value === undefined && schema) {
    value = schema[attributeKey]?.default;
  }

  return value;
}

/**
 * Get the resolved value for a specific attribute.
 * This is a convenience function that resolves a single attribute.
 */
export function getResolvedValue(
  node: MjmlNode,
  attributeKey: string,
  mjmlAttributes: MjmlAttributesConfig,
  schema: ComponentSchema | null
): string | undefined {
  // Per-element attribute takes precedence
  if (node.attributes[attributeKey] !== undefined) {
    return node.attributes[attributeKey];
  }

  // Otherwise use inherited value
  return getInheritedValue(node, attributeKey, mjmlAttributes, schema);
}

/**
 * Helper function to resolve attributes with schema for a node.
 * This is the main function visual blocks should use.
 */
export function resolveNodeAttributes(
  node: MjmlNode,
  mjmlAttributes: MjmlAttributesConfig
): Record<string, string> {
  const schema = getSchemaForTag(node.tagName);
  const resolved = resolveAttributes(node, mjmlAttributes);

  // Apply schema defaults for any missing attributes
  if (schema) {
    for (const [key, attrSchema] of Object.entries(schema)) {
      if (resolved[key] === undefined && attrSchema.default !== undefined) {
        resolved[key] = attrSchema.default;
      }
    }
  }

  return resolved;
}

/**
 * Check if a node has any mj-class applied
 */
export function hasClasses(node: MjmlNode): boolean {
  return parseClassNames(node.attributes['mj-class']).length > 0;
}

/**
 * Add a class to a node's mj-class attribute
 */
export function addClassToNode(
  node: MjmlNode,
  className: string
): Record<string, string> {
  const currentClasses = parseClassNames(node.attributes['mj-class']);
  if (!currentClasses.includes(className)) {
    currentClasses.push(className);
  }
  return {
    ...node.attributes,
    'mj-class': currentClasses.join(' '),
  };
}

/**
 * Remove a class from a node's mj-class attribute
 */
export function removeClassFromNode(
  node: MjmlNode,
  className: string
): Record<string, string> {
  const currentClasses = parseClassNames(node.attributes['mj-class']);
  const filtered = currentClasses.filter((c) => c !== className);
  const newAttributes = { ...node.attributes };

  if (filtered.length === 0) {
    delete newAttributes['mj-class'];
  } else {
    newAttributes['mj-class'] = filtered.join(' ');
  }

  return newAttributes;
}

/**
 * Font configuration extracted from mj-font nodes in mj-head
 */
export interface MjmlFontConfig {
  name: string;
  href: string;
}

/**
 * Extract all mj-font configurations from mj-head
 */
export function extractFonts(document: MjmlNode): MjmlFontConfig[] {
  const head = getHead(document);
  if (!head?.children) return [];

  return head.children
    .filter((child) => child.tagName === 'mj-font')
    .map((child) => ({
      name: child.attributes['name'] || '',
      href: child.attributes['href'] || '',
    }))
    .filter((font) => font.name && font.href);
}
