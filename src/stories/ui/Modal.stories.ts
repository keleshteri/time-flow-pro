/**
 * Modal Component Stories
 * 
 * Interactive documentation and testing for the Modal component.
 * Demonstrates different sizes, behaviors, and accessibility features.
 */

import type { Meta, StoryObj } from '@storybook/svelte';
import Modal from '$lib/components/ui/Modal.svelte';
import Button from '$lib/components/ui/Button.svelte';

const meta = {
	title: 'UI Components/Modal',
	component: Modal,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
The Modal component provides a comprehensive dialog solution with focus management,
keyboard navigation, and accessibility features. It supports different sizes and
customizable behavior for various use cases.

## Features
- Multiple sizes (sm, md, lg, xl, full)
- Focus management and focus trapping
- Keyboard navigation (ESC to close)
- Backdrop click handling
- Scroll lock prevention
- Full accessibility support
- Customizable header and footer slots
				`
			}
		}
	},
	tags: ['autodocs'],
	argTypes: {
		open: {
			control: { type: 'boolean' },
			description: 'Whether modal is open'
		},
		size: {
			control: { type: 'select' },
			options: ['sm', 'md', 'lg', 'xl', 'full'],
			description: 'Size of the modal'
		},
		title: {
			control: { type: 'text' },
			description: 'Modal title'
		},
		showClose: {
			control: { type: 'boolean' },
			description: 'Whether to show close button'
		},
		closeOnBackdrop: {
			control: { type: 'boolean' },
			description: 'Whether clicking backdrop closes modal'
		},
		closeOnEscape: {
			control: { type: 'boolean' },
			description: 'Whether pressing ESC closes modal'
		},
		preventScroll: {
			control: { type: 'boolean' },
			description: 'Whether to prevent body scroll when open'
		}
	},
	args: {
		open: false,
		size: 'md',
		title: '',
		showClose: true,
		closeOnBackdrop: true,
		closeOnEscape: true,
		preventScroll: true
	}
} satisfies Meta<Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic modal
export const Basic: Story = {
	args: {
		title: 'Basic Modal',
		open: true
	},
	render: (args) => ({
		Component: Modal,
		props: args,
		slots: {
			default: `
				<p class="text-gray-600">
					This is a basic modal with a title and some content. 
					You can close it by clicking the X button, pressing ESC, 
					or clicking outside the modal.
				</p>
			`
		}
	})
};

// All sizes
export const Sizes: Story = {
	render: () => ({
		Component: Modal,
		props: {},
		slots: {
			default: `
				<div class="space-y-4">
					<div class="flex flex-wrap gap-2">
						<Button onclick={() => document.getElementById('modal-sm').open = true}>
							Small Modal
						</Button>
						<Button onclick={() => document.getElementById('modal-md').open = true}>
							Medium Modal
						</Button>
						<Button onclick={() => document.getElementById('modal-lg').open = true}>
							Large Modal
						</Button>
						<Button onclick={() => document.getElementById('modal-xl').open = true}>
							XL Modal
						</Button>
						<Button onclick={() => document.getElementById('modal-full').open = true}>
							Full Modal
						</Button>
					</div>
					
					<Modal id="modal-sm" size="sm" title="Small Modal">
						<p>This is a small modal. Perfect for simple confirmations.</p>
					</Modal>
					
					<Modal id="modal-md" size="md" title="Medium Modal">
						<p>This is a medium modal. Good for most use cases with moderate content.</p>
					</Modal>
					
					<Modal id="modal-lg" size="lg" title="Large Modal">
						<p>This is a large modal. Suitable for forms or detailed content that needs more space.</p>
					</Modal>
					
					<Modal id="modal-xl" size="xl" title="Extra Large Modal">
						<p>This is an extra large modal. Perfect for complex forms, data tables, or rich content.</p>
					</Modal>
					
					<Modal id="modal-full" size="full" title="Full Screen Modal">
						<p>This is a full screen modal. Takes up most of the viewport for immersive experiences.</p>
					</Modal>
				</div>
			`
		}
	})
};

// With custom header and footer
export const WithHeaderAndFooter: Story = {
	args: {
		open: true
	},
	render: (args) => ({
		Component: Modal,
		props: args,
		slots: {
			header: `
				<div class="flex items-center space-x-3">
					<div class="flex-shrink-0">
						<svg class="h-6 w-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-medium text-gray-900">Delete Project</h3>
						<p class="text-sm text-gray-500">This action cannot be undone</p>
					</div>
				</div>
			`,
			default: `
				<p class="text-gray-600">
					Are you sure you want to delete this project? All associated data, 
					including time entries and reports, will be permanently removed. 
					This action cannot be undone.
				</p>
			`,
			footer: `
				<Button variant="secondary" onclick={() => args.open = false}>
					Cancel
				</Button>
				<Button variant="danger" onclick={() => args.open = false}>
					Delete Project
				</Button>
			`
		}
	})
};

// Confirmation dialog
export const ConfirmationDialog: Story = {
	args: {
		open: true,
		size: 'sm',
		title: 'Confirm Action'
	},
	render: (args) => ({
		Component: Modal,
		props: args,
		slots: {
			default: `
				<p class="text-gray-600">
					Are you sure you want to perform this action?
				</p>
			`,
			footer: `
				<Button variant="secondary" onclick={() => args.open = false}>
					Cancel
				</Button>
				<Button variant="primary" onclick={() => args.open = false}>
					Confirm
				</Button>
			`
		}
	})
};

// Form modal
export const FormModal: Story = {
	args: {
		open: true,
		size: 'lg',
		title: 'Create New Project'
	},
	render: (args) => ({
		Component: Modal,
		props: args,
		slots: {
			default: `
				<form class="space-y-4">
					<Input 
						label="Project Name" 
						placeholder="Enter project name..." 
						required 
					/>
					<Input 
						label="Client" 
						placeholder="Enter client name..." 
					/>
					<Input 
						type="textarea" 
						label="Description" 
						placeholder="Enter project description..." 
						rows="3"
					/>
					<div class="grid grid-cols-2 gap-4">
						<Input 
							type="date" 
							label="Start Date" 
						/>
						<Input 
							type="date" 
							label="End Date" 
						/>
					</div>
				</form>
			`,
			footer: `
				<Button variant="secondary" onclick={() => args.open = false}>
					Cancel
				</Button>
				<Button variant="primary" onclick={() => args.open = false}>
					Create Project
				</Button>
			`
		}
	})
};

// No close button
export const NoCloseButton: Story = {
	args: {
		open: true,
		title: 'Processing...',
		showClose: false,
		closeOnBackdrop: false,
		closeOnEscape: false
	},
	render: (args) => ({
		Component: Modal,
		props: args,
		slots: {
			default: `
				<div class="text-center py-4">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p class="text-gray-600">
						Please wait while we process your request...
					</p>
				</div>
			`
		}
	})
};

// Interactive example
export const Interactive: Story = {
	args: {
		title: 'Interactive Modal'
	},
	render: (args) => ({
		Component: Modal,
		props: args,
		slots: {
			default: `
				<div>
					<Button onclick={() => args.open = true}>
						Open Modal
					</Button>
					
					<Modal bind:open={args.open} title={args.title}>
						<p class="text-gray-600 mb-4">
							This is an interactive modal. You can control its behavior 
							using the controls panel.
						</p>
						<p class="text-sm text-gray-500">
							Try changing the size, title, or other properties to see 
							how they affect the modal.
						</p>
					</Modal>
				</div>
			`
		}
	})
};
