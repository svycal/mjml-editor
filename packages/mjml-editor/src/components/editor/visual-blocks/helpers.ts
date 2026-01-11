/**
 * Builds a CSS padding value from MJML attributes.
 *
 * MJML behavior: When any individual padding attribute is set (padding-top,
 * padding-right, padding-bottom, padding-left), those values take precedence
 * and any unset individual values default to "0". If no individual values
 * are set, the unified `padding` attribute is used.
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
    // When any individual value is set, use individual values (defaulting to 0)
    const top = paddingTop || '0';
    const right = paddingRight || '0';
    const bottom = paddingBottom || '0';
    const left = paddingLeft || '0';
    return `${top} ${right} ${bottom} ${left}`;
  }

  // Fall back to unified padding attribute or default
  return attrs['padding'] || defaultPadding;
}
