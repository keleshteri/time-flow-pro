/**
 * Vitest Configuration for TimeFlow Pro
 *
 * Comprehensive testing setup with:
 * - Unit testing for business logic
 * - Component testing with Svelte Testing Library
 * - Browser testing with Playwright
 * - Coverage reporting with detailed metrics
 */

import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), svelte({ hot: !process.env.VITEST })],

	test: {
		// Global test configuration
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup-client.ts'],

		// Test file patterns
		include: ['src/**/*.{test,spec}.{js,ts}', 'src/**/*.{test,spec}.svelte'],
		exclude: ['node_modules', 'dist', '.svelte-kit', 'build', 'e2e/**'],

		// Coverage configuration for quality assurance
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			exclude: [
				'node_modules/',
				'src/stories/**',
				'src/**/*.stories.{js,ts,svelte}',
				'src/**/*.d.ts',
				'**/*.config.{js,ts}',
				'**/vitest-setup-*.ts'
			],
			// Quality gates for professional development
			thresholds: {
				global: {
					branches: 80,
					functions: 80,
					lines: 80,
					statements: 80
				}
			}
		},

		// Performance and reliability settings
		testTimeout: 10000,
		hookTimeout: 10000,
		teardownTimeout: 5000,

		// Reporter configuration
		reporter: ['verbose', 'json', 'html'],
		outputFile: {
			json: './test-results/vitest-results.json',
			html: './test-results/vitest-report.html'
		},

		// Browser testing configuration
		browser: {
			enabled: false, // Enable when needed for specific tests
			name: 'chromium',
			provider: 'playwright',
			headless: true,
			screenshotOnFailure: true
		},

		// Mock configuration
		clearMocks: true,
		restoreMocks: true,
		mockReset: true,

		// Parallel execution for faster testing
		pool: 'threads',
		poolOptions: {
			threads: {
				singleThread: false,
				isolate: true
			}
		}
	},

	// Resolve configuration for testing
	resolve: {
		alias: {
			$lib: new URL('./src/lib', import.meta.url).pathname,
			$app: new URL('./node_modules/@sveltejs/kit/src/runtime/app', import.meta.url).pathname
		}
	}
});
