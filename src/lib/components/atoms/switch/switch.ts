// @unocss-include
import { cva, type VariantProps } from 'class-variance-authority';

export const switchVariants = cva(
	'inline-flex shrink-0 cursor-pointer items-center rounded-full border border-secondary-border outline-none transition-colors duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] select-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			size: {
				sm: 'h-5 w-9 p-0.5',
				md: 'h-6 w-11 p-0.5',
				lg: 'h-8 w-14 p-1'
			},
			checked: {
				true: 'border-primary bg-primary',
				false: 'bg-secondary-subtle hover:bg-secondary-subtle-hover'
			}
		},
		defaultVariants: {
			size: 'md',
			checked: false
		}
	}
);

export const switchThumbVariants = cva(
	'pointer-events-none block rounded-full shadow-sm transition-all duration-200 ease-[cubic-bezier(0.65,0,0.35,1)]',
	{
		variants: {
			size: {
				sm: 'size-4',
				md: 'size-5',
				lg: 'size-6'
			},
			checked: {
				true: 'bg-primary-foreground',
				false: 'translate-x-0 bg-foreground'
			}
		},
		compoundVariants: [
			{ size: 'sm', checked: true, class: 'translate-x-4' },
			{ size: 'md', checked: true, class: 'translate-x-5' },
			{ size: 'lg', checked: true, class: 'translate-x-6' }
		],
		defaultVariants: {
			size: 'md',
			checked: false
		}
	}
);

export type SwitchSize = VariantProps<typeof switchVariants>['size'];
