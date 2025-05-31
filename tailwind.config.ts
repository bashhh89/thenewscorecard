import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  	extend: {
  		colors: {
  			'sg-bright-green': '#20E28F',
  			'sg-dark-teal': '#103138',
  			'sg-light-mint': '#F3FDF5',
  			'sg-orange': '#FE7F01',
  			'sg-yellow': '#FEC401',
  			'sg-light-blue': '#01CEFE',
  			'sg-bright-yellow': '#FFFF00',
  			'sg-cream-1': '#FFF9F2',
  			'sg-cream-2': '#FFFCF2',
  			'sg-light-blue-bg': '#F5FDFF',
  			'sg-gray': {
  				'100': '#f1f5f5',
  				'200': '#e6ebeb',
  				'300': '#d2dada',
  				'400': '#b8c1c1',
  				'500': '#8d9696',
  				'600': '#677171',
  				'700': '#4b5454',
  				'800': '#333838',
  				'900': '#1a1c1c'
  			},
  			'sg-accent-blue': '#4388dd',
  			'sg-accent-purple': '#a065ff',
  			'sg-accent-coral': '#ff7766',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontSize: {
  			display: [
  				'3rem',
  				{
  					lineHeight: '3.5rem',
  					letterSpacing: '-0.02em',
  					fontWeight: '700'
  				}
  			],
  			'heading-1': [
  				'2.5rem',
  				{
  					lineHeight: '3rem',
  					letterSpacing: '-0.01em',
  					fontWeight: '700'
  				}
  			],
  			'heading-2': [
  				'1.75rem',
  				{
  					lineHeight: '2.25rem',
  					letterSpacing: '-0.01em',
  					fontWeight: '700'
  				}
  			],
  			'heading-3': [
  				'1.25rem',
  				{
  					lineHeight: '1.75rem',
  					fontWeight: '600'
  				}
  			],
  			subtitle: [
  				'1.125rem',
  				{
  					lineHeight: '1.5rem',
  					fontWeight: '500'
  				}
  			],
  			'body-lg': [
  				'1.125rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			body: [
  				'1rem',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			'body-sm': [
  				'0.875rem',
  				{
  					lineHeight: '1.25rem'
  				}
  			],
  			caption: [
  				'0.75rem',
  				{
  					lineHeight: '1rem'
  				}
  			],
  			title: '22px',
  			section: '18px',
  			'title-main': [
  				'2.5rem',
  				{
  					lineHeight: '3rem',
  					letterSpacing: '-0.01em',
  					fontWeight: '700'
  				}
  			],
  			'title-section': [
  				'1.75rem',
  				{
  					lineHeight: '2.125rem',
  					letterSpacing: '-0.01em',
  					fontWeight: '600'
  				}
  			],
  			'title-card': [
  				'1.375rem',
  				{
  					lineHeight: '1.75rem',
  					fontWeight: '600'
  				}
  			],
  			'body-md': [
  				'1rem',
  				{
  					lineHeight: '1.5rem',
  					fontWeight: '400'
  				}
  			],
  			button: [
  				'0.938rem',
  				{
  					lineHeight: '1.25rem',
  					fontWeight: '500',
  					letterSpacing: '0.01em'
  				}
  			]
  		},
  		boxShadow: {
  			'sg-sm': '0 1px 2px rgba(0, 72, 81, 0.05), 0 1px 3px rgba(0, 72, 81, 0.1)',
  			'sg-md': '0 4px 6px -1px rgba(0, 72, 81, 0.05), 0 2px 4px -1px rgba(0, 72, 81, 0.1)',
  			'sg-lg': '0 10px 15px -3px rgba(0, 72, 81, 0.05), 0 4px 6px -2px rgba(0, 72, 81, 0.1)',
  			'sg-xl': '0 20px 25px -5px rgba(0, 72, 81, 0.05), 0 10px 10px -5px rgba(0, 72, 81, 0.1)',
  			'sg-2xl': '0 25px 50px -12px rgba(0, 72, 81, 0.15)',
  			'sg-card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  			'sg-card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
  			'sg-button': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  			'sg-button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  			'sg-sidebar': '0 0 15px rgba(0, 0, 0, 0.05)',
  			'divine-card': '0 8px 24px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(16, 49, 56, 0.04), 0 0 1px rgba(16, 49, 56, 0.1)',
  			'divine-card-hover': '0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(16, 49, 56, 0.06), 0 0 1px rgba(16, 49, 56, 0.1)'
  		},
  		borderRadius: {
  			'sg-sm': '0.375rem',
  			'sg-md': '0.5rem',
  			'sg-lg': '0.75rem',
  			'sg-xl': '1rem',
  			'sg-2xl': '1.5rem',
  			'sg-3xl': '2rem',
  			divine: '1.25rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		transitionProperty: {
  			'sg-transform': 'transform, box-shadow, border-color'
  		},
  		transitionDuration: {
  			'sg-default': '200ms'
  		},
  		transitionTimingFunction: {
  			'sg-ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
  			'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  			'sg-gradient-primary': 'linear-gradient(to right, #103138, #135e69)',
  			'sg-gradient-mint': 'linear-gradient(to bottom right, #F3FDF5, #e6fbf1)',
  			'sg-gradient-card': 'linear-gradient(to bottom right, #ffffff, #F3FDF5)',
  			'divine-gradient': 'linear-gradient(45deg, #20E28F, #01CEFE)',
  			'header-bg-animated': 'linear-gradient(-45deg, #103138, #1E4A53, #135e69, #103138)'
  		},
  		animation: {
  			'sg-fade-in': 'fadeIn 0.3s ease-in-out',
  			'sg-slide-up': 'slideUp 0.3s ease-out',
  			'sg-slide-down': 'slideDown 0.3s ease-out',
  			'divine-bg-shift': 'bgShift 15s ease infinite',
  			'divine-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					transform: 'translateY(10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			slideDown: {
  				'0%': {
  					transform: 'translateY(-10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			bgShift: {
  				'0%': {
  					backgroundPosition: '0% 50%'
  				},
  				'50%': {
  					backgroundPosition: '100% 50%'
  				},
  				'100%': {
  					backgroundPosition: '0% 50%'
  				}
  			},
  			pulse: {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '.7'
  				}
  			}
  		},
  		fontFamily: {
  			'plus-jakarta': [
  				'var(--font-plus-jakarta)',
  				'system-ui',
  				'sans-serif'
  			],
  			'geist-sans': [
  				'var(--font-geist-sans)',
  				'system-ui',
  				'sans-serif'
  			],
  			'geist-mono': [
  				'var(--font-geist-mono)',
  				'monospace'
  			]
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					color: '#103138',
  					a: {
  						color: '#20E28F',
  						'&:hover': {
  							color: '#103138'
  						}
  					},
  					h1: {
  						color: '#103138',
  						fontFamily: 'var(--font-plus-jakarta)',
  						fontWeight: '700'
  					},
  					h2: {
  						color: '#103138',
  						fontFamily: 'var(--font-plus-jakarta)',
  						fontWeight: '600'
  					},
  					h3: {
  						color: '#103138',
  						fontFamily: 'var(--font-plus-jakarta)',
  						fontWeight: '600'
  					},
  					h4: {
  						color: '#103138',
  						fontFamily: 'var(--font-plus-jakarta)',
  						fontWeight: '600'
  					},
  					strong: {
  						color: '#103138',
  						fontWeight: '600'
  					},
  					blockquote: {
  						color: '#103138',
  						borderLeftColor: '#20E28F'
  					},
  					'ul > li::before': {
  						backgroundColor: '#20E28F'
  					},
  					hr: {
  						borderColor: '#F3FDF5'
  					},
  					pre: {
  						backgroundColor: '#103138'
  					},
  					code: {
  						color: '#103138'
  					}
  				}
  			}
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/typography'),
      require("tailwindcss-animate")
],
};

export default config; 