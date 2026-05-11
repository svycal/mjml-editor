# @savvycal/mjml-editor

## 0.9.1

### Patch Changes

- [#10](https://github.com/svycal/mjml-editor/pull/10) [`17a1e9e`](https://github.com/svycal/mjml-editor/commit/17a1e9eac7ccdc519375c39de330fa92acfde7da) Thanks [@derrickreimer](https://github.com/derrickreimer)! - Bump `uuid` floor to `^13.0.1` to pick up the upstream fix for the missing buffer bounds check in `v3`/`v5`/`v6` (GHSA-w5hq-g745-h8pq).

## 0.9.0

### Minor Changes

- [`560ca4a`](https://github.com/svycal/mjml-editor/commit/560ca4aeef5300ca121bf22f862603cff7e99dd3) Thanks [@derrickreimer](https://github.com/derrickreimer)! - Move mjml preview rendering to server-side calls

## 0.8.0

### Minor Changes

- [`ef5a611`](https://github.com/svycal/mjml-editor/commit/ef5a61137cecb4844bc8a0daa6202265e617f19c) Thanks [@derrickreimer](https://github.com/derrickreimer)! - Add nonce prop for dynamic script tags

## 0.7.0

### Patch Changes

- Remove the Source tab warning banner to reduce visual noise and keep the editor focused on the MJML content.

## 0.6.0

### Patch Changes

- Improve Source tab CodeMirror readability and host-app consistency by introducing theme-aware MJML syntax colors with resilient fallbacks, and by hardening editor typography/wrapping defaults against external CSS overrides.
- Switch Source tab editing to live-apply valid MJML changes (no manual Apply step), remove the source dirty/discard flow, and remove the `onSourceApply` prop from `MjmlEditor`.

## 0.5.0

### Minor Changes

- Fix liquid link highlighting in visual editor.
- Add `onSourceApply` callback so embedding apps can react when Source tab Apply succeeds.
- Add conditional blocks extension.
- Prevent accidental loss of un-applied Source tab edits by showing a confirmation modal before switching away.
- Add a proper CodeMirror-based MJML source editor with syntax highlighting, line numbers, search, and keyboard apply support.

## 0.4.0

### Minor Changes

- [#6](https://github.com/svycal/mjml-editor/pull/6) [`2351829`](https://github.com/svycal/mjml-editor/commit/235182992ff865c7246d666fd67c46590473066a) Thanks [@derrickreimer](https://github.com/derrickreimer)! - Add conditional blocks extension

## 0.3.0

### Minor Changes

- [`e83800b`](https://github.com/svycal/mjml-editor/commit/e83800b1bf69c686e65459da95104e560eea1cd2) Thanks [@derrickreimer](https://github.com/derrickreimer)! - Add drag-and-drop validation to enforce MJML nesting rules. Invalid drop operations (e.g., dropping a column outside a section or a text block outside a column) are now prevented in the outline tree.

## 0.2.0

### Minor Changes

- [`d2d720b`](https://github.com/svycal/mjml-editor/commit/d2d720bd2b2dbb49361be7cdf337e2d2abeac3a0) Thanks [@derrickreimer](https://github.com/derrickreimer)! - Add error state handling for invalid MJML structure in the visual editor and load the default Ubuntu font for proper preview rendering

## 0.1.0

### Minor Changes

- [`a1ed692`](https://github.com/svycal/mjml-editor/commit/a1ed69261106fc5a5d2269aea679d31913954d3e) Thanks [@derrickreimer](https://github.com/derrickreimer)! - Add view options for the editor

## 0.0.3

### Patch Changes

- [`1867801`](https://github.com/svycal/mjml-editor/commit/18678015f8f258a6e753fb7c9d7e6adc861705d0) Thanks [@derrickreimer](https://github.com/derrickreimer)! - Overhaul how styles work

## 0.0.2

### Patch Changes

- [`626ea70`](https://github.com/svycal/mjml-editor/commit/626ea70d0705718885a7982b6f58e54bee49cdd9) Thanks [@derrickreimer](https://github.com/derrickreimer)! - Improve build for tree-shakability

## 0.0.1

### Patch Changes

- Initial release
