# MJML Body Components Reference

Complete specification for all MJML body components.

---

## mj-section

Sections are the primary row containers in MJML. They contain columns and define horizontal layout regions.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `background-color` | color | none | Section background color |
| `background-url` | url | none | URL of background image |
| `background-repeat` | string | `repeat` | `repeat`, `no-repeat` |
| `background-size` | string | `auto` | `auto`, `cover`, `contain`, or dimensions |
| `background-position` | string | `top center` | CSS background-position |
| `background-position-x` | string | none | Horizontal position |
| `background-position-y` | string | none | Vertical position |
| `border` | string | none | CSS border shorthand |
| `border-radius` | px | none | Border radius |
| `direction` | string | `ltr` | `ltr`, `rtl` |
| `full-width` | string | none | `full-width` for edge-to-edge background |
| `padding` | px | `20px 0` | Section padding |
| `padding-top` | px | none | Top padding |
| `padding-right` | px | none | Right padding |
| `padding-bottom` | px | none | Bottom padding |
| `padding-left` | px | none | Left padding |
| `text-align` | string | `center` | `left`, `center`, `right` |
| `css-class` | string | none | CSS class for styling |

### Example

```xml
<mj-section background-color="#f4f4f4" padding="20px">
  <mj-column>
    <mj-text>Content here</mj-text>
  </mj-column>
</mj-section>
```

---

## mj-column

Columns are responsive containers within sections. They stack vertically on mobile.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | px/% | auto | Column width |
| `background-color` | color | none | Column background |
| `inner-background-color` | color | none | Inner background color |
| `border` | string | none | CSS border shorthand |
| `border-radius` | px | none | Border radius |
| `inner-border` | string | none | Inner border |
| `inner-border-radius` | px | none | Inner border radius |
| `padding` | px | none | Column padding |
| `padding-top` | px | none | Top padding |
| `padding-right` | px | none | Right padding |
| `padding-bottom` | px | none | Bottom padding |
| `padding-left` | px | none | Left padding |
| `vertical-align` | string | `top` | `top`, `middle`, `bottom` |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-section>
  <mj-column width="60%" background-color="#ffffff" padding="10px">
    <mj-text>Main content</mj-text>
  </mj-column>
  <mj-column width="40%">
    <mj-image src="sidebar.jpg" />
  </mj-column>
</mj-section>
```

---

## mj-group

Prevents columns from stacking on mobile. Columns inside a group stay side-by-side.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | px/% | `100%` | Group width |
| `background-color` | color | none | Background color |
| `direction` | string | `ltr` | `ltr`, `rtl` |
| `vertical-align` | string | `top` | `top`, `middle`, `bottom` |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-section>
  <mj-group>
    <mj-column width="50%">
      <mj-text>Left (won't stack)</mj-text>
    </mj-column>
    <mj-column width="50%">
      <mj-text>Right (won't stack)</mj-text>
    </mj-column>
  </mj-group>
</mj-section>
```

---

## mj-wrapper

Wraps multiple sections together, enabling shared backgrounds and borders.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `background-color` | color | none | Wrapper background |
| `background-url` | url | none | Background image URL |
| `background-repeat` | string | `repeat` | `repeat`, `no-repeat` |
| `background-size` | string | `auto` | `auto`, `cover`, `contain` |
| `background-position` | string | `top center` | CSS background-position |
| `border` | string | none | CSS border |
| `border-radius` | px | none | Border radius |
| `full-width` | string | none | `full-width` for edge-to-edge |
| `padding` | px | `20px 0` | Wrapper padding |
| `text-align` | string | `center` | Text alignment |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-wrapper background-color="#ffffff" border-radius="8px" padding="20px">
  <mj-section>
    <mj-column><mj-text>Section 1</mj-text></mj-column>
  </mj-section>
  <mj-section>
    <mj-column><mj-text>Section 2</mj-text></mj-column>
  </mj-section>
