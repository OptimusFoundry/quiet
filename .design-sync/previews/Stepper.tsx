import { FormHint, Label, Stepper } from "@optimusfoundry/quiet";

const row = { display: "flex", gap: "var(--q-space-block)", alignItems: "end", flexWrap: "wrap" } as const;
const field = { display: "grid", gap: "var(--q-space-field)", justifyItems: "start" } as const;

export const Default = () => (
	<div style={field}>
		<Label htmlFor="seats">Seats</Label>
		<Stepper id="seats" label="Seats" defaultValue={3} min={1} max={50} />
	</div>
);

export const Sizes = () => (
	<div style={row}>
		<div style={field}>
			<Label htmlFor="retries" size="sm">Retries</Label>
			<Stepper id="retries" size="sm" label="Retries" defaultValue={2} min={0} max={5} />
		</div>
		<div style={field}>
			<Label htmlFor="seats-md">Seats</Label>
			<Stepper id="seats-md" size="md" label="Seats" defaultValue={3} min={1} />
		</div>
		<div style={field}>
			<Label htmlFor="conc" size="lg">Concurrent runs</Label>
			<Stepper id="conc" size="lg" label="Concurrent runs" defaultValue={10} step={5} />
		</div>
	</div>
);

export const Bounds = () => (
	<div style={row}>
		<div style={field}>
			<Label htmlFor="r0">Retries</Label>
			<Stepper id="r0" label="Retries" defaultValue={0} min={0} max={5} />
			<FormHint>At the minimum: − is disabled.</FormHint>
		</div>
		<div style={field}>
			<Label htmlFor="r8">Runners</Label>
			<Stepper id="r8" label="Runners" defaultValue={8} min={1} max={8} />
			<FormHint>At the plan maximum: + is disabled.</FormHint>
		</div>
	</div>
);

export const Disabled = () => (
	<div style={field}>
		<Label htmlFor="seats-off" disabled>Seats (set by your plan)</Label>
		<Stepper id="seats-off" label="Seats" disabled defaultValue={5} />
	</div>
);
