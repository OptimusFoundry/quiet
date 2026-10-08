import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	ArrowLink,
	Breadcrumb,
	Button,
	Card,
	Link,
	type LinkComponent,
	List,
	NavBar,
	QuietRoot,
	Sidebar,
	StatCard,
} from "../index";
import "./RouterLinks.scss";

// Every href-capable component under one <QuietRoot linkComponent>. The stand-in router link
// navigates with pushState, the way TanStack Router's <Link> does, so a test can tell a routed
// click (no document load) from a native one.
const RouterLink: LinkComponent = ({ href, onClick, ...props }) => (
	<a
		{...props}
		href={href}
		data-router-link=""
		onClick={(e) => {
			onClick?.(e);
			if (e.defaultPrevented) return;
			e.preventDefault();
			window.history.pushState(null, "", href);
		}}
	/>
);

function RouterLinks() {
	return (
		<QuietRoot linkComponent={RouterLink} density="app" className="q-sb-router-links">
			<NavBar links={[{ label: "Pricing", href: "/pricing" }]} ctaHref="/contact" />
			<Breadcrumb items={[{ label: "Home", href: "/home" }, { label: "Settings" }]} />
			<Sidebar items={[{ label: "Projects", href: "/projects" }]} />
			<p>
				<Link href="/docs">Docs</Link> · <ArrowLink href="/changelog">Changelog</ArrowLink> ·{" "}
				<Link href="https://example.com" external>
					Example
				</Link>{" "}
				· <Link href="https://example.org/absolute">Absolute</Link> ·{" "}
				<Link href="mailto:hi@example.com">Email</Link> · <Link href="#top">Top</Link>
			</p>
			<Button href="/new">New project</Button>
			<Card href="/card" title="Card" />
			<StatCard href="/stat" label="Stat" value={3} />
			<List items={[{ primary: "List row", href: "/row" }]} />
		</QuietRoot>
	);
}

const meta: Meta = { title: "Integration/Router links", component: RouterLinks };
export default meta;
export const Default: StoryObj = {};
