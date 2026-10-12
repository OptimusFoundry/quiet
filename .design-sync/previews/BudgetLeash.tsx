import { Avatar, BudgetLeash } from "@optimusfoundry/quiet";

const box = { width: 400 } as const;
const agent = <Avatar name="Meerkat" size="sm" shape="square" />;
const usd = (v: number) => `$${v.toFixed(2)}`;
const noop = () => {};

export const FullSpeed = () => (
	<div style={box}>
		<BudgetLeash
			label="Meerkat · research run"
			agent={agent}
			spent={8.4}
			cap={40}
			onCapChange={noop}
			presets={[20, 40, 80]}
			slack={10}
			atCap="asks before spending more"
		/>
	</div>
);

export const Slowing = () => (
	<div style={box}>
		<BudgetLeash
			label="Meerkat's daily cap"
			agent={agent}
			spent={31.6}
			cap={40}
			onCapChange={noop}
			presets={[20, 40, 80]}
			slack={10}
			format={usd}
			atCap="asks before spending more"
		/>
	</div>
);

export const Taut = () => (
	<div style={box}>
		<BudgetLeash
			label="Orca · pricing-watch"
			agent="Orca"
			spent={18.7}
			cap={20}
			onCapChange={noop}
			presets={[20, 40, 80]}
			slack={10}
			format={usd}
			atCap="pauses and pings Ada Park"
		/>
	</div>
);

export const Stopped = () => (
	<div style={box}>
		<BudgetLeash
			label="Headless · launch clips"
			agent="Headless"
			spent={40}
			cap={40}
			onCapChange={noop}
			presets={[20, 40, 80]}
			slack={10}
			format={usd}
			atCap="asks first"
		/>
	</div>
);
