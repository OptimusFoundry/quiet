import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import {
	Avatar,
	Badge,
	Button,
	ButtonGroup,
	Icon,
	Link,
	Skeleton,
	Spinner,
	StatusDot,
	Tag,
	Text,
} from "../../index";
import "./Core.scss";

// Core components take a React 19 `ref` and pass rest HTML attributes to their root.
const meta: Meta = { title: "Extensions/Core", parameters: { layout: "padded" } };
export default meta;

function RefsDemo() {
	const button = useRef<HTMLButtonElement>(null);
	return (
		<div className="q-sb-core">
			<div className="q-sb-core__row">
				<Button variant="secondary" onClick={() => button.current?.focus()}>
					Focus the other button
				</Button>
				<Button ref={button} data-testid="target" aria-describedby="core-target-note">
					Target
				</Button>
				<Badge id="core-badge" title="Rest props reach the root" data-testid="badge">
					rest props
				</Badge>
			</div>
			<p id="core-target-note" className="q-sb-core__note">
				The first button focuses the second through its ref.
			</p>
		</div>
	);
}

function TagsDemo() {
	const [tags, setTags] = useState(["Design", "Research", "Ops"]);
	const [picked, setPicked] = useState<string[]>(["Design"]);
	return (
		<div className="q-sb-core">
			<div className="q-sb-core__row">
				{tags.map((t) => (
					<Tag
						key={t}
						selectable
						selected={picked.includes(t)}
						onSelect={(on) => setPicked((p) => (on ? [...p, t] : p.filter((x) => x !== t)))}
						onRemove={() => setTags((all) => all.filter((x) => x !== t))}
					>
						{t}
					</Tag>
				))}
			</div>
			<p className="q-sb-core__note">
				Selectable and removable: the label and the remove icon are sibling buttons. Selected:{" "}
				{picked.join(", ") || "none"}
			</p>
		</div>
	);
}

export const Refs: StoryObj = { render: () => <RefsDemo /> };
export const SelectableRemovableTags: StoryObj = { render: () => <TagsDemo /> };

// Every core control in its one-look shape: dense pills, icons from the stroke set, sans labels.
export const Overview: StoryObj = {
	render: () => (
		<div className="q-sb-core">
			<div className="q-sb-core__row">
				<Button>Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="destructive">Delete</Button>
			</div>
			<div className="q-sb-core__row">
				<Button size="sm" arrow>
					Continue
				</Button>
				<Button variant="ghost" size="sm" leftIcon={<Icon name="plus" />}>
					Add field
				</Button>
				<Button variant="ghost" size="sm" icon={<Icon name="more" />} aria-label="More" />
				<Button variant="secondary" size="sm" loading>
					Saving
				</Button>
				<Button size="lg">Large</Button>
			</div>
			<div className="q-sb-core__row">
				<ButtonGroup attached>
					<Button variant="secondary" size="sm">
						Day
					</Button>
					<Button variant="secondary" size="sm">
						Week
					</Button>
					<Button variant="secondary" size="sm">
						Month
					</Button>
				</ButtonGroup>
			</div>
			<div className="q-sb-core__row">
				<Tag>Design</Tag>
				<Tag tone="strong">Strong</Tag>
				<Tag selectable defaultSelected>
					Selected
				</Tag>
				<Tag selectable>Selectable</Tag>
				<Tag size="sm">Small</Tag>
				<Tag onRemove={() => {}}>Removable</Tag>
				<Tag status="warning">Warning</Tag>
			</div>
			<div className="q-sb-core__row">
				<Badge>Default</Badge>
				<Badge variant="primary">Primary</Badge>
				<Badge variant="success">Done</Badge>
				<Badge variant="warning">At risk</Badge>
				<Badge variant="error">Failed</Badge>
				<Badge count={128} />
			</div>
			<div className="q-sb-core__row">
				<Avatar name="Ada Lovelace" />
				<Avatar name="Grace Hopper" size="lg" />
				<Avatar size="lg" />
				<Avatar name="Quiet Labs" shape="square" size="lg" />
				<StatusDot status="live" />
				<StatusDot status="prototype" />
				<StatusDot status="archived" />
				<Spinner size="sm" label="Loading" />
			</div>
			<div className="q-sb-core__row">
				<Text>
					Read the <Link href="#">billing guide</Link> or the{" "}
					<Link href="https://example.com" external>
						API reference
					</Link>
					.
				</Text>
				<Text mono>run_8f2c1a</Text>
				<Text color="error">Payment failed</Text>
			</div>
			<Skeleton lines={3} />
		</div>
	),
};
