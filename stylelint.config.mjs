// quiet's CSS rules: BEM class names under the q- namespace, and no raw design values in
// component styles — every colour, size, space, radius, shadow, duration and z-index is a token.
// Token and theme files define the values, so the strict-value rule doesn't apply there.
const BEM = /^q-[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/;

const TOKENISED = [
	"/color$/", "background", "background-color", "fill", "stroke", "box-shadow", "outline-color",
	"font-size", "font-family", "font-weight", "line-height", "letter-spacing",
	"/^gap$/", "/^(row|column)-gap$/", "/^padding/", "/^margin/", "border-radius", "/^border-(top-|right-|bottom-|left-)?width$/",
	"z-index", "transition-duration", "animation-duration", "transition-timing-function", "animation-timing-function",
];

export default {
	extends: ["stylelint-config-standard-scss"],
	plugins: ["stylelint-declaration-strict-value"],
	rules: {
		"selector-class-pattern": [BEM, { message: (s) => `"${s}" must be BEM: q-block__element--modifier` }],
		"scale-unlimited/declaration-strict-value": [
			TOKENISED,
			{
				ignoreValues: ["0", "auto", "inherit", "initial", "unset", "none", "transparent", "currentColor", "currentcolor", "100%", "50%", "1", "normal", "/^-?var\\(--/", "/^calc\\((?!.*\\d+(px|rem|em)).*var\\(--/"],
				ignoreFunctions: false,
				disableFix: true,
			},
		],
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
			// Token, theme and compat files define values (and the compat file keeps the reference names).
			files: ["src/styles/tokens/**", "src/styles/themes/**"],
			rules: { "scale-unlimited/declaration-strict-value": null, "custom-property-pattern": null },
		},
	],
};
