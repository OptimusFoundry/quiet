import type { ReactNode } from "react";
export function FuturePage(props: {
	title: string;
	intro: ReactNode;
	children?: ReactNode;
}): JSX.Element;
export function Concept(props: {
	id: string;
	index: number;
	name: string;
	from: ReactNode;
	idea: ReactNode;
	children?: ReactNode;
}): JSX.Element;
export function Spec(props: { label: string; col?: boolean; children?: ReactNode }): JSX.Element;
