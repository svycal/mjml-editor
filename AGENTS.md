# Agent Instructions

This guide helps coding agents understand the MJML Visual Email Editor project structure, conventions, and tooling.

## Project Overview

A React component library that provides a visual editor for MJML email templates. The editor maintains MJML as the source of truth while offering a user-friendly interface for editing email templates.

**Key Features:**
- Block-based visual editing with drag-and-drop
- Live HTML preview
- Property inspector for block attributes
- Structure outline (tree view)
- Liquid template autocomplete
- Undo/redo with keyboard shortcuts
- Light/dark/system theme support

**Monorepo Structure:**
- `packages/mjml-editor/` - Main library (published to npm as `@savvycal/mjml-editor`)
- `playground/` - Development playground app

## Package Manager

Always use `pnpm`. Never use `npm` or `bun`:

```bash
# Correct
pnpm install
pnpm dev
pnpm build

# Incorrect
npm install
bun install
npm run dev
bun run dev
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x / 19.x | UI framework |
| TypeScript | 5.9.x | Type safety |
| Vite | 7.x | Bundler and dev server |
| Tailwind CSS | v4 | Styling |
| shadcn/ui | - | UI components (Radix-based) |
| TipTap | 2.x | Rich text editing |
| mjml-browser | 4.x | MJML to HTML rendering |
| Vitest | 4.x | Testing |

## Project Structure

```
packages/mjml-editor/src/
├── components/
│   ├── editor/              # Main editor components
│   │   ├── MjmlEditor.tsx   # Root component (main export)
│   │   ├── EditorCanvas.tsx # Visual editing area
│   │   ├── BlockInspector.tsx
│   │   ├── OutlineTree.tsx
│   │   ├── TiptapEditor.tsx
│   │   └── visual-blocks/   # Block renderers (VisualText, VisualButton, etc.)
│   └── ui/                  # Base UI components (button, card, tabs, etc.)
├── context/
│   ├── EditorContext.tsx    # Main editor state
│   ├── ThemeContext.tsx     # Theme management
│   └── LiquidSchemaContext.tsx
├── extensions/              # TipTap extensions for Liquid support
├── hooks/                   # Custom React hooks
├── lib/
│   └── mjml/
│       ├── parser.ts        # MJML string → AST
│       ├── renderer.ts      # MJML → HTML
│       ├── schema.ts        # Component definitions
│       └── attributes.ts    # Attribute handling
├── types/
│   ├── mjml.ts              # Core type definitions
│   └── liquid.ts            # Liquid schema types
└── index.ts                 # Public API exports
```

## Development Commands

```bash
# Start playground dev server (main development mode)
pnpm dev

# Watch library for changes (run alongside pnpm dev)
pnpm dev:lib

# Run both concurrently
pnpm dev:concurrent

# Build the library
pnpm build:lib

# Build everything (library + playground)
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Run tests
pnpm --filter @savvycal/mjml-editor test

