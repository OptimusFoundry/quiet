import * as React from 'react';
/**
 * Mono caps pill for stacks, categories and filters. Removable and selectable.
 * @startingPoint section="Primitives" subtitle="Mono pills — removable, selectable" viewport="700x180"
 */
export interface TagProps {
  children?: React.ReactNode;
  tone?: 'default' | 'ink';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  /** Small Avatar (size 'xs') rendered flush left */
  avatar?: React.ReactNode;
  /** Shows a × that calls this */
  onRemove?: () => void;
  /** Toggle chip; selected = ink fill */
  selectable?: boolean;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
