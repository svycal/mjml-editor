# MJML Visual Email Editor

A React-based visual editor for MJML email templates. Built for embedding in applications that need a user-friendly way to edit email templates while keeping MJML markup as the source of truth.

## Features

- **Block-based editing** - Visual representation of MJML structure with sections, columns, and content blocks
- **Live preview** - Side-by-side HTML preview rendered in real-time
- **Property inspector** - Edit block attributes through a settings panel
- **Drag and drop** - Reorder blocks within columns
- **Undo/redo** - Full history support with keyboard shortcuts
- **MJML in, MJML out** - Takes MJML markup as input, returns modified MJML on change

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
npm install
```

## Development

```bash
npm run dev
```

Opens the editor at http://localhost:5173

## Build

```bash
npm run build
```

## Usage

```tsx
import { MjmlEditor } from '@/components/editor/MjmlEditor';

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
| `value` | `string` | MJML markup string |
| `onChange` | `(mjml: string) => void` | Called when the document changes |
| `className` | `string?` | Optional CSS class for the container |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Delete` / `Backspace` | Delete selected block |
| `Escape` | Deselect block |

## Architecture

```
src/
├── components/
│   ├── editor/           # Main editor components
│   │   ├── MjmlEditor    # Root component
│   │   ├── EditorPane    # Block tree with drag-and-drop
│   │   ├── PreviewPane   # Live HTML preview
│   │   └── BlockInspector # Property editor
│   ├── blocks/           # Block type components
│   └── ui/               # shadcn/ui components
├── context/
│   └── EditorContext     # State management
├── lib/mjml/
│   ├── parser           # MJML ↔ JSON conversion
│   ├── renderer         # MJML → HTML rendering
│   └── schema           # Component attribute definitions
└── types/
    └── mjml             # TypeScript types
```

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui components
- @dnd-kit for drag and drop
- mjml-browser for HTML rendering

## Releasing

This project uses [Changesets](https://github.com/changesets/changesets) for version management and automated releases.

### Adding a Changeset

When you make changes that should be included in a release, add a changeset:

```bash
pnpm changeset
```

You'll be prompted to:

1. Select the package(s) that changed
2. Choose the semver bump type:
   - `patch` - Bug fixes, documentation updates
   - `minor` - New features, non-breaking changes
   - `major` - Breaking changes
3. Write a summary of your changes (this appears in the CHANGELOG)

Commit the generated changeset file (in `.changeset/`) with your PR.

### Release Process

Releases happen automatically when PRs are merged to `main`:

1. **PR merged with changesets** - A "Release" PR is automatically created/updated
2. **Release PR merged** - Package is built, versioned, and published to npm
3. **GitHub Release created** - A release is created with a link to the changelog

### Manual Release (Emergency)

If you need to release manually:

```bash
pnpm version        # Apply changeset versions
pnpm release        # Build and publish to npm
```

### Pre-releases

For pre-release versions (alpha, beta, rc):

```bash
pnpm changeset pre enter alpha   # Enter pre-release mode
pnpm changeset                   # Add changesets as normal
pnpm version                     # Creates 0.2.0-alpha.0, etc.
pnpm changeset pre exit          # Exit pre-release mode
```

## License

MIT
