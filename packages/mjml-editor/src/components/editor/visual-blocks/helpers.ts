/**
 * Parses a CSS padding shorthand into individual values.
 * Supports 1, 2, 3, or 4 value syntax.
 */
function parsePadding(padding: string): {
  top: string;
  right: string;
  bottom: string;
  left: string;
} {
  const parts = padding.trim().split(/\s+/);
  switch (parts.length) {
    case 1:
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    case 2:
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    case 3:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    case 4:
    default:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  }
}

/**
 * Builds a CSS padding value from MJML attributes.
 *
 * MJML behavior: Individual padding attributes (padding-top, padding-right,
 * padding-bottom, padding-left) override specific sides of the base padding.
 * The base padding comes from the unified `padding` attribute or the default.
 *
 * @param attrs - The node's attributes object
 * @param defaultPadding - Default padding when no padding attributes are set
 * @returns CSS padding string
 */
export function buildPadding(
  attrs: Record<string, string>,
  defaultPadding: string = '0'
): string {
  const paddingTop = attrs['padding-top'];
  const paddingRight = attrs['padding-right'];
  const paddingBottom = attrs['padding-bottom'];
  const paddingLeft = attrs['padding-left'];

  // Check if any individual padding values are set
  const hasIndividualPadding =
    paddingTop !== undefined ||
    paddingRight !== undefined ||
    paddingBottom !== undefined ||
    paddingLeft !== undefined;

  if (hasIndividualPadding) {
    // Parse the base padding (unified padding or default)
    const basePadding = attrs['padding'] || defaultPadding;
    const base = parsePadding(basePadding);

    // Individual values override the base
    const top = paddingTop ?? base.top;
    const right = paddingRight ?? base.right;
    const bottom = paddingBottom ?? base.bottom;
    const left = paddingLeft ?? base.left;
    return `${top} ${right} ${bottom} ${left}`;
  }

  // Fall back to unified padding attribute or default
  return attrs['padding'] || defaultPadding;
}
