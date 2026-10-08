import * as React from 'react';
/**
 * Hairline-separated disclosure list. + rotates to × ; content eases open.
 * @startingPoint section="Display" subtitle="Disclosure list" viewport="800x420"
 */
export interface AccordionProps {
  items: Array<{ id?: string | number; title: React.ReactNode; description?: React.ReactNode; content: React.ReactNode; icon?: React.ReactNode; disabled?: boolean }>;
  /** Allow several open at once */
  multiple?: boolean;
  defaultExpanded?: Array<string | number>;
  expanded?: Array<string | number>;
  onChange?: (expanded: Array<string | number>) => void;
  style?: React.CSSProperties;
}
export declare function Accordion(props: AccordionProps): JSX.Element;
