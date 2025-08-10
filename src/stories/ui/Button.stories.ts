/**
 * Button Component Stories
 * 
 * Interactive documentation and testing for the Button component.
 * Demonstrates all variants, sizes, states, and accessibility features.
 */

import type { Meta, StoryObj } from '@storybook/svelte';
import Button from '$lib/components/ui/Button.svelte';

const meta = {
	title: 'UI Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
The Button component is a versatile, accessible button with multiple variants, sizes, and states.
It includes loading states, icon support, and comprehensive keyboard navigation.

## Features
- Multiple variants (primary, secondary, danger, ghost, outline)
- Three sizes (sm, md, lg)
- Loading states with customizable text
- Icon support (before, after, or icon-only)
- Full accessibility support
- Keyboard navigation
- Focus management
				`
			}
		}
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['primary', 'secondary', 'danger', 'ghost', 'outline'],
			description: 'Visual style variant of the button'
		},
		size: {
			control: { type: 'select' },
			options: ['sm', 'md', 'lg'],
			description: 'Size of the button'
		},
		type: {
			control: { type: 'select' },
			options: ['button', 'submit', 'reset'],
			description: 'HTML button type attribute'
		},
		disabled: {
			control: { type: 'boolean' },
			description: 'Whether the button is disabled'
		},
		loading: {
			control: { type: 'boolean' },
			description: 'Whether the button is in loading state'
		},
		loadingText: {
			control: { type: 'text' },
			description: 'Text to show when loading'
		},
		fullWidth: {
			control: { type: 'boolean' },
			description: 'Whether button should take full width'
		},
		iconBefore: {
			control: { type: 'select' },
			options: [undefined, 'plus', 'edit', 'trash', 'save'],
			description: 'Icon to show before text'
		},
		iconAfter: {
			control: { type: 'select' },
			options: [undefined, 'arrow-right', 'external-link'],
			description: 'Icon to show after text'
		},
		iconOnly: {
			control: { type: 'boolean' },
			description: 'Whether to show only icon (no text)'
		},
		onclick: { action: 'clicked' }
	},
	args: {
		variant: 'primary',
		size: 'md',
		type: 'button',
		disabled: false,
		loading: false,
		loadingText: 'Loading...',
		fullWidth: false,
		iconOnly: false
	}
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default button
export const Default: Story = {
	args: {},
	render: (args) => ({
		Component: Button,
		props: args,
		slots: {
			default: 'Click me'
		}
	})
};

// All variants
export const Variants: Story = {
	render: () => ({
		Component: Button,
		props: {},
		slots: {
			default: `
				<div class="flex flex-wrap gap-4">
					<Button variant="primary">Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="danger">Danger</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="outline">Outline</Button>
				</div>
			`
		}
	})
};

// All sizes
export const Sizes: Story = {
	render: () => ({
		Component: Button,
		props: {},
		slots: {
			default: `
				<div class="flex items-center gap-4">
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
				</div>
			`
		}
	})
};

// Loading states
export const LoadingStates: Story = {
	render: () => ({
		Component: Button,
		props: {},
		slots: {
			default: `
				<div class="flex flex-wrap gap-4">
					<Button loading>Loading</Button>
					<Button loading loadingText="Saving...">Save</Button>
					<Button variant="danger" loading loadingText="Deleting...">Delete</Button>
				</div>
			`
		}
	})
};

// With icons
export const WithIcons: Story = {
	render: () => ({
		Component: Button,
		props: {},
		slots: {
			default: `
				<div class="flex flex-wrap gap-4">
					<Button iconBefore="plus">Add Item</Button>
					<Button iconAfter="arrow-right">Continue</Button>
					<Button iconAfter="external-link">Open Link</Button>
					<Button iconBefore="save" variant="secondary">Save</Button>
					<Button iconBefore="trash" variant="danger">Delete</Button>
				</div>
			`
		}
	})
};

// Icon only buttons
export const IconOnly: Story = {
	render: () => ({
		Component: Button,
		props: {},
		slots: {
			default: `
				<div class="flex gap-4">
					<Button iconBefore="plus" iconOnly aria-label="Add item" />
					<Button iconBefore="edit" iconOnly variant="secondary" aria-label="Edit" />
					<Button iconBefore="trash" iconOnly variant="danger" aria-label="Delete" />
				</div>
			`
		}
	})
};

// Disabled states
export const DisabledStates: Story = {
	render: () => ({
		Component: Button,
		props: {},
		slots: {
			default: `
				<div class="flex flex-wrap gap-4">
					<Button disabled>Disabled Primary</Button>
					<Button variant="secondary" disabled>Disabled Secondary</Button>
					<Button variant="danger" disabled>Disabled Danger</Button>
					<Button variant="ghost" disabled>Disabled Ghost</Button>
				</div>
			`
		}
	})
};

// Full width
export const FullWidth: Story = {
	render: () => ({
		Component: Button,
		props: {},
		slots: {
			default: `
				<div class="w-80">
					<Button fullWidth>Full Width Button</Button>
				</div>
			`
		}
	})
};

// Interactive example
export const Interactive: Story = {
	args: {
		variant: 'primary',
		size: 'md'
	},
	render: (args) => ({
		Component: Button,
		props: args,
		slots: {
			default: 'Interactive Button'
		}
	})
};
