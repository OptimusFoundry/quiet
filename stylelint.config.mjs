// quiet's CSS rules: BEM class names under the q- namespace, and no raw design values in
// component styles — every colour, size, space, radius, shadow, duration and z-index is a token.
// Token and theme files define the values, so the strict-value rule doesn't apply there.
const BEM = /^q-[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/;

import { strictValue } from "./stylelint/tokenised.mjs";

export default {
	extends: ["stylelint-config-standard-scss"],
	// quiet/known-tokens is the rule quiet ships to apps (stylelint/index.mjs); here it checks that every
	// var(--q-…) in quiet's own SCSS is declared somewhere. Definitions are quiet's to make.
	plugins: ["stylelint-declaration-strict-value", "./stylelint/index.mjs"],
	rules: {
		"quiet/known-tokens": [true, { definitions: false }],
		"selector-class-pattern": [BEM, { message: (s) => `"${s}" must be BEM: q-block__element--modifier` }],
		"scale-unlimited/declaration-strict-value": strictValue,
		"custom-property-pattern": [/^(q-[a-z0-9-]+|_[a-z0-9-]+)$/, { message: (p) => `--${p}: tokens are --q-*, component locals are --_*` }],
		"scss/load-no-partial-leading-underscore": null,
		"no-descending-specificity": null,
		"selector-not-notation": null,
		"declaration-empty-line-before": null,
		"custom-property-empty-line-before": null,
		"scss/double-slash-comment-empty-line-before": null,
		"comment-empty-line-before": null,
	},
	overrides: [
		{
			// Story stylesheets (src/stories/**, blocks q-sb-*) lay out demos and guideline specimens;
			// they may use raw values where no token fits, as the inline styles they replaced did.
			files: ["src/stories/**"],
			rules: { "scale-unlimited/declaration-strict-value": null },
		},
		{
			// Token, theme and compat files define values (and the compat file keeps the reference names).
			files: ["src/styles/tokens/**", "src/styles/themes/**"],
			rules: { "scale-unlimited/declaration-strict-value": null, "custom-property-pattern": null },
		},
	],
};
