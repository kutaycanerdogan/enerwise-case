/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				border: "oklch(var(--border))",
				input: "oklch(var(--input))",
				ring: "oklch(var(--ring))",
				background: "oklch(var(--background))",
				foreground: "oklch(var(--foreground))",
				primary: {
					DEFAULT: "oklch(var(--primary))",
					foreground: "oklch(var(--primary-foreground))",
				},
				muted: {
					DEFAULT: "oklch(var(--muted))",
					foreground: "oklch(var(--muted-foreground))",
				},
				chart: {
					1: "oklch(var(--chart-1))",
					2: "oklch(var(--chart-2))",
					3: "oklch(var(--chart-3))",
					4: "oklch(var(--chart-4))",
					5: "oklch(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "oklch(var(--sidebar))",
					foreground: "oklch(var(--sidebar-foreground))",
					primary: "oklch(var(--sidebar-primary))",
					"primary-foreground": "oklch(var(--sidebar-primary-foreground))",
					accent: "oklch(var(--sidebar-accent))",
					"accent-foreground": "oklch(var(--sidebar-accent-foreground))",
					border: "oklch(var(--sidebar-border))",
					ring: "oklch(var(--sidebar-ring))",
				},
			},
			gridTemplateColumns: {
				12: "repeat(12, minmax(0, 1fr))",
				8: "repeat(8, minmax(0, 1fr))",
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp"), require("tailwindcss-animate")],
};
