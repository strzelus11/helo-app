// eslint.config.mjs
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";

/**
 * Only lint our source code, not build output or deps.
 * Adjust the globs if you keep code at the root (no src/).
 */
const FILES = [
	"app/**/*.{ts,tsx}",
	"features/**/*.{ts,tsx}",
	"shared/**/*.{ts,tsx}",
	"entities/**/*.{ts,tsx}",
	"workers/**/*.{ts,tsx}",
	"scripts/**/*.{ts,tsx}",
];

export default [
	// 0) Ignore junk folders completely
	{
		ignores: [
			"**/node_modules/**",
			".next/**",
			".vercel/**",
			"coverage/**",
			"public/**",
			"dist/**",
			"build/**",
			// optional: generated types or vendor code
			"**/*.d.ts",
		],
	},

	// 1) Base JS rules (kept minimal)
	js.configs.recommended,

	// 2) Next.js recommended rules (lightweight)
	{
		plugins: { "@next/next": nextPlugin },
		rules: {
			...nextPlugin.configs.recommended.rules,
		},
	},

	// 3) TypeScript & React Hooks rules for our code only
	{
		files: FILES,
		languageOptions: {
			parser: tsParser,
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		plugins: {
			"@typescript-eslint": ts,
			"react-hooks": reactHooks,
			import: importPlugin,
			"unused-imports": unusedImports,
		},
		rules: {
			// Keep strict, but not noisy:
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": "off", // prefer plugin below
			"unused-imports/no-unused-imports": "error",

			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",

			// Import hygiene (mild)
			"import/order": [
				"warn",
				{ "newlines-between": "always", alphabetize: { order: "asc" } },
			],
			"import/no-unresolved": "off", // TS handles this; enable resolver if you prefer

			// Prefer `type` over `interface` for props
			"@typescript-eslint/consistent-type-definitions": ["warn", "type"],

			// Defer style concerns to Prettier
			...prettier.rules,

			"no-undef": "off",
			"no-unused-vars": "off",
		},
	},

	// 4) Relax everything for config files (JS/TS at repo root)
	{
		files: ["*.{js,cjs,mjs,ts}"],
		languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: false } } },
		rules: {
			"unused-imports/no-unused-imports": "off",
		},
	},
];