</mj-wrapper>
```

---

## mj-text

Displays styled text content. Supports inline HTML.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | color | `#000000` | Text color |
| `font-family` | string | `Ubuntu, Helvetica, Arial, sans-serif` | Font family |
| `font-size` | px | `13px` | Font size |
| `font-style` | string | none | `normal`, `italic`, `oblique` |
| `font-weight` | string | none | `normal`, `bold`, or numeric |
| `line-height` | px/% | `1` | Line height |
| `letter-spacing` | px/em | none | Letter spacing |
| `text-decoration` | string | none | `underline`, `overline`, `line-through` |
| `text-transform` | string | none | `uppercase`, `lowercase`, `capitalize` |
| `align` | string | `left` | `left`, `center`, `right`, `justify` |
| `padding` | px | `10px 25px` | Text padding |
| `padding-top` | px | none | Top padding |
| `padding-right` | px | none | Right padding |
| `padding-bottom` | px | none | Bottom padding |
| `padding-left` | px | none | Left padding |
| `height` | px | none | Fixed height |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-text color="#333333" font-size="16px" line-height="1.5" align="center">
  <h1>Welcome!</h1>
  <p>Thanks for signing up. We're excited to have you.</p>
</mj-text>
```

---

## mj-image

Displays a responsive image.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | url | none | Image source URL (required) |
| `alt` | string | none | Alt text for accessibility |
| `title` | string | none | Image title |
| `width` | px | `100%` | Image width |
| `height` | px | `auto` | Image height |
| `href` | url | none | Link URL when clicked |
| `rel` | string | none | Link rel attribute |
| `target` | string | `_blank` | Link target |
| `align` | string | `center` | `left`, `center`, `right` |
| `border` | string | `0` | CSS border |
| `border-radius` | px | none | Border radius |
| `fluid-on-mobile` | string | none | `true` to be full-width on mobile |
| `padding` | px | `10px 25px` | Image padding |
| `padding-top` | px | none | Top padding |
| `padding-right` | px | none | Right padding |
| `padding-bottom` | px | none | Bottom padding |
| `padding-left` | px | none | Left padding |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-image src="https://example.com/hero.jpg"
          alt="Hero image"
          width="600px"
          href="https://example.com"
          border-radius="8px" />
```

---

## mj-button

Displays a clickable button.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | url | none | Button link URL |
| `rel` | string | none | Link rel attribute |
| `target` | string | `_blank` | Link target |
| `background-color` | color | `#414141` | Button background |
| `color` | color | `#ffffff` | Text color |
| `font-family` | string | `Ubuntu, Helvetica, Arial, sans-serif` | Font family |
| `font-size` | px | `13px` | Font size |
| `font-style` | string | none | `normal`, `italic` |
| `font-weight` | string | `normal` | Font weight |
| `line-height` | string | `120%` | Line height |
| `letter-spacing` | px/em | none | Letter spacing |
| `text-decoration` | string | none | Text decoration |
| `text-transform` | string | none | Text transform |
| `align` | string | `center` | `left`, `center`, `right` |
| `vertical-align` | string | `middle` | Vertical alignment |
| `border` | string | none | CSS border |
| `border-radius` | px | `3px` | Border radius |
| `border-top` | string | none | Top border |
| `border-right` | string | none | Right border |
| `border-bottom` | string | none | Bottom border |
| `border-left` | string | none | Left border |
| `inner-padding` | px | `10px 25px` | Padding inside button |
| `padding` | px | `10px 25px` | Padding around button |
| `padding-top` | px | none | Top padding |
| `padding-right` | px | none | Right padding |
| `padding-bottom` | px | none | Bottom padding |
| `padding-left` | px | none | Left padding |
| `width` | px | none | Fixed button width |
| `height` | px | none | Button height |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-button href="https://example.com/signup"
           background-color="#4A90D9"
           color="#ffffff"
           font-size="16px"
           border-radius="25px"
           inner-padding="15px 30px">
  Sign Up Now
