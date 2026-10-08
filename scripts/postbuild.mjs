import { cpSync } from "node:fs";

cpSync("src/styles/fonts.css", "dist/fonts.css");
// The token list for the quiet/known-tokens Stylelint rule (stylelint/index.mjs).
cpSync("src/styles/tokens.generated.json", "dist/tokens.json");
