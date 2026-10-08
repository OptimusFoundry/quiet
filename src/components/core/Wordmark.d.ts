import * as React from 'react';
/** The typeset wordmark. The O·F mark is NOT included — supply FoundryMark.svg and place it to the left. */
export interface WordmarkProps {
  /** nav = 15px, footer = 28px, or a number */
  size?: 'nav' | 'footer' | number;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Wordmark(props: WordmarkProps): JSX.Element;
