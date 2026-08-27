// @unocss-include
import { cva, type VariantProps } from 'class-variance-authority';

export const checkboxVariants = cva(
	'inline-flex shrink-0 items-center justify-center border shadow-sm transition-all duration-200 ease-[cubic-bezier(0.65,0,0.35,1)]',
	{
		variants: {
			size: {
				sm: 'size-4 rounded-sm',
				md: 'size-5 rounded-md',
				lg: 'size-6 rounded-md'
			},
			state: {
				checked: 'border-primary bg-primary text-primary-foreground',
				indeterminate: 'border-primary bg-primary text-primary-foreground',
				unchecked:
					'border-secondary-border bg-secondary-subtle text-transparent group-hover:bg-secondary-subtle-hover'
			}
		},
		defaultVariants: {
			size: 'md',
			state: 'unchecked'
		}
	}
);

export const checkboxIconVariants = cva(
	'transition-all duration-200 ease-[cubic-bezier(0.65,0,0.35,1)]',
	{
		variants: {
			size: {
				sm: 'size-3',
				md: 'size-3.5',
				lg: 'size-4'
			},
			state: {
				checked: 'scale-100 opacity-100',
				indeterminate: 'scale-100 opacity-100',
				unchecked: 'scale-50 opacity-0'
			}
		},
		defaultVariants: {
			size: 'md',
			state: 'unchecked'
		}
	}
);

export type CheckboxState = NonNullable<VariantProps<typeof checkboxVariants>['state']>;
export type CheckboxSize = VariantProps<typeof checkboxVariants>['size'];