# Run tests in watch mode
pnpm --filter @savvycal/mjml-editor test:watch
```

## Code Conventions

### TypeScript

- **Strict mode** enabled
- **Path alias:** `@/*` maps to `src/*`
- **Type imports:** Use `import type { Foo }` for type-only imports
- **Named exports only:** No default exports
- **Discriminated unions** for reducer actions

```typescript
// Correct
import type { MjmlNode, ContentBlockType } from '@/types/mjml';
export function MyComponent() { ... }

// Incorrect
import { MjmlNode } from '@/types/mjml';  // Missing 'type'
export default function MyComponent() { ... }  // Default export
```

### React Patterns

**State management:** Context + `useReducer` (no Redux/Zustand)

```typescript
// Action pattern - discriminated unions
type EditorAction =
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'UPDATE_ATTRIBUTES'; payload: { id: string; attributes: Record<string, string> } };
```

**Hook usage:**
- `useCallback` for all event handlers and action creators
- `useMemo` for expensive computations and context values
- Strict dependency arrays (no missing deps)

**Event handlers:** Use `handle{EventName}` naming

```typescript
const handleClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  selectBlock(node._id!);
};
```

### Styling

- **Tailwind CSS v4** for all styling
- **`cn()` utility** for conditional classes (clsx + tailwind-merge)
- **CVA (Class Variance Authority)** for component variants
- **`data-slot` attributes** for styling hooks

```typescript
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('base-classes', {
  variants: {
    variant: { default: '...', destructive: '...' },
    size: { default: '...', sm: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Feature components | PascalCase | `MjmlEditor.tsx`, `BlockInspector.tsx` |
| UI primitives | lowercase-hyphenated | `button.tsx`, `scroll-area.tsx` |
| Hooks | useCamelCase | `useFontLoader.ts` |
| Tests | filename.test.ts | `parser.test.ts` |
| Types | lowercase | `mjml.ts`, `liquid.ts` |

## Testing

- **Framework:** Vitest with jsdom environment
- **Location:** Tests are colocated with source files
- **Globals:** `describe`, `it`, `expect` available without imports

```typescript
import { describe, it, expect } from 'vitest';
import { parseMjml } from './parser';

describe('parseMjml', () => {
  it('should parse valid MJML', () => {
    const result = parseMjml('<mjml>...</mjml>');
    expect(result.tagName).toBe('mjml');
  });
});
```

## Code Formatting

**Prettier configuration:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

**ESLint:** Flat config format with TypeScript, React Hooks, and Prettier rules.

## CI/CD

**GitHub Actions runs on every PR:**
1. `pnpm lint` - ESLint
2. `pnpm typecheck` - TypeScript
3. `pnpm --filter @savvycal/mjml-editor test` - Vitest
4. `pnpm build:lib` - Build verification

**Releases:** Managed via Changesets
```bash
pnpm changeset        # Add a changeset
pnpm version          # Apply versions
pnpm release          # Build and publish
```

## Architecture

### MJML Parsing Pipeline

1. `parseMjml()` in `lib/mjml/parser.ts` converts MJML string to `MjmlNode` AST
2. Each node receives a unique `_id` for editor tracking
3. Parser handles edge cases (ampersands in URLs, special characters)

### Rendering Pipeline

1. `renderMjmlToHtml()` orchestrates MJML → HTML conversion
2. Uses `mjml-browser` for browser-compatible rendering
3. CSS is scoped to prevent leaking into host application

### State Management Flow

```
User interaction → dispatch(action) → editorReducer → new state → re-render
                                            ↓
                                    history updated (undo/redo)
                                            ↓
                                    onChange callback fired
```

### Component Hierarchy

```
MjmlEditor
├── ThemeProvider
├── LiquidSchemaProvider
└── EditorProvider
    └── EditorContent
        ├── OutlineTree (structure navigation)
        ├── EditorCanvas (visual editing)
        │   └── VisualSection/Column/Text/Button/Image/Divider/Spacer
        ├── BlockInspector (property editing)
        └── InteractivePreview (HTML preview)
```

### Key Contexts

| Context | Purpose |
|---------|---------|
| `EditorContext` | Document state, selection, history, all mutations |
| `ThemeContext` | Light/dark/system theme management |
| `LiquidSchemaContext` | Liquid variable/tag autocomplete schema |

## Troubleshooting

### Common Issues

**"useEditor must be used within EditorProvider"**
- Component is outside the MjmlEditor tree
- Ensure custom components are children of MjmlEditor

**MJML parsing errors**
- Check for unescaped special characters in attributes
- Verify XML validity (proper nesting, closed tags)
- Parser provides formatted error messages with line numbers

**Styles not applying**
- Ensure `@savvycal/mjml-editor/styles.css` is imported
- Check for CSS specificity conflicts with host application
- Tailwind v4 requires Vite plugin for development

**Hot reload not working**
- Run `pnpm dev:concurrent` for both library watch and playground
- Or run `pnpm dev:lib` and `pnpm dev` in separate terminals

### Debugging Strategies

- Use React DevTools to inspect EditorContext state
- Check browser console for MJML rendering warnings
- Reference `parser.test.ts` for expected input/output patterns

### Build Issues

- Clear `dist/` directories if types are stale
- Run `pnpm typecheck` before building
- Ensure pnpm lockfile is current (`pnpm install --frozen-lockfile`)
