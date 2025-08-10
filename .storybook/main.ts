/**
 * Storybook Configuration for TimeFlow Pro
 *
 * Component-driven development setup with:
 * - Interactive component documentation
 * - Accessibility testing integration
 * - Visual regression testing
 * - Design system documentation
 * - Component testing with Vitest
 */

import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	// Story file patterns
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],

	// Essential addons for professional development
	addons: [
		// Core functionality
		'@storybook/addon-svelte-csf',
		'@storybook/addon-docs',

		// Visual and interaction testing
		'@chromatic-com/storybook',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest'
	],

	// Framework configuration
	framework: {
		name: '@storybook/sveltekit',
		options: {
			builder: {
				viteConfigPath: './vite.config.ts'
			}
		}
	},

	// TypeScript configuration
	typescript: {
		check: true,
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
		}
	},

	// Documentation configuration
	docs: {
		autodocs: 'tag',
		defaultName: 'Documentation'
	},

	// Static directory for assets
	staticDirs: ['../static'],

	// Core configuration
	core: {
		disableTelemetry: true
	},

	// Features configuration
	features: {
		buildStoriesJson: true,
		storyStoreV7: true
	}
};

export default config;
