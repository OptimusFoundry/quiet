import { ConsensusSlider } from "@optimusfoundry/quiet";

const box = { width: 380 } as const;

export const SharedSetting = () => (
	<div style={box}>
		<ConsensusSlider
			label="Pro price"
			min={9}
			max={79}
			defaultValue={29}
			closeWithin={6}
			formatValue={(n) => `$${n}`}
			others={[
				{ name: "Ada Park", value: 22 },
				{ name: "Leo Brandt", value: 44 },
				{ name: "Meerkat", value: 33, agent: true },
			]}
		/>
	</div>
);

export const FarApart = () => (
	<div style={box}>
		<ConsensusSlider
			label="Daily agent budget"
			min={0}
			max={200}
			step={5}
			defaultValue={40}
			closeWithin={20}
			showMeet
			formatValue={(n) => `$${n}`}
			others={[
				{ name: "Ada Park", value: 150 },
				{ name: "Leo Brandt", value: 60 },
				{ name: "Orca", value: 120, agent: true },
			]}
		/>
	</div>
);

export const Agreed = () => (
	<div style={box}>
		<ConsensusSlider
			label="Retry limit per run"
			min={0}
			max={10}
			defaultValue={3}
			closeWithin={2}
			others={[
				{ name: "Ada Park", value: 2 },
				{ name: "Leo Brandt", value: 4 },
				{ name: "Meerkat", value: 3, agent: true },
			]}
		/>
	</div>
);

export const Disabled = () => (
	<div style={box}>
		<ConsensusSlider
			label="Seats on the Team plan"
			min={1}
			max={50}
			defaultValue={12}
			disabled
			others={[
				{ name: "Ada Park", value: 10 },
				{ name: "Leo Brandt", value: 15 },
			]}
		/>
	</div>
);
