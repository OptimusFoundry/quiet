// quiet's app icon set: stroke paths on a 24 grid, drawn for a 1.6 stroke with round caps and
// joins. App look only; marketing keeps the reference's glyphs (core/Icon). Each value is one
// path's `d`; circles are written as two arcs.

const circle = (cx: number, cy: number, r: number) =>
	`M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

export const APP_ICONS = {
	// Navigation
	home: "M4 10.5 12 4l8 6.5v9a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z",
	inbox:
		"M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5M6 5h12l2.5 8.5v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-5z",
	campaigns:
		"M4 10.5v3a1 1 0 0 0 1 1h2.5l8 4.5v-14l-8 4.5H5a1 1 0 0 0-1 1zM19 9.5a3.5 3.5 0 0 1 0 5M8 14.5l1 5",
	assistant:
		"M11 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5zM18.5 15.5v4M16.5 17.5h4",
	analytics: "M4.5 19.5v-6M9.5 19.5v-11M14.5 19.5v-8M19.5 19.5V5",
	list: "M8.5 6.5h11M8.5 12h11M8.5 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01",
	runs: "M13 3.5 5.5 13.5H12l-1 7 7.5-10H12z",
	file: "M6.5 3.5h7L18 8v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5zM13.5 3.5V8H18",
	users: `${circle(9, 8.5, 3)}M3.5 19c.9-2.9 3-4.5 5.5-4.5s4.6 1.6 5.5 4.5M16 5.8a3 3 0 0 1 0 5.4M17.5 14.7c1.5.5 2.5 1.9 3 4.3`,
	chat: "M5 5.5h14A1.5 1.5 0 0 1 20.5 7v8.5A1.5 1.5 0 0 1 19 17h-8.5L6 20.5V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5z",
	folder:
		"M3.5 7A1.5 1.5 0 0 1 5 5.5h4.5l2 2.5H19a1.5 1.5 0 0 1 1.5 1.5V17a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17z",
	approvals: `${circle(12, 12, 8.5)}M8.5 12.5l2.5 2.5 4.5-5`,
	key: `${circle(8, 15.5, 3.5)}M10.5 13 19 4.5M16 7.5l2.5 2.5M14 9.5l2 2`,
	link: "M10 14a3.5 3.5 0 0 0 5 0l3.5-3.5a3.5 3.5 0 0 0-5-5L12.5 6.5M14 10a3.5 3.5 0 0 0-5 0l-3.5 3.5a3.5 3.5 0 0 0 5 5l1-1",
	grid: "M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z",
	settings: `M4 7h9M17 7h3M4 17h3M11 17h9${circle(15, 7, 2)}${circle(9, 17, 2)}`,
	billing:
		"M3.5 7A1.5 1.5 0 0 1 5 5.5h14A1.5 1.5 0 0 1 20.5 7v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17zM3.5 10h17M7 15h3",
	// Controls
	search: `${circle(11, 11, 6.5)}M20 20l-4.4-4.4`,
	bell: "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
	plus: "M12 5v14M5 12h14",
	close: "M6.5 6.5l11 11M17.5 6.5l-11 11",
	check: "M5 12.5l4.5 4.5L19 7.5",
	more: `${circle(6, 12, 0.6)}${circle(12, 12, 0.6)}${circle(18, 12, 0.6)}`,
	"chevron-down": "M6.5 9.5 12 15l5.5-5.5",
	"chevron-right": "M9.5 6.5 15 12l-5.5 5.5",
	"chevrons-up-down": "M8 9.5l4-4 4 4M8 14.5l4 4 4-4",
	"arrow-left": "M19 12H5M11 6l-6 6 6 6",
	external:
		"M14 4.5h5.5V10M19.5 4.5 11 13M17 13.5V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8.5A1.5 1.5 0 0 1 6 7h4.5",
	download: "M12 4.5v10.5M7.5 10.5 12 15l4.5-4.5M5 19.5h14",
	filter: "M4 6h16M7 12h10M10 18h4",
	sort: "M7 4.5v15M3.5 16 7 19.5l3.5-3.5M17 19.5v-15M13.5 8 17 4.5 20.5 8",
	sidebar:
		"M4 6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 20 6v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18zM9.5 4.5v15",
	menu: "M4 7h16M4 12h16M4 17h16",
	user: `${circle(12, 8.5, 3.5)}M5 19.5c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5`,
	help: `${circle(12, 12, 8.5)}M9.75 9.5a2.25 2.25 0 1 1 3.2 2.05c-.6.3-.95.8-.95 1.45v.5M12 16.5h.01`,
	"sign-out": "M10 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h4M15 8l4 4-4 4M19 12H9",
} as const;

export type AppIconName = keyof typeof APP_ICONS;
