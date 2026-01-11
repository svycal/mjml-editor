import type { ComponentSchema, ContentBlockType } from '@/types/mjml';

// Common padding schema
const paddingSchema: ComponentSchema = {
  padding: { type: 'padding', label: 'Padding', default: '10px 25px' },
};

// Section attributes
export const sectionSchema: ComponentSchema = {
  'background-color': { type: 'color', label: 'Background Color', default: '' },
  'background-url': {
    type: 'url',
    label: 'Background Image URL',
    placeholder: 'https://...',
  },
  padding: { type: 'padding', label: 'Padding', default: '20px 0' },
  'full-width': {
    type: 'select',
    label: 'Full Width',
    default: 'false',
    options: [
      { value: 'false', label: 'No' },
      { value: 'full-width', label: 'Yes' },
    ],
  },
};

// Column attributes
export const columnSchema: ComponentSchema = {
  width: { type: 'dimension', label: 'Width', placeholder: 'auto, 50%, 200px' },
  'background-color': { type: 'color', label: 'Background Color', default: '' },
  'vertical-align': {
    type: 'select',
    label: 'Vertical Align',
    default: 'top',
    options: [
      { value: 'top', label: 'Top' },
      { value: 'middle', label: 'Middle' },
      { value: 'bottom', label: 'Bottom' },
    ],
  },
  padding: { type: 'padding', label: 'Padding', default: '' },
};

// Text attributes
export const textSchema: ComponentSchema = {
  color: { type: 'color', label: 'Text Color', default: '#000000' },
  'font-size': { type: 'dimension', label: 'Font Size', default: '13px' },
  'font-family': {
    type: 'text',
    label: 'Font Family',
    default: 'Ubuntu, Helvetica, Arial, sans-serif',
  },
  'font-weight': {
    type: 'select',
    label: 'Font Weight',
    default: 'normal',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'bold', label: 'Bold' },
      { value: '300', label: 'Light' },
      { value: '500', label: 'Medium' },
      { value: '700', label: 'Bold (700)' },
    ],
  },
  align: {
    type: 'select',
    label: 'Alignment',
    default: 'left',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
      { value: 'justify', label: 'Justify' },
    ],
  },
  'line-height': { type: 'dimension', label: 'Line Height', default: '1.5' },
  ...paddingSchema,
};

// Image attributes
export const imageSchema: ComponentSchema = {
  src: { type: 'url', label: 'Image URL', placeholder: 'https://...' },
  alt: { type: 'text', label: 'Alt Text', default: '' },
  width: { type: 'dimension', label: 'Width', placeholder: '600px' },
  height: { type: 'dimension', label: 'Height', default: 'auto' },
  href: { type: 'url', label: 'Link URL', placeholder: 'https://...' },
  align: {
    type: 'select',
    label: 'Alignment',
    default: 'center',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },
  'border-radius': { type: 'dimension', label: 'Border Radius', default: '' },
  ...paddingSchema,
};

