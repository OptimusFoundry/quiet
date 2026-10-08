import * as React from 'react';
export interface PromptSuggestion {
  label: string;
  /** What gets sent (default: the label) */
  prompt?: string;
  /** A second line, shown in the grid layout */
  description?: string;
}
/**
 * Starters for an empty thread. One tab stop: arrows, Home and End move between them; Enter or Space
 * picks one.
 */
export interface PromptSuggestionsProps {
  suggestions?: (string | PromptSuggestion)[];
  onSelect?: (prompt: string, suggestion: PromptSuggestion) => void;
  /** Accessible name of the group (default "Suggested prompts") */
  label?: string;
  /** Pills that wrap, or two-up cards with a description */
  layout?: 'wrap' | 'grid';
  className?: string;
  style?: React.CSSProperties;
}
export declare function PromptSuggestions(props: PromptSuggestionsProps): JSX.Element;
