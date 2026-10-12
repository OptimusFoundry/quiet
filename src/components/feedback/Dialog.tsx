import React from "react";
import { useEscape, useFocusTrap, useMergedRef, usePresence } from "../../a11y/hooks";
import "./Dialog.scss";
import { CloseButton, isStatus, StatusIcon } from "./parts";

export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
	/** The dialog panel (role="dialog"), not the scrim; rest props land there too. */
	ref?: React.Ref<HTMLDivElement>;
	open: boolean;
	onClose?: () => void;
	eyebrow?: React.ReactNode;
	title?: React.ReactNode;
	/** 'info' | 'success' | 'warning' | 'error' (a bare status icon above the title) or your own node */
	icon?: "info" | "success" | "warning" | "error" | React.ReactNode;
	children?: React.ReactNode;
	actions?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	/** px; overrides size */
	width?: number;
	/** false = no Esc, no scrim click, no close button */
	dismissible?: boolean;
	showClose?: boolean;
}

const SIZES: string[] = ["sm", "md", "lg", "xl"];
// quiet: while a modal is open, everything outside it is inert and the page doesn't scroll.
// A layout effect: inert from the commit that shows the modal, released before focus returns.
function useModalBackground(ref: React.RefObject<HTMLElement | null>, active: boolean) {
	React.useLayoutEffect(() => {
		if (!active || !ref.current) return;
		const done: HTMLElement[] = [];
		for (
			let n: HTMLElement = ref.current;
			n.parentElement && n !== document.body;
			n = n.parentElement!
		)
			for (const sib of n.parentElement.children as HTMLCollectionOf<HTMLElement>)
				if (sib !== n && !sib.inert && sib.tagName !== "SCRIPT") {
					sib.inert = true;
					done.push(sib);
				}
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			done.forEach((sib) => {
				sib.inert = false;
			});
			document.body.style.overflow = overflow;
		};
	}, [active, ref]);
}

/**
 * Modal dialog. Rounded (--q-radius-xl), floats on --q-shadow-float over the scrim. Sizes, status icon, non-dismissible.
 * @startingPoint section="Overlays" subtitle="Modal dialogs" viewport="700x480"
 */
export function Dialog({
	open,
	onClose,
	eyebrow,
	title,
	icon,
	children,
	actions,
	size,
	width,
	dismissible = true,
	showClose = true,
	className,
	style,
	ref,
	...rest
}: DialogProps) {
	const { mounted, state } = usePresence(open, 160);
	const live = open && mounted;
	const scrim = React.useRef<HTMLDivElement>(null);
	const box = React.useRef<HTMLDivElement>(null);
	const panelRef = useMergedRef(box, ref);
	const id = React.useId();
	useModalBackground(scrim, live);
	useFocusTrap(box, live);
	useEscape(live && dismissible, onClose);
	if (!mounted) return null;
	const cls = [
		"q-dialog__panel",
		"q-anim-scale",
		`q-dialog__panel--${SIZES.includes(size as string) ? size : "md"}`,
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<div
			ref={scrim}
			className="q-dialog q-anim-fade"
			data-state={state}
			onClick={dismissible ? onClose : undefined}
		>
			<div
				{...rest}
				ref={panelRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? `${id}-t` : rest["aria-labelledby"]}
				aria-describedby={typeof children === "string" ? `${id}-d` : rest["aria-describedby"]}
				tabIndex={-1}
				className={cls}
				data-state={state}
				onClick={(e) => {
					e.stopPropagation();
					rest.onClick?.(e);
				}}
				style={
					width
						? ({
								...style,
								"--_max-width": typeof width === "number" ? `${width}px` : width,
							} as React.CSSProperties)
						: style
				}
			>
				<div className="q-dialog__header">
					<div className="q-dialog__heading">
						{icon && (
							<span aria-hidden="true" className="q-dialog__icon">
								{isStatus(icon) ? <StatusIcon status={icon} size="lg" /> : icon}
							</span>
						)}
						{eyebrow && <div className="q-dialog__eyebrow">{eyebrow}</div>}
						{title && (
							<div id={`${id}-t`} className="q-dialog__title">
								{title}
								<span className="q-dialog__dot">.</span>
							</div>
						)}
					</div>
					{showClose && dismissible && (
						<CloseButton label="Close dialog" onClick={onClose} className="q-dialog__close" />
					)}
				</div>
				{children && (
					<div id={`${id}-d`} className="q-dialog__body">
						{children}
					</div>
				)}
				{actions && <div className="q-dialog__actions">{actions}</div>}
			</div>
		</div>
	);
}
