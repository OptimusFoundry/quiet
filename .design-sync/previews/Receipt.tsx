import { Receipt } from "@optimusfoundry/quiet";

const box = { width: 420 } as const;

export const AgentRun = () => (
	<div style={box}>
		<Receipt
			actor="Meerkat"
			time="14:02"
			reference="#4f2a"
			reason="Three refund requests from web-message matched the under-$50 policy."
			lines={[
				{ id: "1", verb: "Refunded", object: "$24.00 to Ada Park", undoable: true },
				{ id: "2", verb: "Refunded", object: "$12.50 to Leo Brandt", undoable: true },
				{ id: "3", verb: "Refunded", object: "$41.99 to Mira Osei", undoable: true },
				{ id: "4", verb: "Sent", object: "3 confirmation emails" },
				{ id: "5", verb: "Charged", object: "$0.902049 to Support triage" },
			]}
			footer="Reversible until tomorrow 14:02"
		/>
	</div>
);

export const WithUndone = () => (
	<div style={box}>
		<Receipt
			actor="Meerkat"
			time="09:41"
			reference="#a71c"
			reason="Two runs on Orca failed with the same timeout."
			lines={[
				{ id: "1", verb: "Moved", object: "run-8812 to Headless", undoable: true, undone: true },
				{ id: "2", verb: "Moved", object: "run-8813 to Headless", undoable: true },
				{ id: "3", verb: "Opened", object: "incident note in #ops" },
			]}
			footer="Reversible until 21:41 today"
		/>
	</div>
);

export const ReadOnly = () => (
	<div style={box}>
		<Receipt
			actor="Ada Park"
			time="Yesterday 17:30"
			reference="#19be"
			lines={[
				{ id: "1", verb: "Archived", object: "Q3 onboarding project" },
				{ id: "2", verb: "Exported", object: "412 artifacts to S3" },
			]}
		/>
	</div>
);
