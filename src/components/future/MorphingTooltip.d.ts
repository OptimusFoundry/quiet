import * as React from 'react';
/**
 * One tooltip shared by a group of triggers. Moving between triggers glides it to the new anchor
 * and resizes it, and the content slides in from the side you moved toward, so dense headers
 * read as one surface. Opens on hover and keyboard focus, stays while the pointer is over it,
 * closes on Escape. Reduced motion keeps only the fade.
 * @startingPoint section="Future" subtitle="One tooltip that travels" viewport="720x320"
 */
export interface MorphingTooltipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ms to wait after leaving a trigger before hiding, so moving between triggers morphs instead of reopening */
  hideDelay?: number;
  /** Which side of the trigger the tooltip sits on */
  placement?: 'top' | 'bottom';
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}
export declare function MorphingTooltipGroup(props: MorphingTooltipGroupProps): JSX.Element;

export interface MorphingTooltipTriggerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content' | 'id'> {
  /** Stable key for this trigger within the group; defaults to a generated id */
  id?: string;
  /** What the shared tooltip shows for this trigger */
  content: React.ReactNode;
  /** Plain text gets a tab stop; a button, link or field child is the trigger and is described directly */
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
}
export declare function MorphingTooltipTrigger(props: MorphingTooltipTriggerProps): JSX.Element;
