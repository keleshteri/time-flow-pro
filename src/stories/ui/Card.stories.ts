/**
 * Card Component Stories
 * 
 * Interactive documentation and testing for the Card component.
 * Demonstrates different variants, padding options, and interactive states.
 */

import type { Meta, StoryObj } from '@storybook/svelte';
import Card from '$lib/components/ui/Card.svelte';
import Button from '$lib/components/ui/Button.svelte';

const meta = {
	title: 'UI Components/Card',
	component: Card,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
The Card component provides a flexible container with consistent spacing, elevation variants,
and support for headers, footers, and interactive states. Perfect for organizing content
into digestible sections.

## Features
- Multiple variants (default, outlined, elevated, filled)
- Flexible padding options (none, sm, md, lg)
- Interactive states (clickable, selected, disabled)
- Header and footer slots
- Keyboard navigation support
- Responsive design
				`
			}
		}
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['default', 'outlined', 'elevated', 'filled'],
			description: 'Visual variant of the card'
		},
		padding: {
			control: { type: 'select' },
			options: ['none', 'sm', 'md', 'lg'],
			description: 'Padding inside the card'
		},
		clickable: {
			control: { type: 'boolean' },
			description: 'Whether card is clickable'
		},
		selected: {
			control: { type: 'boolean' },
			description: 'Whether card is selected'
		},
		disabled: {
			control: { type: 'boolean' },
			description: 'Whether card is disabled'
		},
		onclick: { action: 'clicked' }
	},
	args: {
		variant: 'default',
		padding: 'md',
		clickable: false,
		selected: false,
		disabled: false
	}
} satisfies Meta<Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default card
export const Default: Story = {
	args: {},
	render: (args) => ({
		Component: Card,
		props: args,
		slots: {
			default: `
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Default Card</h3>
				<p class="text-gray-600">
					This is a default card with some content. Cards are great for 
					organizing information into digestible sections.
				</p>
			`
		}
	})
};

// All variants
export const Variants: Story = {
	render: () => ({
		Component: Card,
		props: {},
		slots: {
			default: `
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
					<Card variant="default">
						<h3 class="font-semibold mb-2">Default Card</h3>
						<p class="text-gray-600 text-sm">
							Basic card with subtle border and white background.
						</p>
					</Card>
					
					<Card variant="outlined">
						<h3 class="font-semibold mb-2">Outlined Card</h3>
						<p class="text-gray-600 text-sm">
							Card with a more prominent border for emphasis.
						</p>
					</Card>
					
					<Card variant="elevated">
						<h3 class="font-semibold mb-2">Elevated Card</h3>
						<p class="text-gray-600 text-sm">
							Card with shadow for a floating appearance.
						</p>
					</Card>
					
					<Card variant="filled">
						<h3 class="font-semibold mb-2">Filled Card</h3>
						<p class="text-gray-600 text-sm">
							Card with a subtle background fill.
						</p>
					</Card>
				</div>
			`
		}
	})
};

// Padding options
export const PaddingOptions: Story = {
	render: () => ({
		Component: Card,
		props: {},
		slots: {
			default: `
				<div class="space-y-4 w-full max-w-2xl">
					<Card padding="none" variant="outlined">
						<div class="p-2 bg-blue-50 text-blue-800 text-sm">
							No Padding - Content touches edges
						</div>
					</Card>
					
					<Card padding="sm" variant="outlined">
						<div class="bg-green-50 text-green-800 text-sm -m-3 p-3">
							Small Padding - Compact spacing
						</div>
					</Card>
					
					<Card padding="md" variant="outlined">
						<div class="bg-yellow-50 text-yellow-800 text-sm -m-4 p-4">
							Medium Padding - Default comfortable spacing
						</div>
					</Card>
					
					<Card padding="lg" variant="outlined">
						<div class="bg-purple-50 text-purple-800 text-sm -m-6 p-6">
							Large Padding - Generous spacing for important content
						</div>
					</Card>
				</div>
			`
		}
	})
};

// With header and footer
export const WithHeaderAndFooter: Story = {
	render: () => ({
		Component: Card,
		props: {},
		slots: {
			default: `
				<Card variant="elevated" class="w-full max-w-md">
					<div slot="header" class="flex items-center justify-between">
						<h3 class="text-lg font-semibold text-gray-900">Project Status</h3>
						<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
							Active
						</span>
					</div>
					
					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-gray-600">Progress</span>
							<span class="font-medium">75%</span>
						</div>
						<div class="w-full bg-gray-200 rounded-full h-2">
							<div class="bg-primary-600 h-2 rounded-full" style="width: 75%"></div>
						</div>
						<div class="flex justify-between text-sm text-gray-500">
							<span>Started: Jan 15, 2024</span>
							<span>Due: Mar 30, 2024</span>
						</div>
					</div>
					
					<div slot="footer" class="flex justify-between">
						<Button variant="secondary" size="sm">View Details</Button>
						<Button variant="primary" size="sm">Update Status</Button>
					</div>
				</Card>
			`
		}
	})
};

// Clickable cards
export const ClickableCards: Story = {
	render: () => ({
		Component: Card,
		props: {},
		slots: {
			default: `
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
					<Card clickable variant="outlined" onclick={() => alert('Card 1 clicked!')}>
						<div class="text-center">
							<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
								<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
							<h3 class="font-semibold mb-1">Time Tracking</h3>
							<p class="text-gray-600 text-sm">Track your work hours</p>
						</div>
					</Card>
					
					<Card clickable variant="outlined" onclick={() => alert('Card 2 clicked!')}>
						<div class="text-center">
							<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
								<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
								</svg>
							</div>
							<h3 class="font-semibold mb-1">Reports</h3>
							<p class="text-gray-600 text-sm">Generate detailed reports</p>
						</div>
					</Card>
					
					<Card clickable variant="outlined" onclick={() => alert('Card 3 clicked!')}>
						<div class="text-center">
							<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
								<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
							</div>
							<h3 class="font-semibold mb-1">Settings</h3>
							<p class="text-gray-600 text-sm">Configure your preferences</p>
						</div>
					</Card>
				</div>
			`
		}
	})
};

// Selected and disabled states
export const States: Story = {
	render: () => ({
		Component: Card,
		props: {},
		slots: {
			default: `
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
					<Card clickable>
						<h3 class="font-semibold mb-2">Normal State</h3>
						<p class="text-gray-600 text-sm">
							This card is clickable and in normal state.
						</p>
					</Card>
					
					<Card clickable selected>
						<h3 class="font-semibold mb-2">Selected State</h3>
						<p class="text-gray-600 text-sm">
							This card is selected with a blue ring.
						</p>
					</Card>
					
					<Card clickable disabled>
						<h3 class="font-semibold mb-2">Disabled State</h3>
						<p class="text-gray-600 text-sm">
							This card is disabled and not clickable.
						</p>
					</Card>
				</div>
			`
		}
	})
};

// Interactive example
export const Interactive: Story = {
	args: {
		variant: 'elevated',
		padding: 'md',
		clickable: true
	},
	render: (args) => ({
		Component: Card,
		props: args,
		slots: {
			default: `
				<div class="w-80">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Interactive Card</h3>
					<p class="text-gray-600 mb-4">
						This card responds to the controls in the panel. Try changing 
						the variant, padding, or making it clickable.
					</p>
					<div class="text-sm text-gray-500">
						Use the controls panel to experiment with different properties.
					</div>
				</div>
			`
		}
	})
};
