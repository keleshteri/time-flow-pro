/**
 * Storybook Preview Configuration for TimeFlow Pro
 *
 * Global configuration for all stories including:
 * - TailwindCSS styling
 * - Dark mode support
 * - Accessibility testing
 * - Responsive viewports
 * - Background options
 */

import type { Preview } from '@storybook/sveltekit';
import '../src/app.css'; // Import TailwindCSS styles

const preview: Preview = {
	parameters: {
		// Control matchers for automatic control detection
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},

		// Background options for testing components
		backgrounds: {
			default: 'light',
			values: [
				{
					name: 'light',
					value: '#ffffff'
				},
				{
					name: 'dark',
					value: '#1f2937'
				},
				{
					name: 'gray',
					value: '#f3f4f6'
				}
			]
		},

		// Viewport options for responsive testing
		viewport: {
			viewports: {
				mobile: {
					name: 'Mobile',
					styles: {
						width: '375px',
						height: '667px'
					}
				},
				tablet: {
					name: 'Tablet',
					styles: {
						width: '768px',
						height: '1024px'
					}
				},
				desktop: {
					name: 'Desktop',
					styles: {
						width: '1024px',
						height: '768px'
					}
				},
				wide: {
					name: 'Wide Desktop',
					styles: {
						width: '1440px',
						height: '900px'
					}
				}
			}
		},

		// Documentation configuration
		docs: {
			toc: true,
			source: {
				state: 'open'
			}
		},

		// Accessibility testing configuration
		a11y: {
			config: {
				rules: [
					{
						id: 'color-contrast',
						enabled: true
					},
					{
						id: 'focus-order-semantics',
						enabled: true
					},
					{
						id: 'keyboard-navigation',
						enabled: true
					}
				]
			}
		}
	},

	// Global decorators
	decorators: [
		(story) => ({
			Component: story,
			props: {}
		})
	]
};

export default preview;
