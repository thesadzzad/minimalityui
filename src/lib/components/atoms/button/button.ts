// @unocss-include
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium shadow-sm transition-all duration-200 ease-in-out outline-none select-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				primary:
					'border border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover',
				secondary:
					'bg-secondary-subtle text-foreground shadow-none hover:bg-secondary-subtle-hover',
				destructive:
					'border border-destructive bg-destructive text-destructive-foreground hover:border-destructive-hover hover:bg-destructive-hover'
			},
			size: {
				sm: 'h-8 px-3 text-xs',
				md: 'h-10 px-4 text-sm',
				lg: 'h-12 px-6 text-base'
			},
			radius: {
				none: 'rounded-none',
				sm: 'rounded-sm',
				md: 'rounded-md',
				lg: 'rounded-lg',
				pill: 'rounded-full'
			},
			content: {
				text: '',
				'icon-text': '',
				icon: 'aspect-square px-0'
			},
			block: {
				true: 'w-full',
				false: ''
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
			radius: 'pill',
			content: 'text',
			block: false
		}
	}
);

export const ButtonCN = buttonVariants;

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
export type ButtonRadius = VariantProps<typeof buttonVariants>['radius'];
export type ButtonContent = VariantProps<typeof buttonVariants>['content'];
