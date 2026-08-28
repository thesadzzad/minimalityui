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
			popover: 'hsl(var(--popover))',
			'popover-foreground': 'hsl(var(--popover-foreground))',
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
			'destructive-foreground': 'hsl(var(--destructive-foreground))',
			'destructive-subtle': 'hsl(var(--destructive-subtle))',
			'destructive-subtle-foreground': 'hsl(var(--destructive-subtle-foreground))',
			'info-subtle': 'hsl(var(--info-subtle))',
			'info-subtle-foreground': 'hsl(var(--info-subtle-foreground))',
			'warning-subtle': 'hsl(var(--warning-subtle))',
			'warning-subtle-foreground': 'hsl(var(--warning-subtle-foreground))',
			'success-subtle': 'hsl(var(--success-subtle))',
			'success-subtle-foreground': 'hsl(var(--success-subtle-foreground))'
		}
	}
});
