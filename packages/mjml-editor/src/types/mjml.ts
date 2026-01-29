// Core MJML node structure (matches mjml2json output)
export interface MjmlNode {
  tagName: string;
  attributes: Record<string, string>;
  children?: MjmlNode[];
  content?: string;
  // Internal editor property - stripped when serializing to MJML
  _id?: string;
}

/**
 * Editor extensions configuration.
 * Extensions provide opt-in features beyond standard MJML.
 */
export interface EditorExtensions {
  /**
   * Enable conditional blocks with the `sc-if` attribute.
   * When enabled, blocks can have a Liquid condition that controls
   * server-side rendering. The attribute is preserved in MJML output
   * but stripped from preview rendering.
   * @default false
   */
  conditionalBlocks?: boolean;
}

// mj-font configuration
export interface MjmlFont {
  name: string;
  href: string;
}

// Supported tag names for the editor
export type MjmlTagName =
  | 'mjml'
  | 'mj-head'
  | 'mj-body'
  | 'mj-wrapper'
  | 'mj-section'
  | 'mj-column'
  | 'mj-text'
  | 'mj-image'
  | 'mj-button'
  | 'mj-divider'
  | 'mj-spacer'
  | 'mj-title'
  | 'mj-preview'
  | 'mj-attributes'
  | 'mj-all'
  | 'mj-class'
  | 'mj-style'
  | 'mj-font';

// Block types that can be added inside a column
export type ContentBlockType =
  | 'mj-text'
  | 'mj-image'
  | 'mj-button'
  | 'mj-divider'
  | 'mj-spacer';

// Attribute groups for organizing inspector UI
export type AttributeGroup =
  | 'primary'
  | 'background'
  | 'typography'
  | 'border'
  | 'inner'
  | 'sizing'
  | 'spacing'
  | 'link'
  | 'advanced';

// Attribute schema for validation and UI rendering
export interface AttributeSchema {
  type:
    | 'color'
    | 'dimension'
    | 'text'
    | 'url'
    | 'select'
    | 'padding'
    | 'number';
  label: string;
  default?: string;
  options?: { value: string; label: string }[]; // For select type
  placeholder?: string;
  group?: AttributeGroup; // For grouping in inspector UI
  /**
   * If set, this attribute is only available when the specified extension is enabled.
   * Extension attributes are filtered out when their extension is disabled.
   */
  extension?: keyof EditorExtensions;
}

export type ComponentSchema = Record<string, AttributeSchema>;

// Editor state
export interface EditorState {
  document: MjmlNode;
  selectedBlockId: string | null;
  history: MjmlNode[];
  historyIndex: number;
}

// Editor actions
export type EditorAction =
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | {
      type: 'UPDATE_ATTRIBUTES';
      payload: { id: string; attributes: Record<string, string> };
    }
  | { type: 'UPDATE_CONTENT'; payload: { id: string; content: string } }
  | {
      type: 'ADD_BLOCK';
      payload: { parentId: string; index: number; block: MjmlNode };
    }
  | { type: 'DELETE_BLOCK'; payload: string }
  | {
      type: 'MOVE_BLOCK';
      payload: { id: string; newParentId: string; newIndex: number };
    }
  | { type: 'SET_DOCUMENT'; payload: MjmlNode }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | {
      type: 'UPDATE_MJML_ATTRIBUTE';
      payload: {
        attributeType: 'all' | 'element' | 'class';
        target: string | null; // null for 'all', tagName for 'element', className for 'class'
        attributes: Record<string, string>;
      };
    }
  | { type: 'ADD_CLASS'; payload: string }
  | { type: 'REMOVE_CLASS'; payload: string }
  | { type: 'RENAME_CLASS'; payload: { oldName: string; newName: string } }
  | { type: 'ADD_FONT'; payload: MjmlFont }
  | { type: 'REMOVE_FONT'; payload: string }
  | { type: 'UPDATE_FONT'; payload: MjmlFont };
