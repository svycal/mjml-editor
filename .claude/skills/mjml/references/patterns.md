# MJML Layout Patterns & Best Practices

Common patterns and best practices for building responsive email templates with MJML.

---

## Document Structure

Every MJML document follows this structure:

```xml
<mjml>
  <mj-head>
    <!-- Configuration and styles -->
  </mj-head>
  <mj-body>
    <!-- Content sections -->
  </mj-body>
</mjml>
```

### Recommended Head Setup

```xml
<mj-head>
  <!-- Document metadata -->
  <mj-title>Email Subject Preview</mj-title>
  <mj-preview>Preview text shown in inbox...</mj-preview>

  <!-- Custom fonts (optional) -->
  <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto:400,700" />

  <!-- Default attributes and classes -->
  <mj-attributes>
    <mj-all font-family="Roboto, Helvetica, Arial, sans-serif" />
    <mj-text padding="10px 25px" font-size="14px" line-height="1.5" />
    <mj-button background-color="#4A90D9" border-radius="4px" font-size="14px" />
    <mj-class name="heading" font-size="24px" font-weight="bold" padding="20px 25px 10px" />
  </mj-attributes>

  <!-- Custom CSS -->
  <mj-style>
    .link a { color: #4A90D9; }
  </mj-style>
</mj-head>
```

---

## Column Layouts

### Single Column (Full Width)

```xml
<mj-section>
  <mj-column>
    <mj-text>Full-width content</mj-text>
  </mj-column>
</mj-section>
```

### Two Equal Columns

```xml
<mj-section>
  <mj-column>
    <mj-text>Left column</mj-text>
  </mj-column>
  <mj-column>
    <mj-text>Right column</mj-text>
  </mj-column>
</mj-section>
```

### Two Unequal Columns

```xml
<mj-section>
  <mj-column width="33%">
    <mj-image src="thumbnail.jpg" width="150px" />
  </mj-column>
  <mj-column width="67%">
    <mj-text>Description text with more space</mj-text>
  </mj-column>
</mj-section>
```

### Three Columns

```xml
<mj-section>
  <mj-column width="33.33%">
    <mj-image src="icon1.png" width="50px" />
    <mj-text align="center">Feature 1</mj-text>
  </mj-column>
  <mj-column width="33.33%">
    <mj-image src="icon2.png" width="50px" />
    <mj-text align="center">Feature 2</mj-text>
  </mj-column>
  <mj-column width="33.33%">
    <mj-image src="icon3.png" width="50px" />
    <mj-text align="center">Feature 3</mj-text>
  </mj-column>
</mj-section>
```

### Prevent Mobile Stacking

Use `mj-group` to keep columns side-by-side on mobile:

```xml
<mj-section>
  <mj-group>
    <mj-column width="50%">
      <mj-text>Stays left on mobile</mj-text>
    </mj-column>
    <mj-column width="50%">
      <mj-text>Stays right on mobile</mj-text>
    </mj-column>
  </mj-group>
</mj-section>
```

---

## Background Images

### Section with Background Image

```xml
<mj-section background-url="https://example.com/hero-bg.jpg"
            background-size="cover"
            background-repeat="no-repeat"
            background-position="center center"
            padding="60px 25px">
  <mj-column>
    <mj-text color="#ffffff" align="center" font-size="28px">
      Hero Headline
    </mj-text>
    <mj-button background-color="#ffffff" color="#333333">
      Call to Action
    </mj-button>
  </mj-column>
</mj-section>
```

### Full-Width Background

```xml
<mj-section full-width="full-width"
            background-color="#f4f4f4"
            padding="40px 0">
  <mj-column>
    <mj-text>Content with full-width gray background</mj-text>
  </mj-column>
</mj-section>
```

---

## Card Layouts

### Simple Card with Border

```xml
<mj-section padding="20px">
  <mj-column background-color="#ffffff"
             border-radius="8px"
             border="1px solid #e0e0e0"
             padding="20px">
    <mj-text font-size="18px" font-weight="bold">Card Title</mj-text>
    <mj-text>Card content goes here.</mj-text>
    <mj-button>Learn More</mj-button>
  </mj-column>
</mj-section>
```

### Card with Shadow Effect (using wrapper)

```xml
<mj-wrapper background-color="#f4f4f4" padding="20px">
  <mj-section background-color="#ffffff"
              border-radius="8px"
              padding="0">
    <mj-column padding="25px">
      <mj-text>Card content inside wrapper</mj-text>
    </mj-column>
  </mj-section>
</mj-wrapper>
```

### Multiple Cards in a Row

```xml
<mj-section>
  <mj-column background-color="#ffffff" border-radius="8px" padding="15px">
    <mj-image src="product1.jpg" border-radius="4px" />
    <mj-text font-weight="bold">Product 1</mj-text>
    <mj-text>$29.99</mj-text>
  </mj-column>
  <mj-column background-color="#ffffff" border-radius="8px" padding="15px">
    <mj-image src="product2.jpg" border-radius="4px" />
    <mj-text font-weight="bold">Product 2</mj-text>
    <mj-text>$39.99</mj-text>
  </mj-column>
</mj-section>
```

---

## Header Patterns

### Logo with Navigation