</mj-button>
```

---

## mj-divider

Displays a horizontal divider line.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `border-color` | color | `#000000` | Line color |
| `border-style` | string | `solid` | `solid`, `dashed`, `dotted` |
| `border-width` | px | `4px` | Line thickness |
| `width` | px/% | `100%` | Divider width |
| `align` | string | `center` | `left`, `center`, `right` |
| `padding` | px | `10px 25px` | Divider padding |
| `padding-top` | px | none | Top padding |
| `padding-right` | px | none | Right padding |
| `padding-bottom` | px | none | Bottom padding |
| `padding-left` | px | none | Left padding |
| `container-background-color` | color | none | Container background |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-divider border-color="#E0E0E0" border-width="1px" width="80%" />
```

---

## mj-spacer

Creates vertical whitespace.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `height` | px | `20px` | Spacer height |
| `padding` | px | none | Additional padding |
| `padding-top` | px | none | Top padding |
| `padding-right` | px | none | Right padding |
| `padding-bottom` | px | none | Bottom padding |
| `padding-left` | px | none | Left padding |
| `container-background-color` | color | none | Background color |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-spacer height="40px" />
```

---

## mj-social

Displays social media icons with optional labels.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode` | string | `horizontal` | `horizontal`, `vertical` |
| `align` | string | `center` | `left`, `center`, `right` |
| `icon-size` | px | `20px` | Icon size |
| `icon-height` | px | none | Icon height |
| `icon-padding` | px | `0px` | Icon padding |
| `text-padding` | px | `4px 4px 4px 0` | Text padding |
| `font-family` | string | `Ubuntu, Helvetica, Arial, sans-serif` | Font family |
| `font-size` | px | `13px` | Font size |
| `font-style` | string | none | Font style |
| `font-weight` | string | none | Font weight |
| `line-height` | string | `22px` | Line height |
| `text-decoration` | string | none | Text decoration |
| `color` | color | `#000000` | Text color |
| `inner-padding` | px | none | Inner padding |
| `padding` | px | `10px 25px` | Container padding |
| `border-radius` | px | `3px` | Icon border radius |
| `container-background-color` | color | none | Background color |
| `css-class` | string | none | CSS class |

### mj-social-element

Child component for individual social icons.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | none | Social network name (see list below) |
| `href` | url | none | Link URL |
| `src` | url | none | Custom icon URL |
| `alt` | string | none | Icon alt text |
| `title` | string | none | Icon title |
| `target` | string | `_blank` | Link target |
| `icon-size` | px | none | Override icon size |
| `icon-height` | px | none | Override icon height |
| `icon-padding` | px | none | Override icon padding |
| `text-padding` | px | none | Override text padding |
| `background-color` | color | none | Icon background |
| `font-family` | string | none | Override font |
| `font-size` | px | none | Override font size |
| `font-style` | string | none | Override font style |
| `font-weight` | string | none | Override font weight |
| `line-height` | string | none | Override line height |
| `text-decoration` | string | none | Override text decoration |
| `color` | color | none | Override text color |
| `border-radius` | px | none | Override border radius |
| `padding` | px | `4px` | Element padding |
| `vertical-align` | string | `middle` | Vertical alignment |
| `css-class` | string | none | CSS class |

**Built-in social networks:** `facebook`, `twitter`, `x`, `google`, `instagram`, `linkedin`, `pinterest`, `tumblr`, `youtube`, `github`, `dribbble`, `snapchat`, `vimeo`, `medium`, `soundcloud`, `web`, `xing`

Each network can have `-noshare` suffix for icon-only (no share URL).

### Example

```xml
<mj-social font-size="15px" icon-size="30px" mode="horizontal">
  <mj-social-element name="facebook" href="https://facebook.com/yourpage">
    Facebook
  </mj-social-element>
  <mj-social-element name="twitter" href="https://twitter.com/yourhandle">
    Twitter
  </mj-social-element>
  <mj-social-element name="instagram" href="https://instagram.com/yourhandle">
    Instagram
  </mj-social-element>
</mj-social>
```

---

## mj-navbar

