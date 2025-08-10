import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],

	// Build optimization for TimeFlow Pro
	build: {
		target: 'es2020',
		minify: 'esbuild',
		sourcemap: true,
		rollupOptions: {
			output: {
				// Manual chunks for better caching and loading performance
				manualChunks: (id) => {
					// Vendor chunks for external dependencies
					if (id.includes('node_modules')) {
						if (id.includes('date-fns') || id.includes('uuid')) return 'vendor-utils';
						return 'vendor';
					}

					// Feature chunks for internal modules
					if (id.includes('$lib/components/timer') || id.includes('$lib/stores/timer')) {
						return 'timer';
					}
					if (id.includes('$lib/components/billing') || id.includes('$lib/stores/billing')) {
						return 'billing';
					}
					if (id.includes('$lib/components/charts') || id.includes('$lib/stores/reports')) {
						return 'reports';
					}

					// Return undefined for other modules (default behavior)
					return undefined;
				}
			}
		}
	},

	// Development server optimization
	server: {
		fs: {
			allow: ['..']
		}
	},

	// Dependency optimization
	optimizeDeps: {
		include: ['date-fns', 'uuid']
	},

	// Vitest configuration for comprehensive testing
	test: {
		expect: { requireAssertions: true },
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup-client.ts'],
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
