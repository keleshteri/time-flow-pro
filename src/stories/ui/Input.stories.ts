/**
 * Input Component Stories
 * 
 * Interactive documentation and testing for the Input component.
 * Demonstrates all input types, validation states, and accessibility features.
 */

import type { Meta, StoryObj } from '@storybook/svelte';
import Input from '$lib/components/ui/Input.svelte';

const meta = {
	title: 'UI Components/Input',
	component: Input,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
The Input component is a comprehensive form input with validation states, icons, and accessibility.
It supports various input types, validation feedback, and proper ARIA attributes.

## Features
- Multiple input types (text, email, password, number, etc.)
- Validation states (error, success, warning)
- Icon support with positioning
- Help text and validation messages
- Full accessibility support
- Responsive design
				`
			}
		}
	},
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: { type: 'select' },
			options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time'],
			description: 'HTML input type'
		},
		size: {
			control: { type: 'select' },
			options: ['sm', 'md', 'lg'],
			description: 'Size of the input'
		},
		variant: {
			control: { type: 'select' },
			options: ['default', 'error', 'success', 'warning'],
			description: 'Visual variant of the input'
		},
		value: {
			control: { type: 'text' },
			description: 'Input value'
		},
		placeholder: {
			control: { type: 'text' },
			description: 'Placeholder text'
		},
		label: {
			control: { type: 'text' },
			description: 'Input label'
		},
		helpText: {
			control: { type: 'text' },
			description: 'Help text to show below input'
		},
		error: {
			control: { type: 'text' },
			description: 'Error message to show'
		},
		success: {
			control: { type: 'text' },
			description: 'Success message to show'
		},
		warning: {
			control: { type: 'text' },
			description: 'Warning message to show'
		},
		required: {
			control: { type: 'boolean' },
			description: 'Whether input is required'
		},
		disabled: {
			control: { type: 'boolean' },
			description: 'Whether input is disabled'
		},
		readonly: {
			control: { type: 'boolean' },
			description: 'Whether input is readonly'
		},
		icon: {
			control: { type: 'select' },
			options: [undefined, 'search', 'email', 'lock', 'user', 'calendar', 'clock'],
			description: 'Icon to show in input'
		},
		iconPosition: {
			control: { type: 'select' },
			options: ['left', 'right'],
			description: 'Icon position'
		}
	},
	args: {
		type: 'text',
		size: 'md',
		variant: 'default',
		value: '',
		placeholder: '',
		label: '',
		helpText: '',
		error: '',
		success: '',
		warning: '',
		required: false,
		disabled: false,
		readonly: false,
		iconPosition: 'left'
	}
} satisfies Meta<Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default input
export const Default: Story = {
	args: {
		label: 'Default Input',
		placeholder: 'Enter text...'
	}
};

// All sizes
export const Sizes: Story = {
	render: () => ({
		Component: Input,
		props: {},
		slots: {
			default: `
				<div class="space-y-4 w-80">
					<Input size="sm" label="Small Input" placeholder="Small input..." />
					<Input size="md" label="Medium Input" placeholder="Medium input..." />
					<Input size="lg" label="Large Input" placeholder="Large input..." />
				</div>
			`
		}
	})
};

// Input types
export const InputTypes: Story = {
	render: () => ({
		Component: Input,
		props: {},
		slots: {
			default: `
				<div class="space-y-4 w-80">
					<Input type="text" label="Text" placeholder="Enter text..." />
					<Input type="email" label="Email" placeholder="Enter email..." />
					<Input type="password" label="Password" placeholder="Enter password..." />
					<Input type="number" label="Number" placeholder="Enter number..." />
					<Input type="tel" label="Phone" placeholder="Enter phone..." />
					<Input type="url" label="URL" placeholder="Enter URL..." />
					<Input type="search" label="Search" placeholder="Search..." />
					<Input type="date" label="Date" />
					<Input type="time" label="Time" />
				</div>
			`
		}
	})
};

// Validation states
export const ValidationStates: Story = {
	render: () => ({
		Component: Input,
		props: {},
		slots: {
			default: `
				<div class="space-y-4 w-80">
					<Input 
						label="Default State" 
						placeholder="Enter text..." 
						helpText="This is help text"
					/>
					<Input 
						label="Success State" 
						value="valid@example.com"
						success="Email is valid"
					/>
					<Input 
						label="Warning State" 
						value="test"
						warning="Password should be longer"
					/>
					<Input 
						label="Error State" 
						value="invalid-email"
						error="Please enter a valid email address"
					/>
				</div>
			`
		}
	})
};

// With icons
export const WithIcons: Story = {
	render: () => ({
		Component: Input,
		props: {},
		slots: {
			default: `
				<div class="space-y-4 w-80">
					<Input 
						type="search" 
						label="Search" 
						placeholder="Search..." 
						icon="search"
						iconPosition="left"
					/>
					<Input 
						type="email" 
						label="Email" 
						placeholder="Enter email..." 
						icon="email"
						iconPosition="left"
					/>
					<Input 
						type="password" 
						label="Password" 
						placeholder="Enter password..." 
						icon="lock"
						iconPosition="left"
					/>
					<Input 
						type="date" 
						label="Date" 
						icon="calendar"
						iconPosition="right"
					/>
					<Input 
						type="time" 
						label="Time" 
						icon="clock"
						iconPosition="right"
					/>
				</div>
			`
		}
	})
};

// Required fields
export const RequiredFields: Story = {
	render: () => ({
		Component: Input,
		props: {},
		slots: {
			default: `
				<div class="space-y-4 w-80">
					<Input 
						label="Required Field" 
						placeholder="This field is required..." 
						required
						helpText="This field is required"
					/>
					<Input 
						type="email" 
						label="Email Address" 
						placeholder="Enter your email..." 
						required
						icon="email"
					/>
				</div>
			`
		}
	})
};

// Disabled and readonly
export const DisabledAndReadonly: Story = {
	render: () => ({
		Component: Input,
		props: {},
		slots: {
			default: `
				<div class="space-y-4 w-80">
					<Input 
						label="Disabled Input" 
						value="This input is disabled"
						disabled
					/>
					<Input 
						label="Readonly Input" 
						value="This input is readonly"
						readonly
						helpText="This field cannot be edited"
					/>
				</div>
			`
		}
	})
};

// Interactive example
export const Interactive: Story = {
	args: {
		label: 'Interactive Input',
		placeholder: 'Type something...',
		helpText: 'This input responds to your changes'
	}
};
