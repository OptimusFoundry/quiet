import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	css: { modules: { generateScopedName: "q_[local]_[hash:base64:5]" } },
	build: {
		lib: { entry: "src/index.ts", formats: ["es"], fileName: "index", cssFileName: "quiet" },
		rollupOptions: { external: ["react", "react-dom", "react/jsx-runtime", "motion", /^motion\//] },
		sourcemap: true,
	},
});
