import * as React from 'react';
/**
 * Person or org avatar — image, mono initials, or fallback. Circle or soft rounded square.
 * @startingPoint section="Primitives" subtitle="Image, initials, fallback" viewport="600x160"
 */
export interface AvatarProps {
  src?: string;
  /** Used for initials and title */
  name?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  /** circle = full round · square = soft rounded-rect (--radius-md) */
  shape?: 'circle' | 'square';
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
