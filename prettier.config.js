/**
 * Prettier Configuration for TimeFlow Pro
 *
 * Ensures consistent code formatting across the entire project
 * with Svelte-specific optimizations and TailwindCSS class sorting.
 */

/** @type {import('prettier').Config} */
export default {
	// Basic formatting options
	useTabs: true,
	tabWidth: 2,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	semi: true,

	// Plugin configuration
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],

	// Svelte-specific overrides
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte',
				// Svelte-specific formatting
				svelteStrictMode: false,
				svelteBracketNewLine: false,
				svelteAllowShorthand: true,
				svelteIndentScriptAndStyle: true
			}
		},
		{
			files: ['*.ts', '*.js'],
			options: {
				parser: 'typescript'
			}
		},
		{
			files: '*.json',
			options: {
				parser: 'json',
				useTabs: false,
				tabWidth: 2
			}
		},
		{
			files: '*.md',
			options: {
				parser: 'markdown',
				useTabs: false,
				tabWidth: 2,
				proseWrap: 'preserve'
			}
		}
	],

	// TailwindCSS configuration
	tailwindConfig: './tailwind.config.js',
	tailwindFunctions: ['clsx', 'cn', 'cva']
};
