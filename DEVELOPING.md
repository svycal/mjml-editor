# Development Guide

This guide covers local development, building, and releasing the library.

## Prerequisites

- Node.js 18+
- pnpm

## Setup

```bash
pnpm install
```

## Development

Start the development playground:

```bash
pnpm dev
```

Opens the editor playground at http://localhost:5173

## Build

Build the library:

```bash
pnpm build
```

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui components
- TipTap for rich text editing
- mjml-browser for HTML rendering

## Project Structure

```
packages/
├── mjml-editor/          # Main library package
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # State management
│   │   ├── lib/mjml/     # MJML parsing and rendering
│   │   └── types/        # TypeScript types
│   └── dist/             # Built output
└── playground/           # Development playground app
```

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
