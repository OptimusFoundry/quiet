import { PromptSuggestions } from "@optimusfoundry/quiet";

export const Pills = () => (
	<div style={{ width: 520 }}>
		<PromptSuggestions
			suggestions={["Summarise this run", "Why did it fail?", "Draft an approval note", "Compare with yesterday"]}
		/>
	</div>
);

export const Cards = () => (
	<div style={{ width: 560 }}>
		<PromptSuggestions
			layout="grid"
			suggestions={[
				{ label: "Why did a run fail?", description: "Paste a run id", prompt: "Why did run 9a01be44 fail?" },
				{ label: "Summarise this week’s costs", description: "Across Orca and Headless", prompt: "Summarise this week’s costs." },
				{ label: "Draft an approval note", description: "For the release artifact", prompt: "Draft an approval note." },
				{ label: "Add a trigger", description: "web-message, schedule or webhook", prompt: "Add a web-message trigger." },
			]}
		/>
	</div>
);
