/**
 * Root Layout Configuration
 *
 * This file configures the root layout for TimeFlow Pro,
 * enabling static site generation for all routes.
 */

// Enable prerendering for all routes (required for static adapter)
export const prerender = true;

// Disable server-side rendering since this is a client-side app
export const ssr = false;

// Enable client-side routing
export const csr = true;
