// uno.config.ts
import { defineConfig, presetWind4, presetIcons } from 'unocss';

export default defineConfig({
	content: {
		filesystem: ['src/**/*.{html,js,ts,svelte}']
	},
	presets: [presetWind4(), presetIcons()],
	theme: {
		colors: {
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			primary: 'hsl(var(--primary))',
			'primary-hover': 'hsl(var(--primary-hover))',
			'primary-foreground': 'hsl(var(--primary-foreground))',
			'primary-subtle': 'hsl(var(--primary-subtle))',
			'primary-subtle-hover': 'hsl(var(--primary-subtle-hover))',
			'primary-border': 'hsl(var(--primary-border))',
			secondary: 'hsl(var(--secondary))',
			'secondary-hover': 'hsl(var(--secondary-hover))',
			'secondary-foreground': 'hsl(var(--secondary-foreground))',
			'secondary-subtle': 'hsl(var(--secondary-subtle))',
			'secondary-subtle-hover': 'hsl(var(--secondary-subtle-hover))',
			'secondary-border': 'hsl(var(--secondary-border))',
			destructive: 'hsl(var(--destructive))',
			'destructive-hover': 'hsl(var(--destructive-hover))',
			'destructive-foreground': 'hsl(var(--destructive-foreground))'
		}
	}
});