Displays a navigation menu, with optional hamburger mode on mobile.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `base-url` | url | none | Base URL for relative links |
| `hamburger` | string | none | `hamburger` to enable mobile menu |
| `align` | string | `center` | `left`, `center`, `right` |
| `ico-open` | string | `&#9776;` | Open icon character |
| `ico-close` | string | `&#8855;` | Close icon character |
| `ico-color` | color | `#000000` | Icon color |
| `ico-font-size` | px | `30px` | Icon font size |
| `ico-font-family` | string | `Ubuntu, Helvetica, Arial, sans-serif` | Icon font |
| `ico-text-decoration` | string | none | Icon text decoration |
| `ico-text-transform` | string | none | Icon text transform |
| `ico-padding` | px | `10px` | Icon padding |
| `ico-align` | string | `center` | Icon alignment |
| `ico-line-height` | string | `30px` | Icon line height |
| `css-class` | string | none | CSS class |

### mj-navbar-link

Child component for navigation links.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | url | none | Link URL |
| `rel` | string | none | Link rel attribute |
| `target` | string | `_blank` | Link target |
| `color` | color | `#000000` | Link color |
| `font-family` | string | `Ubuntu, Helvetica, Arial, sans-serif` | Font family |
| `font-size` | px | `13px` | Font size |
| `font-style` | string | none | Font style |
| `font-weight` | string | none | Font weight |
| `line-height` | string | `22px` | Line height |
| `letter-spacing` | px/em | none | Letter spacing |
| `text-decoration` | string | none | Text decoration |
| `text-transform` | string | none | Text transform |
| `padding` | px | `15px 10px` | Link padding |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-navbar base-url="https://example.com" hamburger="hamburger">
  <mj-navbar-link href="/products">Products</mj-navbar-link>
  <mj-navbar-link href="/about">About</mj-navbar-link>
  <mj-navbar-link href="/contact">Contact</mj-navbar-link>
</mj-navbar>
```

---

## mj-table

Displays an HTML table. Content must be raw HTML table rows.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | px/% | `100%` | Table width |
| `align` | string | `left` | `left`, `center`, `right` |
| `color` | color | `#000000` | Text color |
| `font-family` | string | `Ubuntu, Helvetica, Arial, sans-serif` | Font family |
| `font-size` | px | `13px` | Font size |
| `line-height` | string | `22px` | Line height |
| `cellpadding` | integer | `0` | Cell padding |
| `cellspacing` | integer | `0` | Cell spacing |
| `border` | string | none | CSS border |
| `table-layout` | string | `auto` | `auto`, `fixed` |
| `padding` | px | `10px 25px` | Table padding |
| `container-background-color` | color | none | Background color |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-table>
  <tr style="border-bottom: 1px solid #ccc;">
    <th style="padding: 10px;">Item</th>
    <th style="padding: 10px;">Price</th>
  </tr>
  <tr>
    <td style="padding: 10px;">Product A</td>
    <td style="padding: 10px;">$29.99</td>
  </tr>
</mj-table>
```

---

## mj-raw

Inserts raw HTML that bypasses MJML processing.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `position` | string | none | `file-start` to place at document start |

### Example

```xml
<mj-raw>
  <!-- Custom HTML comment -->
  <div style="display: none;">Tracking pixel placeholder</div>
</mj-raw>
```

---

## mj-hero

Displays a hero section with background image. Behaves like a section with a single column.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode` | string | `fluid-height` | `fluid-height`, `fixed-height` |
| `height` | px | none | Height (required for fixed-height) |
| `width` | px | `100%` | Hero width |
| `background-url` | url | none | Background image URL |
| `background-color` | color | `#ffffff` | Background color |
| `background-width` | px | none | Background image width |
| `background-height` | px | none | Background image height |
| `background-position` | string | `center center` | Background position |
| `vertical-align` | string | `top` | Content vertical alignment |
| `padding` | px | `0px` | Hero padding |
| `padding-top` | px | none | Top padding |
| `padding-right` | px | none | Right padding |
| `padding-bottom` | px | none | Bottom padding |
| `padding-left` | px | none | Left padding |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-hero mode="fixed-height"
         height="400px"
         background-url="https://example.com/hero-bg.jpg"
         background-width="600px"
         background-height="400px"
         background-position="center center"
         vertical-align="middle">
  <mj-text color="#ffffff" font-size="32px" align="center">
    Welcome to Our Site
  </mj-text>
  <mj-button href="https://example.com">Learn More</mj-button>
