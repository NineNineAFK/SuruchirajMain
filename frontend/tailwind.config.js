/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		spacing: {
  			'30': '7.5rem'
  		},
  		colors: {
		    'east-side': {
				'50': '#faf8fc',
				'100': '#f4f0f7',
				'200': '#ebe3f1',
				'300': '#dbcde5',
				'400': '#c4add3',
				'500': '#ac8dc0',
				'600': '#9572ab',
				'700': '#7f5d93',
				'800': '#6b4f7a',
				'900': '#574162',
				'950': '#3a2744',
			},

			'tulip-tree': {
    '50': '#fdf9e9',
    '100': '#faf1c7',
    '200': '#f6df92',
    '300': '#f1c753',
    '400': '#ecb333',
    '500': '#db9617',
    '600': '#bd7311',
    '700': '#975211',
    '800': '#7d4216',
    '900': '#6b3618',
    '950': '#3e1b0a',
},


  			mutedrose: '#B8A8A8',
  			ivory: '#F6F5F3',
  			palegold: '#E6BE8A',
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
  		fontFamily: {
  			poppins: [
  				'Poppins',
  				'sans-serif'
  			],
  			heading: [
  				'Cormorant Garamond',
  				'serif'
  			],
  			body: [
  				'Raleway',
  				'sans-serif'
  			],
  			button: [
  				'Droid Sans',
  				'sans-serif'
  			]
  		},
  		animation: {
  			'bounce-slow': 'bounce 2s infinite',
  			shine: 'shine 1s linear forwards'
  		},
  		keyframes: {
  			shine: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('tailwind-scrollbar'),
      require("tailwindcss-animate")
],
}
