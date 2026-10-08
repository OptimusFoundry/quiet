import {
	type CSSProperties,
	type ReactNode,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import styles from "./SegmentedControl.module.scss";

export interface Segment<T extends string> {
	value: T;
	label: string;
	icon?: ReactNode;
	count?: number;
}

export interface SegmentedControlProps<T extends string> {
	segments: Segment<T>[];
	value: T;
	onChange: (value: T) => void;
	label: string;
	/** Segment height: sm 28 · md 36 · lg 44. */
	size?: "sm" | "md" | "lg";
}

/**
 * Native radios underneath (arrow keys, form semantics and screen-reader
 * announcements come free); one indicator springs between the labels.
 */
export function SegmentedControl<T extends string>({
	segments,
	value,
	onChange,
	label,
	size = "md",
}: SegmentedControlProps<T>) {
	const name = useId();
	const refs = useRef(new Map<T, HTMLLabelElement>());
	const [box, setBox] = useState({ x: 0, w: 0 });

	useLayoutEffect(() => {
		const el = refs.current.get(value);
		if (el) setBox({ x: el.offsetLeft, w: el.offsetWidth });
	}, [value]);

	const indicator = { "--seg-x": `${box.x}px`, "--seg-w": `${box.w}px` } as CSSProperties;

	return (
		<fieldset className={`${styles.group} ${styles[size]}`} style={indicator}>
			<legend className={styles.legend}>{label}</legend>
			<span className={styles.indicator} aria-hidden="true" />
			{segments.map((s) => (
				<label
					key={s.value}
					ref={(el) => {
						if (el) refs.current.set(s.value, el);
					}}
					className={styles.segment}
					data-checked={s.value === value || undefined}
				>
					<input
						type="radio"
						name={name}
						value={s.value}
						checked={s.value === value}
						onChange={() => onChange(s.value)}
						className={styles.radio}
					/>
					{s.icon}
					{s.label}
					{s.count !== undefined && <span className={styles.count}>{s.count}</span>}
				</label>
			))}
		</fieldset>
	);
}
