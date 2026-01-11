/**
 * CSS scoping utility for the visual editor.
 *
 * Scopes CSS selectors by prefixing them with a container class
 * to prevent styles from leaking to the parent page.
 */

/**
 * Scope CSS selectors by prefixing them with a container class.
 *
 * For example:
 *   .button-primary { color: red; }
 * becomes:
 *   .mjml-visual-editor-scope .button-primary { color: red; }
 *
 * This also handles:
 * - Descendant selectors: .fd-accountid p { } -> .scope .fd-accountid p { }
 * - Multiple selectors: .a, .b { } -> .scope .a, .scope .b { }
 * - Media queries: preserved with scoped inner rules
 */
export function scopeCSS(css: string, scopeClass: string): string {
  // Handle empty or whitespace-only input
  if (!css || !css.trim()) {
    return '';
  }

  const scopePrefix = `.${scopeClass}`;
  let result = '';
  let i = 0;

  while (i < css.length) {
    // Skip whitespace
    while (i < css.length && /\s/.test(css[i])) {
      result += css[i];
      i++;
    }

    if (i >= css.length) break;

    // Check for @-rules
    if (css[i] === '@') {
      const atRuleMatch = css.slice(i).match(/^@[\w-]+/);
      if (atRuleMatch) {
        const atRule = atRuleMatch[0];

        // Handle @media and other block @-rules
        if (atRule === '@media' || atRule === '@supports' || atRule === '@layer') {
          // Find the opening brace
          let braceStart = css.indexOf('{', i);
          if (braceStart === -1) {
            // Malformed CSS, just output the rest
            result += css.slice(i);
            break;
          }

          // Output the @-rule prelude
          result += css.slice(i, braceStart + 1);
          i = braceStart + 1;

          // Find matching closing brace
          let braceCount = 1;
          let innerStart = i;

          while (i < css.length && braceCount > 0) {
            if (css[i] === '{') braceCount++;
            else if (css[i] === '}') braceCount--;
            i++;
          }

          // Recursively scope the inner content
          const innerContent = css.slice(innerStart, i - 1);
          result += scopeCSS(innerContent, scopeClass);
          result += '}';
          continue;
        }

        // Handle @keyframes - don't scope inner selectors
        if (atRule === '@keyframes' || atRule === '@-webkit-keyframes') {
          let braceStart = css.indexOf('{', i);
          if (braceStart === -1) {
            result += css.slice(i);
            break;
          }

          let braceCount = 1;
          let j = braceStart + 1;

          while (j < css.length && braceCount > 0) {
            if (css[j] === '{') braceCount++;
            else if (css[j] === '}') braceCount--;
            j++;
          }

          result += css.slice(i, j);
          i = j;
          continue;
        }

        // Other @-rules (like @charset, @import) - output as-is
        const semicolonIndex = css.indexOf(';', i);
        const braceIndex = css.indexOf('{', i);

        if (semicolonIndex !== -1 && (braceIndex === -1 || semicolonIndex < braceIndex)) {
          result += css.slice(i, semicolonIndex + 1);
          i = semicolonIndex + 1;
          continue;
        }
      }
    }

    // Parse a rule: selector { declarations }
    const braceIndex = css.indexOf('{', i);
    if (braceIndex === -1) {
      // No more rules, output remaining content
      result += css.slice(i);
      break;
    }

    // Get selectors
    const selectors = css.slice(i, braceIndex).trim();

    // Find the closing brace
    let braceCount = 1;
    let j = braceIndex + 1;

    while (j < css.length && braceCount > 0) {
      if (css[j] === '{') braceCount++;
      else if (css[j] === '}') braceCount--;
      j++;
    }

    const declarations = css.slice(braceIndex + 1, j - 1);

    // Scope each selector
    const scopedSelectors = selectors
      .split(',')
      .map((s) => {
        const trimmed = s.trim();
        if (!trimmed) return '';
        // Don't scope if it's just whitespace or empty
        return `${scopePrefix} ${trimmed}`;
      })
      .filter((s) => s)
      .join(', ');

    if (scopedSelectors) {
      result += `${scopedSelectors} {${declarations}}`;
    }

    i = j;
  }

  return result;
}
