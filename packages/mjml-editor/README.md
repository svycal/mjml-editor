# MJML Visual Email Editor

A React-based visual editor for MJML email templates. Built for embedding in applications that need a user-friendly way to edit email templates while keeping MJML markup as the source of truth.

## Features

- **Block-based editing** - Visual representation of MJML structure with sections, columns, and content blocks
- **Live preview** - Side-by-side HTML preview rendered in real-time
- **Property inspector** - Edit block attributes through a settings panel
- **Drag and drop** - Reorder blocks within columns
- **Undo/redo** - Full history support with keyboard shortcuts
- **MJML in, MJML out** - Takes MJML markup as input, returns modified MJML on change
- **Liquid template support** - Autocomplete for Liquid variables and tags
- **Theme support** - Light, dark, and system theme modes

## Supported Components

| Component | Description |
|-----------|-------------|
| `mj-section` | Row containers with background color/image |
| `mj-column` | Responsive columns within sections |
| `mj-text` | Text content with typography settings |
| `mj-image` | Images with dimensions, alt text, and links |
| `mj-button` | Call-to-action buttons with styling |
| `mj-divider` | Horizontal separators |
| `mj-spacer` | Vertical spacing |

## Installation

```bash
npm install @savvycal/mjml-editor
# or
pnpm add @savvycal/mjml-editor
```

### Peer Dependencies

This library requires React 18+ and Tailwind CSS v4:

```bash
npm install react react-dom tailwindcss @tailwindcss/vite tw-animate-css
```

### Styles

This library is designed to work with Tailwind CSS v4. Instead of bundling all styles, the library exports CSS files that integrate with your app's Tailwind build, ensuring no style conflicts and minimal CSS overhead.

Add the following imports to your app's main CSS file:

```css
/* Import library preset BEFORE tailwindcss */
@import "@savvycal/mjml-editor/preset.css";

/* Your Tailwind imports */
@import "tailwindcss";
@import "tw-animate-css";

/* Import library component styles AFTER tailwindcss */
@import "@savvycal/mjml-editor/components.css";
```

The `preset.css` file includes:
- `@source` directive that tells Tailwind to scan the library's dist files for utility classes
- `@theme` tokens that map CSS variables to Tailwind utilities
- Custom utilities (`bg-checkered`, `shadow-framer`, etc.)

The `components.css` file includes:
- Scoped CSS variables for the editor theme (light/dark mode)
- Tiptap/ProseMirror editor styles

## Usage

```tsx
import { useState } from 'react';
import { MjmlEditor } from '@savvycal/mjml-editor';

function App() {
  const [mjml, setMjml] = useState(initialMjml);

  return (
    <MjmlEditor
      value={mjml}
      onChange={setMjml}
    />
  );
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | MJML markup string (required) |
| `onChange` | `(mjml: string) => void` | Called when the document changes (required) |
| `className` | `string` | Optional CSS class for the container |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | Theme preference (default: `'system'`) |
| `liquidSchema` | `LiquidSchema` | Optional schema for Liquid template autocomplete |
| `applyThemeToDocument` | `boolean` | Whether to apply theme class to `document.documentElement`. Needed for dropdown/popover theming. Set to `false` if your app manages document-level theme classes. (default: `true`) |

## Liquid Template Support

The editor provides autocomplete for Liquid template variables and tags. Pass a `liquidSchema` prop to enable this feature:

```tsx
import { MjmlEditor, type LiquidSchema } from '@savvycal/mjml-editor';

const liquidSchema: LiquidSchema = {
  variables: [
    { name: 'user.name', description: 'Recipient name' },
    { name: 'user.email', description: 'Recipient email' },
    { name: 'company.name', description: 'Company name' },
  ],
  tags: [
    { name: 'if', description: 'Conditional block' },
    { name: 'for', description: 'Loop block' },
    { name: 'unless', description: 'Negative conditional' },
  ],
};

function App() {
  const [mjml, setMjml] = useState(initialMjml);

  return (
    <MjmlEditor
      value={mjml}
      onChange={setMjml}
      liquidSchema={liquidSchema}
    />
  );
}
```

When editing text content, typing `{{` will trigger variable autocomplete and `{%` will trigger tag autocomplete.

## Exported Types

The library exports TypeScript types for integration:

```tsx
import type {
  MjmlNode,          // MJML document node structure
  MjmlTagName,       // Union of supported MJML tag names
  ContentBlockType,  // Union of content block types
  LiquidSchema,      // Schema for Liquid autocomplete
  LiquidSchemaItem,  // Individual variable/tag definition
} from '@savvycal/mjml-editor';
```

### LiquidSchema

```typescript
interface LiquidSchemaItem {
  name: string;         // Variable or tag name (e.g., "user.name")
  description?: string; // Description shown in autocomplete
}

interface LiquidSchema {
  variables: LiquidSchemaItem[]; // {{ variable }} syntax
  tags: LiquidSchemaItem[];      // {% tag %} syntax
}
```

## Theme Utilities

The library exports theme utilities if you need to integrate with or control the theme externally:

```tsx
import { ThemeProvider, useTheme, ThemeToggle } from '@savvycal/mjml-editor';
```

| Export | Description |
|--------|-------------|
| `ThemeProvider` | Context provider for theme management |
| `useTheme()` | Hook returning `{ theme, setTheme }` |
| `ThemeToggle` | Pre-built UI component for theme switching |

Note: `MjmlEditor` includes its own `ThemeProvider`, so you don't need to wrap it. These exports are for advanced use cases where you need theme access outside the editor.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Delete` / `Backspace` | Delete selected block |
| `Escape` | Deselect block |

## Contributing

See [DEVELOPING.md](../../DEVELOPING.md) for development setup and release instructions.

## License

MIT
