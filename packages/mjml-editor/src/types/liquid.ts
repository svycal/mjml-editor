/**
 * Schema item for Liquid variables and tags
 */
export interface LiquidSchemaItem {
  /** The name/path of the variable or tag (e.g., "user.name" or "if") */
  name: string;
  /** Optional description shown in the autocomplete popup */
  description?: string;
}

/**
 * Complete Liquid schema passed to MjmlEditor
 */
export interface LiquidSchema {
  /** Variables accessible via {{ variable_name }} syntax */
  variables: LiquidSchemaItem[];
  /** Tags accessible via {% tag_name %} syntax */
  tags: LiquidSchemaItem[];
}

/**
 * Internal type for autocomplete suggestions
 */
export interface LiquidSuggestion {
  id: string;
  name: string;
  description?: string;
  type: 'variable' | 'tag';
}
