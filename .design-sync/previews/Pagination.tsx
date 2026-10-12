import { Pagination, Text } from "@optimusfoundry/quiet";

export const RunsPager = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)", justifyItems: "start" }}>
		<Text size="sm" color="muted">
			Runs 41–60 of 212
		</Text>
		<Pagination defaultPage={3} total={11} size="sm" />
	</div>
);

export const Variants = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
		<Pagination defaultPage={4} total={9} size="sm" variant="default" />
		<Pagination defaultPage={4} total={9} size="sm" variant="outline" />
		<Pagination defaultPage={4} total={9} size="sm" variant="ghost" />
	</div>
);

export const Sizes = () => (
	<div style={{ display: "grid", gap: "var(--q-space-stack)" }}>
		<Pagination defaultPage={2} total={5} size="sm" />
		<Pagination defaultPage={2} total={5} size="md" />
		<Pagination defaultPage={2} total={5} size="lg" />
	</div>
);

export const FirstLast = () => <Pagination defaultPage={18} total={40} size="sm" showFirstLast />;

export const Disabled = () => <Pagination defaultPage={1} total={6} size="sm" disabled />;
