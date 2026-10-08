// Layout for the Future stories: the catalog's numbered Block + Spec rows, plus the concept's
// lineage ("Evolved from") and idea, as in the Claude Design "Future Components" pages.
const mono = {
	fontFamily: "var(--q-font-mono)",
	fontSize: "var(--q-text-3xs)",
	letterSpacing: "var(--q-tracking-mono)",
	textTransform: "uppercase",
	color: "var(--q-fg-muted)",
};

export function FuturePage({ title, intro, children }) {
	return (
		<main
			style={{
				maxWidth: 1120,
				margin: "0 auto",
				padding: "var(--q-space-8) var(--q-space-page-x) var(--q-space-16)",
				background: "var(--q-bg)",
				color: "var(--q-fg)",
				fontFamily: "var(--q-font-sans)",
			}}
		>
			<div style={{ ...mono, color: "var(--q-fg)" }}>Future</div>
			<h1
				style={{
					margin: "12px 0 16px",
					fontSize: "var(--q-text-5xl)",
					fontWeight: 700,
					letterSpacing: "var(--q-tracking-display)",
					lineHeight: 1,
				}}
			>
				{title}
				<span style={{ color: "var(--q-accent)" }}>.</span>
			</h1>
			<p style={{ maxWidth: 560, margin: "0 0 48px", color: "var(--q-fg-body)", lineHeight: 1.55 }}>
				{intro}
			</p>
			{children}
		</main>
	);
}

export function Concept({ id, index, name, from, idea, children }) {
	return (
		<section id={id} style={{ padding: "64px 0", borderTop: "1px solid var(--q-fg)" }}>
			<div style={{ display: "flex", gap: 16, alignItems: "baseline", marginBottom: 16 }}>
				<span style={{ ...mono, color: "var(--q-fg)" }}>{String(index).padStart(2, "0")}</span>
				<h2
					style={{
						margin: 0,
						fontWeight: 700,
						fontSize: "var(--q-text-4xl)",
						letterSpacing: "var(--q-tracking-h2)",
						lineHeight: 1,
					}}
				>
					{name}
					<span style={{ color: "var(--q-accent)" }}>.</span>
				</h2>
			</div>
			<div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 24 }}>
				<div>
					<div style={mono}>Evolved from</div>
					<div style={{ marginTop: 4 }}>{from}</div>
				</div>
				<p style={{ flex: "1 1 360px", margin: 0, color: "var(--q-fg-body)", lineHeight: 1.55 }}>
					{idea}
				</p>
			</div>
			{children}
		</section>
	);
}

export function Spec({ label, children, col }) {
	// Flex-wrap instead of a fixed 160px grid column: on narrow screens the label folds above the
	// content, so specimens never force sideways scroll.
	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				gap: "var(--q-space-3)",
				padding: "var(--q-space-3) 0",
				borderTop: "var(--q-hairline) solid var(--q-border)",
				alignItems: col ? "start" : "center",
			}}
		>
			<div style={{ ...mono, flex: "0 0 160px", paddingTop: col ? "var(--q-space-0-5)" : 0 }}>
				{label}
			</div>
			<div
				style={{
					flex: "1 1 320px",
					display: "flex",
					flexDirection: col ? "column" : "row",
					gap: "var(--q-space-2)",
					flexWrap: col ? "nowrap" : "wrap",
					alignItems: col ? "stretch" : "center",
					minWidth: 0,
				}}
			>
				{children}
			</div>
		</div>
	);
}
