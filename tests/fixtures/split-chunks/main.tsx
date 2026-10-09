// An app the way apps consume quiet: source from the package entry, a lazy route that shares
// components with the shell. The shared components become chunks whose CSS Vite links ahead of
// the entry CSS, so their stylesheets are the first to name quiet's layers.
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Button, QuietRoot } from "../../../src/index";

const Page = lazy(() => import("./Page"));

const root = document.getElementById("root");
if (root) {
	createRoot(root).render(
		<QuietRoot>
			<Button variant="secondary">Shell</Button>
			<Suspense>
				<Page />
			</Suspense>
		</QuietRoot>,
	);
}
