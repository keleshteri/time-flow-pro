# Technology Stack & Build System

## Core Framework

- **SvelteKit 2.0+** with static adapter for optimal performance
- **TypeScript 5.0+** with strict mode and comprehensive type definitions
- **TailwindCSS 4.0+** with custom design system and dark mode support
- **Vite 7.0+** with advanced code splitting and tree shaking

## Testing & Quality

- **Vitest** for unit testing with browser environment support
- **Playwright** for end-to-end testing across browsers
- **Storybook** for component documentation and visual testing
- **ESLint + Prettier** with automated formatting and pre-commit hooks

## Development Tools

- **TypeScript** strict configuration with comprehensive interfaces
- **Accessibility**: WCAG 2.1 AA compliance with a11y addon
- **PWA**: Service Worker with intelligent caching and background sync

## Common Commands

### Development

```bash
npm run dev              # Start development server
npm run dev -- --open   # Start dev server and open browser
```

### Building & Preview

```bash
npm run build           # Create production build
npm run preview         # Preview production build
```

### Testing

```bash
npm run test           # Run all tests (unit + e2e)
npm run test:unit      # Run unit tests with Vitest
npm run test:e2e       # Run e2e tests with Playwright
```

### Code Quality

```bash
npm run lint           # Check code style and lint
npm run format         # Format code with Prettier
npm run check          # Type check with svelte-check
npm run check:watch    # Type check in watch mode
```

### Storybook

```bash
npm run storybook      # Start Storybook dev server
npm run build-storybook # Build Storybook for production
```

## Architecture Principles

- **Offline-First**: Full functionality without internet connectivity
- **Component-Driven**: Reusable components with Storybook documentation
- **Type Safety**: Comprehensive TypeScript coverage
- **Performance**: Sub-second load times with intelligent caching
- **Privacy**: Client-side data processing with zero-knowledge architecture
