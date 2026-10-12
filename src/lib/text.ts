import { isValidElement, type ReactNode } from "react";

/**
 * The plain text of a ReactNode, for places that need a string: an `aria-label`, an
 * announcement, a footer word. Elements contribute their children's text; booleans and null
 * contribute nothing. `<>Run <b>42</b></>` → "Run 42".
 */
export function nodeText(node: ReactNode): string {
	if (node == null || typeof node === "boolean") return "";
	if (typeof node === "string" || typeof node === "number" || typeof node === "bigint")
		return String(node);
	if (Array.isArray(node)) return node.map(nodeText).join("");
	if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
	return "";
}
