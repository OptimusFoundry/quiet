import * as React from 'react';
/**
 * Side sheet. Full height, rounded inner corners (--radius-xl), soft shadow, slow ease-in-out slide.
 * @startingPoint section="Overlays" subtitle="Side sheets" viewport="900x560"
 */
export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  accent?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | number;
  dismissible?: boolean;
}
export declare function Drawer(props: DrawerProps): JSX.Element;
