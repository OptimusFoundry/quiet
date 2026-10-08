import type { CSSProperties, ReactNode } from "react";
import styles from "./Table.module.scss";

export interface Column<R> {
	key: string;
	header: string;
	align?: "start" | "end";
	numeric?: boolean;
	width?: string;
	render: (row: R) => ReactNode;
}

export interface TableProps<R> {
	columns: Column<R>[];
	rows: R[];
	rowKey: (row: R) => string;
	/** Revealed at the row's right edge on hover/focus, so dense rows stay quiet. */
	actions?: (row: R) => ReactNode;
	/** Change to replay the staggered row reveal (e.g. when a filter changes). */
	revealKey?: string;
	/** Row rendered as hovered — for recordings, which have no real pointer. */
	hoveredKey?: string;
	/** Cell padding: sm 8×12 · md 14×16 · lg 20×20. Use sm on compact surfaces. */
	size?: "sm" | "md" | "lg";
}

export function Table<R>({
	columns,
	rows,
	rowKey,
	actions,
	revealKey,
	hoveredKey,
	size = "md",
}: TableProps<R>) {
	return (
		<div className={styles.wrap}>
			<table className={`${styles.table} ${styles[size]}`}>
				<colgroup>
					{columns.map((c) => (
						<col key={c.key} style={c.width ? { width: c.width } : undefined} />
					))}
					{actions && <col className={styles.actionsCol} />}
				</colgroup>
				<thead>
					<tr>
						{columns.map((c) => (
							<th key={c.key} data-align={c.align ?? "start"}>
								{c.header}
							</th>
						))}
						{actions && (
							<th>
								<span className={styles.srOnly}>Actions</span>
							</th>
						)}
					</tr>
				</thead>
				<tbody key={revealKey}>
					{rows.map((r, i) => {
						const k = rowKey(r);
						return (
							<tr
								key={k}
								className={styles.row}
								data-hovered={hoveredKey === k || undefined}
								style={{ "--i": i } as CSSProperties}
							>
								{columns.map((c) => (
									<td
										key={c.key}
										data-align={c.align ?? "start"}
										data-numeric={c.numeric || undefined}
									>
										{c.render(r)}
									</td>
								))}
								{actions && (
									<td className={styles.actionsCell}>
										<span className={styles.actions}>{actions(r)}</span>
									</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
