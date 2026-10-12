import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { Badge, Button, Tag } from "../../index";
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
				Selectable and removable: the label and × are sibling buttons. Selected:{" "}
				{picked.join(", ") || "none"}
			</p>
		</div>
	);
}

export const Refs: StoryObj = { render: () => <RefsDemo /> };
export const SelectableRemovableTags: StoryObj = { render: () => <TagsDemo /> };
