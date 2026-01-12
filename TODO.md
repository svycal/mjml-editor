# TODO

- [ ] Support for rich text inside of `mj-text` tags
- [x] Support for `css-class` when rendering the visual editor (styles declared in `mj-style` should get applied accordingly)
- [ ] Syntax highlighting / proper code editing for Source view
- [ ] Allow the "default theme" to be passed in to `<MjmlEditor>`
- [ ] Add a prop to `<MjmlEditor>` to enable/disable the theme selector (in case the app just wants to control it instead of showing a UI control)
- [ ] Remove the "Email Structure" text from the top of the left nav (it's implicit)
- [ ] Ensure the color palette is using the `zinc` color scheme from the Tailwind CSS 4 default color palette
- [ ] Maybe: overlay click targets on hover for adding sections/columns/nodes?
- [ ] Liquid variable support in the rich editor: ability to pass an object describing the shape of the Liquid context to the `<MjmlEditor>` and show the user a context menu when typing liquid tags `{{` .
- [ ] Figure out border radius discrepancy on `mj-column` between this editor and the rendered output from `mjml` rust elixir library
