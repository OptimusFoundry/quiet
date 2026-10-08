// Scaffolds a quiet component: <Name>.tsx and <Name>.scss, following AGENTS.md
// (BEM block from the kebab name, component tokens at the top, @layer q.components).
//   node scripts/new-component.mjs <group> <Name>      (or: npm run new -- <group> <Name>)
// Only quiet's own groups are allowed: the reference groups mirror Claude Design and change only
// through the sync workflow.
import { existsSync, writeFileSync } from "node:fs";

const OWN = ["future", "charts", "chat"];
const [group, name] = process.argv.slice(2);

function fail(msg) {
	console.error(`new-component: ${msg}`);
	process.exit(1);
}

if (!group || !name) fail("usage: node scripts/new-component.mjs <group> <Name>");
if (!OWN.includes(group)) {
	fail(
		`"${group}" is not one of quiet's own groups (${OWN.join(", ")}). Reference groups mirror Claude Design — change them there and re-sync.`,
	);
}
if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) fail(`"${name}" must be PascalCase, e.g. TrustMeter`);

const dir = `src/components/${group}`;
const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const block = `q-${kebab}`;
const files = [`${dir}/${name}.tsx`, `${dir}/${name}.scss`];
for (const f of files) if (existsSync(f)) fail(`${f} already exists`);

const tsx = `import React from "react";
import "./${name}.scss";

/**
 * TODO: what it is, in one or two sentences — the design agent and consumers read this.
 * @startingPoint section="${group[0].toUpperCase() + group.slice(1)}" subtitle="TODO" viewport="700x200"
 */
export interface ${name}Props {
	/** Controlled value */
	value?: string;
	/** Uncontrolled starting value */
	defaultValue?: string;
	/** Called with the new value (not the event) */
	onChange?: (value: string) => void;
	label?: React.ReactNode;
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

const SIZES = ["sm", "md", "lg"];

export function ${name}({
	value,
	defaultValue,
	onChange,
	label,
	size = "md",
	disabled = false,
	className,
	style,
	children,
}: ${name}Props) {
	const [inner, setInner] = React.useState(defaultValue);
	const cur = value !== undefined ? value : inner;
	const _set = (v: string) => {
		if (disabled) return;
		setInner(v);
		onChange?.(v);
	};
	const cls = ["${block}", \`${block}--\${SIZES.includes(size) ? size : "md"}\`, className]
		.filter(Boolean)
		.join(" ");
	return (
		<div className={cls} style={style} aria-disabled={disabled || undefined} data-value={cur}>
			{label && <span className="${block}__label">{label}</span>}
			{children}
		</div>
	);
}
`;

const scss = `// ${name} — TODO: one line.
// BEM: .${block}, __label; --{sm|md|lg}.
@layer q.tokens {
  :root,
  [data-theme] {
    --q-${kebab}-gap: var(--q-space-1);
    --q-${kebab}-radius: var(--q-radius-md);
    --q-${kebab}-bg: var(--q-bg);
    --q-${kebab}-fg: var(--q-fg);
    --q-${kebab}-border: var(--q-border);
    --q-${kebab}-label-fg: var(--q-fg-muted);
    --q-${kebab}-dur: var(--q-dur-hover);

    --q-${kebab}-sm-font-size: var(--q-text-xs);
    --q-${kebab}-md-font-size: var(--q-text-sm);
    --q-${kebab}-lg-font-size: var(--q-text-md);
  }
}

@layer q.components {
  .${block} {
    --_font-size: var(--q-${kebab}-md-font-size);

    display: flex;
    flex-direction: column;
    gap: var(--q-${kebab}-gap);
    border: var(--q-hairline) solid var(--q-${kebab}-border);
    border-radius: var(--q-${kebab}-radius);
    background: var(--q-${kebab}-bg);
    color: var(--q-${kebab}-fg);
    font-family: var(--q-font-sans);
    font-size: var(--_font-size);
    transition: border-color var(--q-${kebab}-dur) var(--q-ease-soft);

    @each $size in sm, md, lg {
      &--#{$size} {
        --_font-size: var(--q-${kebab}-#{$size}-font-size);
      }
    }

    &[aria-disabled="true"] {
      opacity: 0.5;
    }
  }

  .${block}__label {
    color: var(--q-${kebab}-label-fg);
  }
}
`;

writeFileSync(files[0], tsx);
writeFileSync(files[1], scss);
console.log(`Created ${files.join(", ")}

Next:
  1. Build it out: tokens at the top of the scss, BEM .${block}__el--mod, a11y hooks from src/a11y/hooks.ts.
  2. npm run gen                       # exports it from src/index.ts
  3. Story: src/stories/future/<Set>.stories.tsx (FuturePage / Concept / Spec), section id="${kebab}"
  4. Test: tests/<set>.spec.ts — axe in foundry + foundry-dark, keyboard + ARIA
  5. npm run lint && npm run typecheck && npm run build && npm run test
See .claude/skills/new-component/SKILL.md.`);
