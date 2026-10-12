import { ElasticSlider } from "@optimusfoundry/quiet";

const box = { width: 320 } as const;
const perDay = (n: number) => `${(n * 100).toLocaleString("en")} / day`;

export const SafeRange = () => (
	<div style={box}>
		<ElasticSlider
			label="Daily send limit"
			min={0}
			max={100}
			safe={60}
			defaultValue={40}
			formatValue={perDay}
			hint="Safe up to 6,000 a day for this domain's age."
			overHint="Past the reputation-safe line. The override is yours to answer for."
		/>
	</div>
);

export const OverrideHeld = () => (
	<div style={box}>
		<ElasticSlider
			label="Daily send limit"
			min={0}
			max={100}
			safe={60}
			defaultValue={82}
			defaultOverride
			formatValue={perDay}
			hint="Safe up to 6,000 a day for this domain's age."
			overHint="Past the reputation-safe line. The override is yours to answer for."
		/>
	</div>
);

export const Concurrency = () => (
	<div style={box}>
		<ElasticSlider
			label="Parallel Orca runners"
			min={1}
			max={16}
			safe={8}
			defaultValue={6}
			formatValue={(n) => `${n} runners`}
			hint="8 keeps the queue under the $40 daily leash."
			overHint="More runners spend faster than the leash can catch."
		/>
	</div>
);

export const Disabled = () => (
	<div style={box}>
		<ElasticSlider
			label="Retry attempts"
			min={0}
			max={10}
			safe={5}
			defaultValue={3}
			formatValue={(n) => `${n} retries`}
			hint="Locked by the workspace policy Ada Park set."
			disabled
		/>
	</div>
);
