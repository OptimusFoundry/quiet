import * as React from 'react';
/** Status indicator — the molten dot is one of molten's three permitted uses. */
export interface StatusDotProps {
  status?: 'live' | 'prototype' | 'archived';
  label?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function StatusDot(props: StatusDotProps): JSX.Element;
