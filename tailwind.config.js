/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './src/stories/**/*.{js,ts,svelte,mdx}'],

	theme: {
		extend: {
			// TimeFlow Pro brand colors with enhanced palette
			colors: {
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#172554'
				},
				secondary: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
					950: '#020617'
				},
				success: {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
					950: '#052e16'
				},
				warning: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
					950: '#451a03'
				},
				danger: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
					950: '#450a0a'
				},
				info: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
					950: '#082f49'
				}
			},

			// Timer-specific styling
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'bounce-subtle': 'bounce 2s infinite',
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out'
			},

			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},

			// Typography for professional appearance
			fontFamily: {
				mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace']
			},

			// Spacing for consistent layout
			spacing: {
				18: '4.5rem',
				88: '22rem',
				128: '32rem'
			},

			// Box shadows for depth and component states
			boxShadow: {
				timer: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				elevated: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				'button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				input: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
			},

			// Border radius for consistent component styling
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem'
			},

			// Component-specific sizing
			width: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			},
			height: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			},

			// Z-index scale for layering
			zIndex: {
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100'
			}
		}
	},

	// Dark mode support
	darkMode: 'class',

	plugins: [
		// Note: TailwindCSS 4.0 uses @plugin directives in CSS instead of JS plugins
		// See src/app.css for plugin imports
	]
};