// Button attributes - organized by group for inspector UI
export const buttonSchema: ComponentSchema = {
  // Primary attributes (always visible)
  href: {
    type: 'url',
    label: 'Link URL',
    placeholder: 'https://...',
    group: 'primary',
  },
  'background-color': {
    type: 'color',
    label: 'Background Color',
    default: '#414141',
    group: 'primary',
  },
  color: {
    type: 'color',
    label: 'Text Color',
    default: '#ffffff',
    group: 'primary',
  },
  align: {
    type: 'select',
    label: 'Alignment',
    default: 'center',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
    group: 'primary',
  },
  'border-radius': {
    type: 'dimension',
    label: 'Border Radius',
    default: '3px',
    group: 'primary',
  },
  'inner-padding': {
    type: 'padding',
    label: 'Inner Padding',
    default: '10px 25px',
    group: 'primary',
  },
  padding: {
    type: 'padding',
    label: 'Padding',
    default: '10px 25px',
    group: 'primary',
  },

  // Typography attributes
  'font-size': {
    type: 'dimension',
    label: 'Font Size',
    default: '13px',
    group: 'typography',
  },
  'font-family': {
    type: 'text',
    label: 'Font Family',
    default: 'Ubuntu, Helvetica, Arial, sans-serif',
    group: 'typography',
  },
  'font-weight': {
    type: 'select',
    label: 'Font Weight',
    default: 'normal',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'bold', label: 'Bold' },
      { value: '300', label: 'Light' },
      { value: '500', label: 'Medium' },
      { value: '700', label: 'Bold (700)' },
    ],
    group: 'typography',
  },
  'font-style': {
    type: 'select',
    label: 'Font Style',
    default: 'normal',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'italic', label: 'Italic' },
      { value: 'oblique', label: 'Oblique' },
    ],
    group: 'typography',
  },
  'line-height': {
    type: 'dimension',
    label: 'Line Height',
    default: '120%',
    group: 'typography',
  },
  'letter-spacing': {
    type: 'dimension',
    label: 'Letter Spacing',
    placeholder: '0px',
    group: 'typography',
  },
  'text-align': {
    type: 'select',
    label: 'Text Align',
    default: 'center',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
    group: 'typography',
  },
  'text-decoration': {
    type: 'select',
    label: 'Text Decoration',
    default: 'none',
    options: [
      { value: 'none', label: 'None' },
      { value: 'underline', label: 'Underline' },
      { value: 'overline', label: 'Overline' },
      { value: 'line-through', label: 'Line Through' },
    ],
    group: 'typography',
  },
  'text-transform': {
    type: 'select',
    label: 'Text Transform',
    default: 'none',
    options: [
      { value: 'none', label: 'None' },
      { value: 'capitalize', label: 'Capitalize' },
      { value: 'uppercase', label: 'Uppercase' },
      { value: 'lowercase', label: 'Lowercase' },
    ],
    group: 'typography',
  },

  // Border attributes
  border: {
    type: 'text',
    label: 'Border',
    placeholder: '1px solid #000',
    group: 'border',
  },
  'border-top': {
    type: 'text',
    label: 'Border Top',
    placeholder: '1px solid #000',
    group: 'border',
  },
  'border-right': {
    type: 'text',
    label: 'Border Right',
    placeholder: '1px solid #000',
    group: 'border',
  },
  'border-bottom': {
    type: 'text',
    label: 'Border Bottom',
    placeholder: '1px solid #000',
    group: 'border',
  },
  'border-left': {
    type: 'text',
    label: 'Border Left',
    placeholder: '1px solid #000',
    group: 'border',
  },

  // Sizing attributes
  width: {
    type: 'dimension',
    label: 'Width',
    placeholder: 'auto',
    group: 'sizing',
  },
  height: {
    type: 'dimension',
    label: 'Height',
    placeholder: 'auto',
    group: 'sizing',
  },

  // Spacing attributes (granular padding)
  'padding-top': {
    type: 'dimension',
    label: 'Padding Top',
    placeholder: '10px',
    group: 'spacing',
  },
  'padding-right': {
    type: 'dimension',
    label: 'Padding Right',
    placeholder: '25px',
    group: 'spacing',
  },
  'padding-bottom': {
    type: 'dimension',
    label: 'Padding Bottom',
    placeholder: '10px',
    group: 'spacing',
  },
  'padding-left': {
    type: 'dimension',
    label: 'Padding Left',
    placeholder: '25px',
    group: 'spacing',
  },

  // Link attributes
  target: {
    type: 'select',
    label: 'Link Target',
    default: '_blank',
    options: [
      { value: '_blank', label: 'New Tab (_blank)' },
      { value: '_self', label: 'Same Tab (_self)' },
      { value: '_parent', label: 'Parent Frame (_parent)' },
      { value: '_top', label: 'Top Frame (_top)' },
    ],
    group: 'link',
  },
  rel: {
    type: 'text',
    label: 'Link Rel',
    placeholder: 'noopener noreferrer',
    group: 'link',
  },
  name: {
    type: 'text',
    label: 'Link Name',
    placeholder: 'button-name',
    group: 'link',
  },
  title: {
    type: 'text',
    label: 'Tooltip',
    placeholder: 'Button tooltip',
    group: 'link',
  },

  // Advanced attributes
  'container-background-color': {
    type: 'color',
    label: 'Container Background',
    group: 'advanced',
  },
  'vertical-align': {
    type: 'select',
    label: 'Vertical Align',
    default: 'middle',
    options: [
      { value: 'top', label: 'Top' },
      { value: 'middle', label: 'Middle' },
      { value: 'bottom', label: 'Bottom' },
    ],
    group: 'advanced',
  },
  'css-class': {
    type: 'text',
    label: 'CSS Class',
    placeholder: 'custom-class',
    group: 'advanced',
  },
};

// Divider attributes
export const dividerSchema: ComponentSchema = {
  'border-color': { type: 'color', label: 'Color', default: '#000000' },
  'border-width': { type: 'dimension', label: 'Thickness', default: '4px' },
  'border-style': {
    type: 'select',
    label: 'Style',
    default: 'solid',
    options: [
      { value: 'solid', label: 'Solid' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'dotted', label: 'Dotted' },
    ],
  },
  width: { type: 'dimension', label: 'Width', default: '100%' },
  ...paddingSchema,
};

// Spacer attributes
export const spacerSchema: ComponentSchema = {
  height: { type: 'dimension', label: 'Height', default: '20px' },
};

// Get schema by tag name
export function getSchemaForTag(tagName: string): ComponentSchema | null {
  switch (tagName) {
    case 'mj-section':
      return sectionSchema;
    case 'mj-column':
      return columnSchema;
    case 'mj-text':
      return textSchema;
    case 'mj-image':
      return imageSchema;
    case 'mj-button':
      return buttonSchema;
    case 'mj-divider':
      return dividerSchema;
    case 'mj-spacer':
      return spacerSchema;
    default:
      return null;
  }
}

// Content block definitions for the add block picker
export const contentBlockTypes: {
  type: ContentBlockType;
  label: string;
  icon: string;
}[] = [
  { type: 'mj-text', label: 'Text', icon: 'T' },
  { type: 'mj-image', label: 'Image', icon: '🖼' },
  { type: 'mj-button', label: 'Button', icon: '▢' },
  { type: 'mj-divider', label: 'Divider', icon: '―' },
  { type: 'mj-spacer', label: 'Spacer', icon: '↕' },
];

// Default content/attributes for new blocks
export function getDefaultBlock(type: ContentBlockType): {
  attributes: Record<string, string>;
  content?: string;
} {
  switch (type) {
    case 'mj-text':
      return {
        attributes: {},
        content: 'Enter your text here',
      };
    case 'mj-image':
      return {
        attributes: {
          src: 'https://via.placeholder.com/600x300',
          alt: 'Image description',
        },
      };
    case 'mj-button':
      return {
        attributes: {
          href: '#',
        },
        content: 'Click me',
      };
    case 'mj-divider':
      return {
        attributes: {},
      };
    case 'mj-spacer':
      return {
        attributes: {
          height: '20px',
        },
      };
  }
}
