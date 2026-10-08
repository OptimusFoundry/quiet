import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { Kbd } from "../Kbd/Kbd";
import styles from "./CommandBar.module.scss";

export interface CommandItem {
	id: string;
	icon: ReactNode;
	title: string;
	meta?: string;
	kbd?: string;
}

export interface CommandSection {
	label: string;
	items: CommandItem[];
}

export interface CommandBarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	sections: CommandSection[];
	activeId?: string;
	query?: string;
	placeholder?: string;
}

/**
 * A floating pill that morphs into the command panel rather than opening a
 * separate modal: same element, its radius and size animate.
 */
export function CommandBar({
	open,
	onOpenChange,
	sections,
	activeId,
	query = "",
	placeholder = "Search or jump to…",
}: CommandBarProps) {
	return (
		<div className={styles.dock}>
			<div className={styles.bar} data-open={open || undefined}>
				<button
					type="button"
					className={styles.trigger}
					onClick={() => onOpenChange(!open)}
					aria-expanded={open}
				>
					<Search aria-hidden="true" />
					<span className={query ? styles.query : styles.placeholder}>{query || placeholder}</span>
					<Kbd>⌘K</Kbd>
				</button>
				<div className={styles.panelClip}>
					<div className={styles.panel} role="listbox" aria-label="Commands">
						{sections.map((s, si) => (
							<div
								key={s.label}
								className={styles.section}
								style={{ animationDelay: `${si * 60}ms` }}
							>
								<span className={styles.sectionLabel}>{s.label}</span>
								{s.items.map((it) => (
									<div
										key={it.id}
										role="option"
										tabIndex={-1}
										aria-selected={it.id === activeId}
										className={styles.item}
									>
										<span className={styles.itemIcon}>{it.icon}</span>
										<span className={styles.itemTitle}>{it.title}</span>
										{it.meta && <span className={styles.itemMeta}>{it.meta}</span>}
										{it.kbd && <Kbd>{it.kbd}</Kbd>}
									</div>
								))}
							</div>
						))}
						<div className={styles.footer}>
							<span>
								<Kbd>↑</Kbd>
								<Kbd>↓</Kbd> move
							</span>
							<span>
								<Kbd>↵</Kbd> open
							</span>
							<span>
								<Kbd>esc</Kbd> close
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
