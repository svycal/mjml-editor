# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

## Adding a changeset

When making changes that should be released, run:

```bash
pnpm changeset
```

This will prompt you to:

1. Select which packages have changed (usually `@savvycal/mjml-editor`)
2. Choose a semver bump type (patch/minor/major)
3. Write a summary of the changes

The changeset file will be committed with your PR.

## Release process

When PRs with changesets are merged to `main`, a "Release" PR is automatically created/updated. Merging this PR triggers the npm publish.
