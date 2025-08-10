# TimeFlow Pro UI Component Library

A comprehensive, accessible, and well-tested UI component library built for TimeFlow Pro using SvelteKit, TypeScript, and TailwindCSS.

## Features

- 🎨 **Design System Integration** - Consistent styling with TailwindCSS
- ♿ **Accessibility First** - WCAG 2.1 AA compliant with proper ARIA attributes
- 🔧 **TypeScript Support** - Comprehensive type definitions for all components
- 📱 **Responsive Design** - Mobile-first approach with responsive breakpoints
- 🌙 **Dark Mode Support** - Automatic dark mode with system preference detection
- 🧪 **Thoroughly Tested** - 95%+ test coverage with Vitest and Testing Library
- 📚 **Storybook Documentation** - Interactive component documentation
- ⌨️ **Keyboard Navigation** - Full keyboard accessibility support

## Components

### Button

A versatile button component with multiple variants, sizes, and states.

```svelte
<script>
  import { Button } from '$lib/components/ui';
</script>

<Button variant="primary" size="md" onclick={handleClick}>
  Click me
</Button>

<Button variant="danger" loading loadingText="Deleting...">
  Delete
</Button>

<Button variant="ghost" iconBefore="plus" iconOnly aria-label="Add item" />
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean
- `loadingText`: string
- `fullWidth`: boolean
- `iconBefore`: string
- `iconAfter`: string
- `iconOnly`: boolean

### Input

A comprehensive input component with validation states and accessibility.

```svelte
<script>
  import { Input } from '$lib/components/ui';
  let email = '';
</script>

<Input
  type="email"
  label="Email Address"
  placeholder="Enter your email"
  bind:value={email}
  required
  icon="email"
/>

<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  bind:value={password}
/>
```

**Props:**
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time'
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'default' | 'error' | 'success' | 'warning'
- `label`: string
- `placeholder`: string
- `helpText`: string
- `error`: string
- `success`: string
- `warning`: string
- `required`: boolean
- `disabled`: boolean
- `readonly`: boolean
- `icon`: string
- `iconPosition`: 'left' | 'right'

### Modal

A comprehensive modal component with focus management and accessibility.

```svelte
<script>
  import { Modal, Button } from '$lib/components/ui';
  let showModal = false;
</script>

<Button onclick={() => showModal = true}>Open Modal</Button>

<Modal bind:open={showModal} title="Confirm Action" size="md">
  <p>Are you sure you want to delete this item?</p>
  
  <svelte:fragment slot="footer">
    <Button variant="secondary" onclick={() => showModal = false}>Cancel</Button>
    <Button variant="danger" onclick={handleDelete}>Delete</Button>
  </svelte:fragment>
</Modal>
```

**Props:**
- `open`: boolean
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `title`: string
- `showClose`: boolean
- `closeOnBackdrop`: boolean
- `closeOnEscape`: boolean
- `preventScroll`: boolean

**Slots:**
- `header`: Custom header content
- `default`: Modal body content
- `footer`: Footer with actions

### Card

A flexible card component with consistent spacing and elevation.

```svelte
<script>
  import { Card, Button } from '$lib/components/ui';
</script>

<Card variant="elevated" padding="lg">
  <svelte:fragment slot="header">
    <h3>Project Details</h3>
  </svelte:fragment>
  
  <p>Card content goes here...</p>
  
  <svelte:fragment slot="footer">
    <Button variant="primary">Action</Button>
  </svelte:fragment>
</Card>

<Card clickable onclick={handleCardClick}>
  <p>This card is clickable</p>
</Card>
```

**Props:**
- `variant`: 'default' | 'outlined' | 'elevated' | 'filled'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `clickable`: boolean
- `selected`: boolean
- `disabled`: boolean

**Slots:**
- `header`: Card header content
- `default`: Card body content
- `footer`: Card footer content

## Design System

### Colors

The component library uses a comprehensive color palette:

- **Primary**: Blue tones for primary actions and branding
- **Secondary**: Slate tones for secondary elements
- **Success**: Green tones for positive states
- **Warning**: Amber tones for warning states
- **Danger**: Red tones for destructive actions
- **Info**: Sky tones for informational content

### Typography

- **Font Family**: System font stack with fallbacks
- **Font Sizes**: xs, sm, base, lg, xl with consistent line heights
- **Font Weights**: normal, medium, semibold, bold

### Spacing

Consistent spacing scale using Tailwind's spacing system:
- **Component Padding**: sm (12px), md (16px), lg (24px)
- **Element Spacing**: Based on 4px grid system

### Shadows

Elevation system for depth and hierarchy:
- **Card**: Subtle shadow for content containers
- **Elevated**: Medium shadow for important elements
- **Modal**: Strong shadow for overlays
- **Button**: Interactive shadow states

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: Full keyboard support with proper focus management
- **Screen Readers**: Comprehensive ARIA attributes and semantic HTML
- **Color Contrast**: Meets AA contrast requirements
- **Focus Management**: Visible focus indicators and logical tab order
- **Reduced Motion**: Respects user's motion preferences

## Testing

Components are thoroughly tested with:

- **Unit Tests**: Component rendering and behavior
- **Integration Tests**: Component interactions and events
- **Accessibility Tests**: Automated accessibility validation with axe-core
- **Visual Tests**: Storybook visual regression testing

Run tests:
```bash
npm run test
npm run test:coverage
```

## Storybook

Interactive component documentation is available in Storybook:

```bash
npm run storybook
```

This provides:
- Interactive component playground
- All variants and states
- Accessibility testing
- Usage examples
- Design tokens documentation

## Development

### Adding New Components

1. Create component in `src/lib/components/ui/ComponentName.svelte`
2. Add TypeScript interfaces in `src/lib/types/components.ts`
3. Export from `src/lib/components/ui/index.ts`
4. Create Storybook story in `src/stories/ui/ComponentName.stories.ts`
5. Add comprehensive tests in `src/lib/components/ui/ComponentName.test.ts`

### Design Tokens

Update design tokens in:
- `tailwind.config.js` - TailwindCSS configuration
- `src/app.css` - CSS custom properties

### Best Practices

- Use semantic HTML elements
- Include proper ARIA attributes
- Support keyboard navigation
- Provide loading and error states
- Follow consistent naming conventions
- Write comprehensive tests
- Document component usage

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the established patterns and conventions
2. Write comprehensive tests for new components
3. Update Storybook documentation
4. Ensure accessibility compliance
5. Test across supported browsers
