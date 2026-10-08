import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ConsensusSlider } from "../../components/future/ConsensusSlider";
import { ElasticSlider } from "../../components/future/ElasticSlider";
import { HonestButton } from "../../components/future/HonestButton";
import { ProbabilityToggle } from "../../components/future/ProbabilityToggle";
import { Concept, FuturePage, Spec } from "./Concept.jsx";

const POLICY = [
	{ upTo: 4, label: "Off", description: "Meerkat never posts without asking." },
	{ upTo: 34, label: "Rarely", description: "Posts alone only for routine release notes." },
	{
		upTo: 64,
		label: "Sometimes",
		description: "Posts alone when the draft scores high and nothing is scheduled.",
	},
	{
		upTo: 95,
		label: "Mostly",
		description: "Posts alone unless the draft mentions pricing, outages or people.",
	},
	{ upTo: 100, label: "Always", description: "Posts alone. You'll see it in the brief." },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function ElasticDemo() {
	const [v, setV] = useState(40);
	return (
		<ElasticSlider
			label="Daily send limit"
			min={0}
			max={100}
			safe={60}
			value={v}
			onChange={setV}
			formatValue={(n) => `${(n * 100).toLocaleString("en")} / day`}
			hint="Safe up to 6,000 a day for this domain's age."
			overHint="Past the reputation-safe line. The override is yours to answer for."
		/>
	);
}

function InputsPage() {
	return (
		<FuturePage
			title="Evolved inputs"
			intro="Four controls from Future Components II, rebuilt on quiet: the familiar button, switch and slider, each carrying one more thing it used to leave to a second step."
		>
			<Concept
				id="honest-button"
				index={29}
				name="Honest button"
				from="Button · progress bar"
				idea="Its length is its expected duration, learned from past runs. Pressing it doesn't spawn a spinner elsewhere; the button itself fills and counts down."
			>
				<Spec label="Expected wait">
					<HonestButton expected={0.3}>Save</HonestButton>
					<HonestButton expected={4}>Verify domain</HonestButton>
					<HonestButton expected={42}>Render 3 clips</HonestButton>
				</Spec>
				<Spec label="Real work">
					<HonestButton expected={2} onPress={() => wait(3200)}>
						Sync contacts
					</HonestButton>
				</Spec>
				<Spec label="Sizes">
					<HonestButton size="sm" expected={4}>
						Small
					</HonestButton>
					<HonestButton size="lg" expected={4}>
						Large
					</HonestButton>
					<HonestButton disabled expected={4}>
						Disabled
					</HonestButton>
				</Spec>
			</Concept>
			<Concept
				id="probability-toggle"
				index={31}
				name="Probability toggle"
				from="Switch"
				idea="Delegation isn't binary. The thumb rests anywhere between off and always, and the system reads the position back as a policy in words."
			>
				<Spec label="Policy">
					<ProbabilityToggle label="Publish without asking" levels={POLICY} defaultValue={80} />
				</Spec>
				<Spec label="Default levels">
					<ProbabilityToggle label="Auto-reply" defaultValue={30} />
					<ProbabilityToggle aria-label="Disabled" disabled defaultValue={50} />
				</Spec>
			</Concept>
			<Concept
				id="elastic-slider"
				index={32}
				name="Elastic slider"
				from="Slider · validation"
				idea="Past the safe range the thumb stretches and loses leverage, and springs back on release unless you've explicitly taken the override. Resistance replaces the error message."
			>
				<Spec label="Safe line" col>
					<ElasticDemo />
				</Spec>
			</Concept>
			<Concept
				id="consensus-slider"
				index={33}
				name="Consensus slider"
				from="Slider · comments"
				idea="Any shared setting shows where teammates and agents set theirs as markers. Agreement is a band narrowing, visible without a thread."
			>
				<Spec label="Shared setting" col>
					<ConsensusSlider
						label="Pro price"
						min={9}
						max={79}
						defaultValue={29}
						closeWithin={6}
						formatValue={(n) => `$${n}`}
						others={[
							{ name: "Ada Park", value: 24 },
							{ name: "Leo Brandt", value: 35 },
							{ name: "Meerkat", value: 31, agent: true },
						]}
					/>
				</Spec>
			</Concept>
		</FuturePage>
	);
}

const meta: Meta = { title: "Future/Inputs", parameters: { layout: "fullscreen" } };
export default meta;
export const All: StoryObj = { render: () => <InputsPage /> };