</mj-hero>
```

---

## mj-accordion

Creates expandable/collapsible content sections.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `border` | string | `2px solid black` | Accordion border |
| `icon-position` | string | `right` | `left`, `right` |
| `icon-height` | px | `32px` | Icon height |
| `icon-width` | px | `32px` | Icon width |
| `icon-align` | string | `middle` | Icon vertical alignment |
| `icon-wrapped-url` | url | none | Collapsed state icon |
| `icon-wrapped-alt` | string | `+` | Collapsed icon alt text |
| `icon-unwrapped-url` | url | none | Expanded state icon |
| `icon-unwrapped-alt` | string | `-` | Expanded icon alt text |
| `font-family` | string | `Ubuntu, Helvetica, Arial, sans-serif` | Font family |
| `padding` | px | `10px 25px` | Accordion padding |
| `container-background-color` | color | none | Background color |
| `css-class` | string | none | CSS class |

### mj-accordion-element

Container for each accordion item.

### mj-accordion-title

Title/header for an accordion item.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `background-color` | color | `#fafafa` | Title background |
| `color` | color | `#000000` | Title text color |
| `font-family` | string | `Ubuntu, Helvetica, Arial, sans-serif` | Font family |
| `font-size` | px | `13px` | Font size |
| `padding` | px | `16px` | Title padding |
| `css-class` | string | none | CSS class |

### mj-accordion-text

Content body for an accordion item.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `background-color` | color | `#ffffff` | Content background |
| `color` | color | `#000000` | Content text color |
| `font-family` | string | `Ubuntu, Helvetica, Arial, sans-serif` | Font family |
| `font-size` | px | `13px` | Font size |
| `line-height` | string | `1` | Line height |
| `padding` | px | `16px` | Content padding |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-accordion border="none" icon-position="right">
  <mj-accordion-element>
    <mj-accordion-title font-size="14px" background-color="#f0f0f0">
      What is MJML?
    </mj-accordion-title>
    <mj-accordion-text font-size="13px" padding="16px">
      MJML is a markup language designed for responsive emails.
    </mj-accordion-text>
  </mj-accordion-element>
  <mj-accordion-element>
    <mj-accordion-title font-size="14px" background-color="#f0f0f0">
      How does it work?
    </mj-accordion-title>
    <mj-accordion-text font-size="13px" padding="16px">
      MJML compiles to responsive HTML that works across email clients.
    </mj-accordion-text>
  </mj-accordion-element>
</mj-accordion>
```

---

## mj-carousel

Displays an interactive image carousel with thumbnails.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `align` | string | `center` | Carousel alignment |
| `icon-width` | px | `44px` | Navigation icon width |
| `border-radius` | px | none | Image border radius |
| `thumbnails` | string | `visible` | `visible`, `hidden` |
| `tb-border` | string | `2px solid transparent` | Thumbnail border |
| `tb-border-radius` | px | none | Thumbnail border radius |
| `tb-hover-border-color` | color | none | Thumbnail hover border |
| `tb-selected-border-color` | color | none | Selected thumbnail border |
| `tb-width` | px | none | Thumbnail width |
| `left-icon` | url | none | Left arrow icon URL |
| `right-icon` | url | none | Right arrow icon URL |
| `css-class` | string | none | CSS class |

### mj-carousel-image

Individual carousel image.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | url | none | Image source URL |
| `alt` | string | none | Image alt text |
| `title` | string | none | Image title |
| `href` | url | none | Link URL |
| `rel` | string | none | Link rel attribute |
| `target` | string | `_blank` | Link target |
| `thumbnails-src` | url | none | Separate thumbnail image |
| `border-radius` | px | none | Image border radius |
| `css-class` | string | none | CSS class |

### Example

```xml
<mj-carousel thumbnails="visible">
  <mj-carousel-image src="https://example.com/img1.jpg" alt="Image 1" />
  <mj-carousel-image src="https://example.com/img2.jpg" alt="Image 2" />
  <mj-carousel-image src="https://example.com/img3.jpg" alt="Image 3" />
</mj-carousel>
```

**Note:** Carousel interactivity depends on email client support. Falls back gracefully.
