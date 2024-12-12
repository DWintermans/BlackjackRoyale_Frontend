import eslintPluginReact from "eslint-plugin-react";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
	{
		files: ["**/*.{js,jsx,mjs,cjs}"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			react: eslintPluginReact,
			prettier: eslintPluginPrettier,
		},
		rules: {
			"no-unused-vars": "warn",
			"no-console": "warn",
			"react/prop-types": "off",
			"react/jsx-uses-react": "off",
			"prettier/prettier": "error",
			indent: ["warn", "tab"],
		},
	},
	{
		settings: {
			react: {
				version: "detect",
			},
		},
	},
];
