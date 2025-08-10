/**
 * Playwright Configuration for TimeFlow Pro
 *
 * Comprehensive end-to-end testing setup with:
 * - Cross-browser testing (Chrome, Firefox, Safari, Edge)
 * - Mobile device simulation
 * - Visual regression testing
 * - Performance monitoring
 * - Accessibility testing
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	// Test directory and file patterns
	testDir: './e2e',
	testMatch: '**/*.{test,spec}.{js,ts}',

	// Global test settings
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,

	// Reporter configuration for detailed results
	reporter: [
		['html', { outputFolder: 'playwright-report' }],
		['json', { outputFile: 'test-results/playwright-results.json' }],
		['junit', { outputFile: 'test-results/playwright-junit.xml' }],
		process.env.CI ? ['github'] : ['list']
	],

	// Global test configuration
	use: {
		// Base URL for all tests
		baseURL: 'http://localhost:4173',

		// Browser context settings
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',

		// Accessibility and performance
		colorScheme: 'light',
		locale: 'en-US',
		timezoneId: 'America/New_York',

		// Network and timeout settings
		actionTimeout: 10000,
		navigationTimeout: 30000
	},

	// Test projects for different browsers and devices
	projects: [
		// Desktop browsers
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] }
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] }
		},
		{
			name: 'edge',
			use: { ...devices['Desktop Edge'], channel: 'msedge' }
		},

		// Mobile devices for responsive testing
		{
			name: 'Mobile Chrome',
			use: { ...devices['Pixel 5'] }
		},
		{
			name: 'Mobile Safari',
			use: { ...devices['iPhone 12'] }
		},

		// Tablet testing
		{
			name: 'iPad',
			use: { ...devices['iPad Pro'] }
		}
	],

	// Development server configuration
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI,
		timeout: 120000
	},

	// Output directories
	outputDir: 'test-results/playwright-artifacts',

	// Global setup and teardown
	globalSetup: undefined, // Can be added for database setup, etc.
	globalTeardown: undefined // Can be added for cleanup
});
