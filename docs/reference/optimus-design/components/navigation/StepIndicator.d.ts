import * as React from 'react';
/**
 * Numbered steps with hairline connectors. Roman numerals by default; ✓ complete, ink ring current, molten ! error.
 * @startingPoint section="Navigation" subtitle="Multi-step progress" viewport="800x260"
 */
export interface StepIndicatorProps {
  steps: Array<{ label: React.ReactNode; description?: React.ReactNode; status?: 'complete' | 'current' | 'upcoming' | 'error' }>;
  /** 0-based */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  numerals?: 'roman' | 'arabic';
  /** Makes completed steps clickable */
  onStepClick?: (index: number) => void;
  style?: React.CSSProperties;
}
export declare function StepIndicator(props: StepIndicatorProps): JSX.Element;
