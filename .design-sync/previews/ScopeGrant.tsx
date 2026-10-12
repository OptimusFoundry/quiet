import { Avatar, ScopeGrant } from "@optimusfoundry/quiet";

const noop = () => {};

const box = { width: 520 } as const;
const agent = <Avatar name="Meerkat" size="sm" shape="square" />;

const SCOPES = [
	{ id: "read", label: "Read runs, artifacts and triggers", defaultGranted: true },
	{ id: "draft", label: "Draft replies to web-message", short: "draft", defaultGranted: true },
	{ id: "refund", label: "Refund orders under $50", short: "refund", asks: true },
	{ id: "rerun", label: "Rerun failed runs on Orca or Headless", short: "rerun", defaultGranted: true },
	{ id: "bill", label: "Change plans or billing", short: "change billing", asks: true },
];
const DURATIONS = [
	{ value: "1h", label: "1 hour", expires: "expires in 1 hour" },
	{ value: "today", label: "Today", expires: "expires at midnight" },
	{ value: "always", label: "Until revoked", expires: "until you revoke it" },
];

export const Request = () => (
	<div style={box}>
		<ScopeGrant
			agent={agent}
			title="What Meerkat may do in Support triage"
			caption="Scoped to this project"
			scopes={SCOPES}
			durations={DURATIONS}
			defaultDuration="today"
			onGrant={noop}
		/>
	</div>
);

export const Granted = () => (
	<div style={box}>
		<ScopeGrant
			agent={agent}
			title="What Meerkat may do in Support triage"
			caption="Scoped to this project"
			scopes={SCOPES}
			defaultValue={["read", "draft", "refund", "rerun"]}
			durations={DURATIONS}
			defaultDuration="always"
			granted
			onGrant={noop}
			onRevoke={noop}
		/>
	</div>
);

export const NoDuration = () => (
	<div style={box}>
		<ScopeGrant
			agent="Scout"
			title="Let Scout act for you"
			caption="Anything left off, Scout asks first."
			scopes={[
				{ id: "read", label: "Read the Research · Q4 project", defaultGranted: true },
				{ id: "browse", label: "Open pages on Headless", short: "browse", description: "Up to 20 pages per run" },
				{ id: "publish", label: "Publish artifacts to the team", short: "publish", asks: true },
			]}
			onGrant={noop}
			grantLabel="Allow"
		/>
	</div>
);
