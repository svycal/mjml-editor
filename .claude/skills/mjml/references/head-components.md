# MJML Head Components Reference

Complete specification for all MJML head components.

---

## mj-attributes

Defines default attributes for components and creates reusable style classes.

### Usage

Contains three types of child elements:

1. **Component defaults** - Override defaults for specific component types
2. **mj-class** - Create named style classes
3. **mj-all** - Set attributes for all components

### Example

```xml
<mj-head>
  <mj-attributes>
    <!-- Override defaults for all mj-text components -->
    <mj-text padding="0" font-size="14px" line-height="1.5" />

    <!-- Override defaults for all mj-button components -->
    <mj-button background-color="#4A90D9" border-radius="25px" />

    <!-- Create reusable classes -->
    <mj-class name="primary" background-color="#4A90D9" color="#ffffff" />
    <mj-class name="secondary" background-color="#f4f4f4" color="#333333" />
    <mj-class name="heading" font-size="24px" font-weight="bold" />
    <mj-class name="small" font-size="12px" color="#888888" />

    <!-- Apply to all components -->
    <mj-all font-family="Helvetica, Arial, sans-serif" />
  </mj-attributes>
</mj-head>
```

### Applying Classes

Use the `mj-class` attribute on any component:

```xml
<mj-button mj-class="primary">Click Me</mj-button>
<mj-text mj-class="heading">Welcome!</mj-text>
<mj-text mj-class="small">Fine print here</mj-text>
```

Multiple classes can be combined (space-separated):

```xml
<mj-text mj-class="heading primary">Styled Heading</mj-text>
```

---

## mj-breakpoint

Sets the viewport width at which columns stack vertically on mobile.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | px | `480px` | Breakpoint threshold |

### Example

```xml
<mj-head>
  <mj-breakpoint width="320px" />
</mj-head>
```

### Notes

- Default breakpoint is 480px
- Setting lower values means layouts stay side-by-side on more devices
- Setting higher values means layouts stack earlier on larger screens

---

## mj-font

Imports external web fonts via CSS.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | none | Font family name for CSS reference |
| `href` | url | none | URL to CSS file with @font-face declaration |

### Example

```xml
<mj-head>
  <mj-font name="Raleway"
           href="https://fonts.googleapis.com/css?family=Raleway:400,700" />
  <mj-font name="Open Sans"
           href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" />
</mj-head>

<mj-body>
  <mj-section>
    <mj-column>
      <mj-text font-family="Raleway, sans-serif">
        This uses Raleway font
      </mj-text>
    </mj-column>
  </mj-section>
</mj-body>
```

### Notes

- Web fonts have limited email client support
- Always include fallback fonts in `font-family`
- Google Fonts is a common source for web fonts
- Some clients (Outlook) will ignore web fonts and use fallbacks

---

## mj-html-attributes

Adds custom HTML attributes to rendered elements using CSS-like selectors.

### Structure

Contains `mj-selector` elements with `mj-html-attribute` children.

### mj-selector Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `path` | string | none | CSS selector targeting elements |

### mj-html-attribute Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | none | HTML attribute name |

### Example

```xml
<mj-head>
  <mj-html-attributes>
    <mj-selector path=".tracking-link a">
      <mj-html-attribute name="data-track">true</mj-html-attribute>
      <mj-html-attribute name="data-category">email</mj-html-attribute>
    </mj-selector>
    <mj-selector path=".header td">
      <mj-html-attribute name="role">banner</mj-html-attribute>
    </mj-selector>
  </mj-html-attributes>
</mj-head>

<mj-body>
  <mj-section css-class="header">
    <mj-column>
      <mj-text css-class="tracking-link">
        <a href="https://example.com">Track this link</a>
      </mj-text>
    </mj-column>
  </mj-section>
</mj-body>
```

### Use Cases

- Adding data attributes for analytics tracking
- Adding ARIA roles for accessibility
- Adding custom attributes for dynamic content systems

---

## mj-preview

Sets the preview text shown in email client inbox listings.

### Attributes

None - content is the preview text.

### Example

```xml
<mj-head>
  <mj-preview>Your order has shipped! Track your package inside.</mj-preview>
</mj-head>
```

### Notes

- Preview text appears after the subject line in inbox views
- Keep it concise (50-100 characters ideal)
- Some clients may show more, some less
- Use it to complement (not repeat) the subject line

---

## mj-style

Adds CSS styles to the email.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `inline` | string | none | Set to `"inline"` to inline styles into elements |

### Example - Standard CSS

```xml
<mj-head>
  <mj-style>
    .blue-text {
      color: #4A90D9 !important;
    }
    .custom-link a {
      color: #FF6600;
      text-decoration: underline;
    }
    @media only screen and (max-width: 480px) {
      .mobile-hidden {
        display: none !important;
      }
    }
  </mj-style>
</mj-head>
```

### Example - Inlined CSS

```xml
<mj-head>
  <mj-style inline="inline">
    .bold-text {
      font-weight: bold;
    }
  </mj-style>
</mj-head>
```

### Notes

- Standard `mj-style` adds CSS to the `<head>` of the HTML output
- `inline="inline"` inlines styles directly onto matching elements
- Use `!important` for styles that need to override inline styles
- Media queries only work in standard (non-inlined) styles
- Apply CSS classes via the `css-class` attribute on components

---

## mj-title

Sets the HTML document title and ARIA label.

### Attributes

None - content is the title text.

### Example

```xml
<mj-head>
  <mj-title>Order Confirmation - Your Company</mj-title>
</mj-head>
```

### Notes

- Sets the `<title>` tag in the HTML output
- Some email clients display this in the tab/window title
- Also used as the `aria-label` on the wrapper div for accessibility
- Keep it descriptive but concise

---

## mj-include

Includes external MJML, CSS, or HTML files during compilation.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `path` | string | none | Path to the file to include |
| `type` | string | `mjml` | `mjml`, `css`, `html` |
| `css-inline` | string | none | Set to `"inline"` to inline CSS |

### Example - MJML Include

```xml
<!-- header.mjml -->
<mj-section>
  <mj-column>
    <mj-image src="logo.png" width="200px" />
  </mj-column>
</mj-section>

<!-- main.mjml -->
<mjml>
  <mj-body>
    <mj-include path="./header.mjml" />
    <mj-section>
      <mj-column>
        <mj-text>Main content</mj-text>
      </mj-column>
    </mj-section>
    <mj-include path="./footer.mjml" />
  </mj-body>
</mjml>
```

### Example - CSS Include

```xml
<mj-head>
  <mj-include path="./styles.css" type="css" />
  <mj-include path="./inline-styles.css" type="css" css-inline="inline" />
</mj-head>
```

### Example - HTML Include

```xml
<mj-section>
  <mj-column>
    <mj-include path="./tracking-pixel.html" type="html" />
  </mj-column>
</mj-section>
```

### Notes

- Paths are relative to the including file
- MJML includes are processed before rendering
- Included MJML can be wrapped in `<mjml><mj-body>...</mj-body></mjml>` for standalone preview
- CSS includes work like `mj-style`
- HTML includes work like `mj-raw`
- Only works with file-based compilation (not browser)
