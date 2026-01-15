---
name: changeset
description: Use this skill when the user wants to create a changeset for releasing changes, when preparing a release, or when running the /changeset command.
version: 1.0.0
---

# Changeset Generator

This skill generates changesets for the `@savvycal/mjml-editor` package.

## Process

### Step 1: Find the Last Release Tag

```bash
git tag -l '@savvycal/mjml-editor@*' --sort=-v:refname | head -1
```

Store the result as `LAST_TAG`. If no tags exist, use the initial commit.

### Step 2: Get Commits Since Last Release

```bash
git log <LAST_TAG>..HEAD --oneline --no-merges
```

If no commits since the last tag, inform the user there are no changes to release.

### Step 3: Determine Semver Type

Analyze commits to determine the version bump:

**Major** (breaking changes):
- "BREAKING" or "breaking change" in message
- Removal of public API
- Incompatible changes to props/signatures

**Minor** (new features):
- Commits with "Add", "Implement", "Introduce"
- New components, hooks, exports
- New optional props or configuration

**Patch** (bug fixes):
- Commits with "Fix", "Correct"
- Refactors, style changes, docs
- Internal improvements, dependency updates

**Rule**: Use the HIGHEST applicable type.

### Step 4: Write Changeset Summary

Guidelines:
- Focus on user impact
- Be concise (1-3 sentences)
- Use present tense ("Add" not "Added")
- Skip internal implementation details

### Step 5: Generate Filename

Create a random slug using pattern: `adjective-noun-verb.md`

Examples: `brave-lions-march.md`, `calm-waves-flow.md`, `swift-birds-soar.md`

### Step 6: Write the File

Create `.changeset/<slug>.md`:

```markdown
---
'@savvycal/mjml-editor': <bump-type>
---

<summary>
```

### Step 7: Confirm with User

Show:
1. Filename created
2. Version bump type and reasoning
3. Changeset summary

Ask if adjustments are needed.

## Edge Cases

- **No commits**: Don't create changeset, inform user
- **No tags exist**: Get all commits or ask for guidance
- **Ambiguous changes**: Prefer patch unless clear new functionality
