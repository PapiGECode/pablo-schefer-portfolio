/**
 * Global, static dot texture.
 *
 * This intentionally stays a CSS layer instead of a canvas animation so it
 * remains crisp and inexpensive on every route and device.
 */
export function AmbientField() {
  return <div className="ambient-field" aria-hidden="true" />
}
