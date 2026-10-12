import { DoubtMarker } from "@optimusfoundry/quiet";

const noop = () => {};
const para = {
	width: 300,
	margin: 0,
	fontSize: "var(--q-text-md)",
	lineHeight: "var(--q-leading-body)",
} as const;

export const InABrief = () => (
	<p style={para}>
		Signups rose 12% this month.{" "}
		<DoubtMarker
			confidence={0.58}
			reason="Attribution comes from referrer headers; 4 in 10 signups arrived with none."
			onRecheck={noop}
		>
			Most came from the Product Hunt feature.
		</DoubtMarker>{" "}
		Verification held at 91%.
	</p>
);

export const Statuses = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", width: 280 }}>
		<span>
			<DoubtMarker reason="Two runners logged different totals." confidence={0.4}>
				Orca spent $0.902049 on this run.
			</DoubtMarker>
		</span>
		<span>
			<DoubtMarker status="checking" reason="Going back to the runs table.">
				Headless finished 41 runs today.
			</DoubtMarker>
		</span>
		<span>
			<DoubtMarker status="confirmed" reason="Matched against 4,812 rows.">
				4,812 people are on the waitlist.
			</DoubtMarker>
		</span>
		<span>
			<DoubtMarker
				status="revised"
				revision="3 of 14 campaigns bounced above 5%."
				reason="The first figure counted paused campaigns twice."
			>
				5 of 14 campaigns bounced above 5%.
			</DoubtMarker>
		</span>
	</div>
);

export const Revised = () => (
	<p style={para}>
		Ada Park approved the pricing change on Tuesday.{" "}
		<DoubtMarker
			status="revised"
			reason="Referrer headers were missing on 39% of signups."
			revision="About 61% came from the Product Hunt feature; 39% had no referrer."
		>
			Most came from the Product Hunt feature.
		</DoubtMarker>
	</p>
);
