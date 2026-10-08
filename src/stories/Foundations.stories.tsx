import type { Meta, StoryObj } from "@storybook/react-vite";
import styles from "./Foundations.module.scss";

const TYPE = [
	{ token: "4xl", px: 48, note: "marketing" },
	{ token: "3xl", px: 32, note: "marketing" },
	{ token: "2xl", px: 24, note: "page title" },
	{ token: "xl", px: 20, note: "section" },
	{ token: "lg", px: 16, note: "reading" },
	{ token: "md", px: 14, note: "default UI" },
	{ token: "sm", px: 13, note: "secondary" },
	{ token: "xs", px: 12, note: "meta" },
];
const SURFACES = ["page", "surface", "surface-sunken", "surface-hover", "surface-active", "strong"];
const TEXTS = ["text", "text-secondary", "text-tertiary"];
const SIGNALS = ["accent", "success", "warning", "danger"];
const SPACE = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
const RADII = ["xs", "control", "card", "sheet", "full"];

function Foundations() {
	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<p className={styles.eyebrow}>quiet · Foundations</p>
				<h1 className={styles.title}>Quiet, precise, neutral.</h1>
				<p className={styles.lede}>
					Neutral greys, one accent, Inter at 400/500, a 4px grid, 8/12px radii, hairlines for
					resting surfaces and soft shadows only for things that float.
				</p>
			</header>

			<section className={styles.section}>
				<h2 className={styles.h2}>Type</h2>
				<div className={styles.typeList}>
					{TYPE.map((t) => (
						<div key={t.token} className={styles.typeRow}>
							<span className={styles.meta}>
								{t.token} · {t.px}px · {t.note}
							</span>
							<span className={styles[`t-${t.token}`]}>Ship the quiet launch</span>
						</div>
					))}
					<div className={styles.typeRow}>
						<span className={styles.meta}>mono · metadata</span>
						<span className={styles.mono}>ID 2107618232 · ⌘K · v2.0.0</span>
					</div>
					<div className={styles.typeRow}>
						<span className={styles.meta}>tabular numbers</span>
						<span className={`${styles["t-xl"]} q-tnum`}>$48,210.00 · 1,111,111 · 08:59:30</span>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.h2}>Colour</h2>
				<div className={styles.swatches}>
					{[...SURFACES, ...SIGNALS].map((c) => (
						<div key={c} className={styles.swatch}>
							<span className={styles.chip} data-color={c} />
							<span className={styles.meta}>{c}</span>
						</div>
					))}
				</div>
				<div className={styles.textRamp}>
					{TEXTS.map((c) => (
						<span key={c} data-text={c}>
							{c} — the three greys carry hierarchy
						</span>
					))}
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.h2}>Space · 4px base</h2>
				<div className={styles.spaceList}>
					{SPACE.map((s) => (
						<div key={s} className={styles.spaceRow}>
							<span className={styles.meta}>{s * 4}px</span>
							<span className={styles.bar} data-space={s} />
						</div>
					))}
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.h2}>Shape &amp; depth</h2>
				<div className={styles.tiles}>
					{RADII.map((r) => (
						<div key={r} className={styles.radiusTile} data-radius={r}>
							<span className={styles.meta}>{r}</span>
						</div>
					))}
				</div>
				<div className={styles.tiles}>
					<div className={styles.depth} data-depth="flat">
						<span className={styles.meta}>flat</span>
					</div>
					<div className={styles.depth} data-depth="ring">
						<span className={styles.meta}>resting · hairline</span>
					</div>
					<div className={styles.depth} data-depth="float">
						<span className={styles.meta}>floating</span>
					</div>
					<div className={styles.depth} data-depth="overlay">
						<span className={styles.meta}>overlay</span>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.h2}>Motion · hover the tiles</h2>
				<div className={styles.tiles}>
					<div className={styles.motion} data-curve="ease">
						<span className={styles.meta}>ease-out 200ms</span>
					</div>
					<div className={styles.motion} data-curve="snappy">
						<span className={styles.meta}>spring · snappy</span>
					</div>
					<div className={styles.motion} data-curve="gentle">
						<span className={styles.meta}>spring · gentle</span>
					</div>
				</div>
			</section>
		</div>
	);
}

const meta: Meta = {
	title: "Foundations/Overview",
	parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = { render: () => <Foundations /> };
