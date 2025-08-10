/**
 * Basic Navigation E2E Tests
 *
 * End-to-end tests for basic application navigation and functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
	test('should load the homepage successfully', async ({ page }) => {
		await page.goto('/');

		// Check that the page loads
		await expect(page).toHaveTitle(/TimeFlow Pro/);

		// Check for main heading
		await expect(page.getByRole('heading', { name: 'Welcome to TimeFlow Pro' })).toBeVisible();

		// Check for navigation elements
		await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Timer' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Tasks' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Billing' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
	});

	test('should navigate to timer page', async ({ page }) => {
		await page.goto('/');

		// Click on Timer navigation link
		await page.getByRole('link', { name: 'Timer' }).click();

		// Check that we're on the timer page
		await expect(page).toHaveURL('/timer');
		await expect(page.getByRole('heading', { name: 'Timer' })).toBeVisible();
	});

	test('should have working dark mode toggle', async ({ page }) => {
		await page.goto('/');

		// Check initial state (should be light mode by default)
		const html = page.locator('html');
		await expect(html).not.toHaveClass(/dark/);

		// Click dark mode toggle
		await page.getByRole('button', { name: /switch to dark mode/i }).click();

		// Check that dark mode is applied
		await expect(html).toHaveClass(/dark/);

		// Click again to switch back to light mode
		await page.getByRole('button', { name: /switch to light mode/i }).click();

		// Check that light mode is restored
		await expect(html).not.toHaveClass(/dark/);
	});

	test('should have accessible navigation', async ({ page }) => {
		await page.goto('/');

		// Check for skip link
		const skipLink = page.getByRole('link', { name: 'Skip to main content' });
		await expect(skipLink).toBeInTheDocument();

		// Check that navigation has proper ARIA label
		const nav = page.getByRole('navigation', { name: 'Main navigation' });
		await expect(nav).toBeVisible();

		// Check that buttons have proper ARIA labels
		const darkModeButton = page.getByRole('button', { name: /switch to.*mode/i });
		await expect(darkModeButton).toBeVisible();

		const settingsButton = page.getByRole('link', { name: 'Settings' });
		await expect(settingsButton).toBeVisible();
	});

	test('should display correct meta information', async ({ page }) => {
		await page.goto('/');

		// Check page title
		await expect(page).toHaveTitle('Dashboard - TimeFlow Pro');

		// Check meta description
		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute(
			'content',
			'Your professional time tracking dashboard'
		);
	});

	test('should be responsive on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Check that the page is still functional on mobile
		await expect(page.getByRole('heading', { name: 'Welcome to TimeFlow Pro' })).toBeVisible();

		// Check that stats cards are visible (should stack on mobile)
		await expect(page.getByText('Today')).toBeVisible();
		await expect(page.getByText('This Week')).toBeVisible();
		await expect(page.getByText('Active Projects')).toBeVisible();
		await expect(page.getByText('Pending Tasks')).toBeVisible();
	});

	test('should have working footer', async ({ page }) => {
		await page.goto('/');

		// Scroll to footer
		await page.locator('footer').scrollIntoViewIfNeeded();

		// Check footer content
		await expect(
			page.getByText('© 2024 TimeFlow Pro. Professional time tracking made simple.')
		).toBeVisible();
		await expect(page.getByText('Version 2.0.0')).toBeVisible();
	});
});
