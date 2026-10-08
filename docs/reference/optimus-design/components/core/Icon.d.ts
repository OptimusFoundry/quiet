import * as React from 'react';
/**
 * Unicode glyph icon. The brand has no icon set — glyphs carry meaning (→ ↘ ↗ × ✓ · …).
 * @startingPoint section="Primitives" subtitle="Named unicode glyphs" viewport="600x160"
 */
export interface IconProps {
  /** Named glyph: arrow-right, arrow-left, arrow-up, arrow-down, expand, external, close, check, plus, minus, dot, more, slash, command, enter, info, warning, help, first, last, sort, prev, next */
  name?: string;
  /** Any literal glyph; overrides name */
  glyph?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  color?: 'inherit' | 'default' | 'muted' | 'quiet' | 'primary' | 'success' | 'warning' | 'error' | string;
  /** Accessible label; omit for decorative glyphs */
  label?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
