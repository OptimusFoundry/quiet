// The reference .d.ts files use the global JSX namespace, which React 19's types no longer
// declare. Re-expose React's so those files can stay byte-for-byte copies.
import type * as React from "react";

declare global {
	namespace JSX {
		type Element = React.JSX.Element;
		type IntrinsicElements = React.JSX.IntrinsicElements;
	}
}
