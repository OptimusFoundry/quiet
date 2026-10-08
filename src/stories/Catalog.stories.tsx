import type { Meta, StoryObj } from "@storybook/react-vite";
// The Optimus Foundry master page (components/index.html), rendered with quiet's components.
import App from "./catalog.generated.jsx";

const meta: Meta = { title: "Catalog", component: App, parameters: { layout: "fullscreen" } };
export default meta;
export const AllComponents: StoryObj = {};
