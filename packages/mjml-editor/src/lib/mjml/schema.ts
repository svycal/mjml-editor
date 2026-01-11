import type { ComponentSchema, ContentBlockType } from '@/types/mjml';

// Common padding schema
const paddingSchema: ComponentSchema = {
  padding: { type: 'padding', label: 'Padding', default: '10px 25px' },
};

// Section attributes - organized by group for inspector UI
export const sectionSchema: ComponentSchema = {
  // Primary attributes (always visible)
  'background-color': {
    type: 'color',
    label: 'Background Color',
    group: 'primary',
  },
  'full-width': {
    type: 'select',
    label: 'Full Width',
    default: 'false',
    options: [
      { value: 'false', label: 'No' },
      { value: 'full-width', label: 'Yes' },
    ],
    group: 'primary',
  },
  padding: {
    type: 'padding',
    label: 'Padding',
    default: '20px 0',
    group: 'primary',
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
    group: 'primary',
  },

  // Background attributes
  'background-url': {
    type: 'url',
    label: 'Background Image',
    placeholder: 'https://...',
    group: 'background',
  },
  'background-size': {
    type: 'select',
    label: 'Background Size',
    default: 'auto',
    options: [
      { value: 'auto', label: 'Auto' },
      { value: 'cover', label: 'Cover' },
      { value: 'contain', label: 'Contain' },
    ],
    group: 'background',
  },
  'background-repeat': {
    type: 'select',
    label: 'Background Repeat',
    default: 'repeat',
    options: [
      { value: 'repeat', label: 'Repeat' },
      { value: 'no-repeat', label: 'No Repeat' },
    ],
    group: 'background',
  },
  'background-position': {
    type: 'text',
    label: 'Background Position',
    default: 'top center',
    placeholder: 'top center',
    group: 'background',
  },
  'background-position-x': {
    type: 'select',
    label: 'Position X',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
    group: 'background',
  },
  'background-position-y': {
    type: 'select',
    label: 'Position Y',
    options: [
      { value: 'top', label: 'Top' },
      { value: 'center', label: 'Center' },
      { value: 'bottom', label: 'Bottom' },
    ],
    group: 'background',
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
  'border-radius': {
    type: 'dimension',
    label: 'Border Radius',
    placeholder: '0px',
    group: 'border',
  },

  // Spacing attributes (granular padding)
  'padding-top': {
    type: 'dimension',
    label: 'Padding Top',
    placeholder: '20px',
    group: 'spacing',
  },
  'padding-right': {
    type: 'dimension',
    label: 'Padding Right',
    placeholder: '0px',
    group: 'spacing',
  },
  'padding-bottom': {
    type: 'dimension',
    label: 'Padding Bottom',
    placeholder: '20px',
    group: 'spacing',
  },
  'padding-left': {
    type: 'dimension',
    label: 'Padding Left',
    placeholder: '0px',
    group: 'spacing',
  },

  // Advanced attributes
  direction: {
    type: 'select',
    label: 'Direction',
    default: 'ltr',
    options: [
      { value: 'ltr', label: 'Left to Right' },
      { value: 'rtl', label: 'Right to Left' },
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

// Column attributes - organized by group for inspector UI
export const columnSchema: ComponentSchema = {
  // Primary attributes (always visible)
  width: {
    type: 'dimension',
    label: 'Width',
    placeholder: 'auto, 50%, 200px',
    group: 'primary',
  },
  'background-color': {
    type: 'color',
    label: 'Background Color',
    group: 'primary',
  },
  'vertical-align': {
    type: 'select',
    label: 'Vertical Align',
    default: 'top',
    options: [
      { value: 'top', label: 'Top' },
      { value: 'middle', label: 'Middle' },
      { value: 'bottom', label: 'Bottom' },
    ],
    group: 'primary',
  },
  padding: {
    type: 'padding',
    label: 'Padding',
    group: 'primary',
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
  'border-radius': {
    type: 'dimension',
    label: 'Border Radius',
    placeholder: '0px',
    group: 'border',
  },

  // Inner styling attributes
  'inner-background-color': {
    type: 'color',
    label: 'Inner Background',
    group: 'inner',
  },
  'inner-border': {
    type: 'text',
    label: 'Inner Border',
    placeholder: '1px solid #000',
    group: 'inner',
  },
  'inner-border-top': {
    type: 'text',
    label: 'Inner Border Top',
    placeholder: '1px solid #000',
    group: 'inner',
  },
  'inner-border-right': {
    type: 'text',
    label: 'Inner Border Right',
    placeholder: '1px solid #000',
    group: 'inner',
  },
  'inner-border-bottom': {
    type: 'text',
    label: 'Inner Border Bottom',
    placeholder: '1px solid #000',
    group: 'inner',
  },
  'inner-border-left': {
    type: 'text',
    label: 'Inner Border Left',
    placeholder: '1px solid #000',
    group: 'inner',
  },
  'inner-border-radius': {
    type: 'dimension',
    label: 'Inner Border Radius',
    placeholder: '0px',
    group: 'inner',
  },

  // Spacing attributes (granular padding)
  'padding-top': {
    type: 'dimension',
    label: 'Padding Top',
    placeholder: '0px',
    group: 'spacing',
  },
  'padding-right': {
    type: 'dimension',
    label: 'Padding Right',
    placeholder: '0px',
    group: 'spacing',
  },
  'padding-bottom': {
    type: 'dimension',
    label: 'Padding Bottom',
    placeholder: '0px',
    group: 'spacing',
  },
  'padding-left': {
    type: 'dimension',
    label: 'Padding Left',
    placeholder: '0px',
    group: 'spacing',
  },

  // Advanced attributes
  direction: {
    type: 'select',
    label: 'Direction',
    default: 'ltr',
    options: [
      { value: 'ltr', label: 'Left to Right' },
      { value: 'rtl', label: 'Right to Left' },
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

// Text attributes - organized by group for inspector UI
export const textSchema: ComponentSchema = {
  // Primary attributes (always visible)
  color: {
    type: 'color',
    label: 'Text Color',
    default: '#000000',
    group: 'primary',
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
    default: '1',
    group: 'typography',
  },
  'letter-spacing': {
    type: 'dimension',
    label: 'Letter Spacing',
    placeholder: '0px',
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

  // Sizing attributes
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

  // Advanced attributes
  'container-background-color': {
    type: 'color',
    label: 'Container Background',
    group: 'advanced',
  },
  'css-class': {
    type: 'text',
    label: 'CSS Class',
    placeholder: 'custom-class',
    group: 'advanced',
  },
};

// Image attributes - organized by group for inspector UI
export const imageSchema: ComponentSchema = {
  // Primary attributes (always visible)
  src: {
    type: 'url',
    label: 'Image URL',
    placeholder: 'https://...',
    group: 'primary',
  },
  alt: {
    type: 'text',
    label: 'Alt Text',
    group: 'primary',
  },
  width: {
    type: 'dimension',
    label: 'Width',
    placeholder: '600px',
    group: 'primary',
  },
  height: {
    type: 'dimension',
    label: 'Height',
    default: 'auto',
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
  padding: {
    type: 'padding',
    label: 'Padding',
    default: '10px 25px',
    group: 'primary',
  },

  // Border attributes
  border: {
    type: 'text',
    label: 'Border',
    placeholder: '1px solid #000',
    default: '0',
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
  'border-radius': {
    type: 'dimension',
    label: 'Border Radius',
    placeholder: '0px',
    group: 'border',
  },

  // Sizing attributes
  'max-height': {
    type: 'dimension',
    label: 'Max Height',
    placeholder: 'none',
    group: 'sizing',
  },
  'fluid-on-mobile': {
    type: 'select',
    label: 'Fluid on Mobile',
    default: 'false',
    options: [
      { value: 'false', label: 'No' },
      { value: 'true', label: 'Yes' },
    ],
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
  href: {
    type: 'url',
    label: 'Link URL',
    placeholder: 'https://...',
    group: 'link',
  },
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
    placeholder: 'image-link',
    group: 'link',
  },
  title: {
    type: 'text',
    label: 'Title / Tooltip',
    placeholder: 'Image title',
    group: 'link',
  },

  // Advanced attributes
  'container-background-color': {
    type: 'color',
    label: 'Container Background',
    group: 'advanced',
  },
  'font-size': {
    type: 'dimension',
    label: 'Alt Text Size',
    default: '13px',
    group: 'advanced',
  },
  srcset: {
    type: 'text',
    label: 'Srcset',
    placeholder: 'image-300.jpg 300w, image-600.jpg 600w',
    group: 'advanced',
  },
  sizes: {
    type: 'text',
    label: 'Sizes',
    placeholder: '(max-width: 600px) 100vw, 600px',
    group: 'advanced',
  },
  usemap: {
    type: 'text',
    label: 'Image Map',
    placeholder: '#mapname',
    group: 'advanced',
  },
  'css-class': {
    type: 'text',
    label: 'CSS Class',
    placeholder: 'custom-class',
    group: 'advanced',
  },
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
