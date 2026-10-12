import { useEffect, useRef } from "react";
import { DatePicker } from "@optimusfoundry/quiet";

const col = { display: "grid", gap: "var(--q-space-stack)", maxWidth: 320 } as const;

export const Default = () => (
	<div style={col}>
		<DatePicker label="First run" defaultValue={new Date(2026, 9, 12)} helperText="The schedule trigger starts on this day." />
	</div>
);

// The calendar is absolutely positioned under the trigger; the wrapper gives it room in the card.
export const Open = () => {
	const ref = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		ref.current?.click();
	}, []);
	return (
		<div style={{ ...col, minHeight: 440, alignContent: "start" }}>
			<DatePicker
				ref={ref}
				label="Retain artifacts until"
				defaultValue={new Date(2026, 9, 19)}
				min={new Date(2026, 9, 11)}
				weekStartsOn={1}
			/>
		</div>
	);
};

export const Placeholder = () => (
	<div style={col}>
		<DatePicker label="Pause runs until" placeholder="Pick a date" />
	</div>
);

export const Sizes = () => (
	<div style={col}>
		<DatePicker size="sm" label="Small" defaultValue={new Date(2026, 9, 12)} />
		<DatePicker size="md" label="Medium" defaultValue={new Date(2026, 9, 12)} />
		<DatePicker size="lg" label="Large" defaultValue={new Date(2026, 9, 12)} />
	</div>
);

export const States = () => (
	<div style={col}>
		<DatePicker label="Key expires" placeholder="Pick a date" required error="API keys need an expiry date." />
		<DatePicker label="Billing starts" defaultValue={new Date(2026, 10, 1)} disabled helperText="Set by your plan." />
	</div>
);