```xml
<mj-section background-color="#ffffff" padding="10px 0">
  <mj-column width="30%">
    <mj-image src="logo.png" width="120px" align="left" />
  </mj-column>
  <mj-column width="70%">
    <mj-navbar align="right">
      <mj-navbar-link href="/products">Products</mj-navbar-link>
      <mj-navbar-link href="/about">About</mj-navbar-link>
      <mj-navbar-link href="/contact">Contact</mj-navbar-link>
    </mj-navbar>
  </mj-column>
</mj-section>
```

### Centered Logo Header

```xml
<mj-section background-color="#333333" padding="20px">
  <mj-column>
    <mj-image src="logo-white.png" width="150px" align="center" />
  </mj-column>
</mj-section>
```

---

## Footer Patterns

### Standard Footer

```xml
<mj-section background-color="#333333" padding="30px">
  <mj-column>
    <mj-social mode="horizontal" icon-size="24px" align="center">
      <mj-social-element name="facebook" href="https://facebook.com/company" />
      <mj-social-element name="twitter" href="https://twitter.com/company" />
      <mj-social-element name="linkedin" href="https://linkedin.com/company/company" />
    </mj-social>
    <mj-divider border-color="#555555" border-width="1px" padding="20px 0" />
    <mj-text color="#888888" font-size="12px" align="center">
      &copy; 2024 Your Company. All rights reserved.<br />
      123 Main Street, City, State 12345
    </mj-text>
    <mj-text color="#888888" font-size="11px" align="center">
      <a href="{{unsubscribe}}" style="color: #888888;">Unsubscribe</a> |
      <a href="{{preferences}}" style="color: #888888;">Email Preferences</a> |
      <a href="{{privacy}}" style="color: #888888;">Privacy Policy</a>
    </mj-text>
  </mj-column>
</mj-section>
```

---

## Button Patterns

### Primary Button

```xml
<mj-button href="https://example.com"
           background-color="#4A90D9"
           color="#ffffff"
           font-size="16px"
           font-weight="bold"
           border-radius="4px"
           inner-padding="15px 30px">
  Get Started
</mj-button>
```

### Ghost/Outline Button

```xml
<mj-button href="https://example.com"
           background-color="transparent"
           color="#4A90D9"
           border="2px solid #4A90D9"
           border-radius="4px"
           inner-padding="12px 25px">
  Learn More
</mj-button>
```

### Pill Button

```xml
<mj-button href="https://example.com"
           background-color="#4A90D9"
           border-radius="50px"
           inner-padding="12px 35px">
  Subscribe
</mj-button>
```

### Side-by-Side Buttons

```xml
<mj-section>
  <mj-column width="50%">
    <mj-button align="right" background-color="#4A90D9">Accept</mj-button>
  </mj-column>
  <mj-column width="50%">
    <mj-button align="left" background-color="#888888">Decline</mj-button>
  </mj-column>
</mj-section>
```

---

## Email Client Compatibility

### Best Supported Features

- Basic text styling (color, font-size, font-family)
- Background colors
- Images
- Tables (via mj-table)
- Buttons (table-based)
- Padding and margins

### Limited Support Features

- Border-radius (not supported in Outlook)
- Background images (limited in Outlook)
- Web fonts (fallback to system fonts)
- CSS animations (ignored)
- Media queries (not in all clients)

### Outlook-Specific Considerations

1. **Background images**: Use VML fallbacks (MJML handles this)
2. **Border-radius**: Will render as square corners
3. **Padding**: May need explicit pixel values
4. **Line-height**: Use pixel values instead of unitless

### Gmail Considerations

1. **Font support**: Limited web font support
2. **Media queries**: Supported in Gmail app, not always in webmail
3. **CSS classes**: Some get stripped; use inline styles

---

## Responsive Design Tips

### Mobile-First Considerations

1. **Touch targets**: Buttons should be at least 44px tall
2. **Font sizes**: Minimum 14px for body text on mobile
3. **Line length**: Keep under 600px for readability
4. **Spacing**: Generous padding for touch interaction

### Controlling Mobile Behavior

```xml
<mj-head>
  <!-- Lower breakpoint = more desktop-like on tablets -->
  <mj-breakpoint width="400px" />

  <!-- Mobile-specific styles -->
  <mj-style>
    @media only screen and (max-width: 480px) {
      .hide-on-mobile { display: none !important; }
      .mobile-full-width { width: 100% !important; }
    }
  </mj-style>
</mj-head>
```

### Fluid Images on Mobile

```xml
<mj-image src="hero.jpg"
          width="600px"
          fluid-on-mobile="true" />
```

---

## Performance Tips

### Image Optimization

1. **Compress images**: Use tools like TinyPNG
2. **Proper dimensions**: Don't rely on HTML scaling
3. **Use appropriate formats**: JPEG for photos, PNG for graphics
4. **Host on CDN**: Fast, reliable image delivery

### Template Size

1. **Keep under 100KB**: Some clients clip large emails
2. **Minimize inline CSS**: Use classes and mj-attributes
3. **Avoid unnecessary nesting**: Simpler = smaller
4. **Remove unused sections**: Don't hide with CSS

### Testing

1. **Test across clients**: Litmus, Email on Acid, or manual
2. **Check rendering**: Desktop, mobile, dark mode
3. **Verify links**: All buttons and links work
4. **Preview text**: Shows correctly in inbox view
