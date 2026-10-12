import { CostMeter } from "@optimusfoundry/quiet";

const box = { width: 380 } as const;
const usd = (v: number) => `$${v.toFixed(2)}`;

export const Today = () => (
	<div style={box}>
		<CostMeter
			label="Agents · today"
			period="daily"
			budget={20}
			format={usd}
			items={[
				{ id: "reply", label: "Replying to signups", value: 2.46, cap: 4 },
				{ id: "draft", label: "Drafting posts", value: 1.12, cap: 3 },
				{ id: "render", label: "Rendering clips", value: 7.42, cap: 8 },
			]}
		/>
	</div>
);

export const NearCaps = () => (
	<div style={box}>
		<CostMeter
			label="Runners · this week"
			period="weekly"
			budget={120}
			format={usd}
			items={[
				{ id: "orca", label: "Orca · web-message", value: 47.9, cap: 50 },
				{ id: "headless", label: "Headless · browsing", value: 38.2, cap: 40 },
				{ id: "eval", label: "Nightly evals", value: 12.05, cap: 30 },
			]}
		/>
	</div>
);

export const Uncapped = () => (
	<div style={box}>
		<CostMeter
			label="Run run_8f2c"
			format={(v) => `$${v.toFixed(6)}`}
			items={[
				{ id: "in", label: "Input tokens", value: 0.412337 },
				{ id: "out", label: "Output tokens", value: 0.468112 },
				{ id: "tools", label: "Tool calls", value: 0.0216 },
			]}
		/>
	</div>
);
