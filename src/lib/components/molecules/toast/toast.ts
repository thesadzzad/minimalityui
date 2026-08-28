// @unocss-include
import { cva, type VariantProps } from 'class-variance-authority';

export const toastVariants = cva('rounded-lg px-4 py-3 shadow-lg', {
	variants: {
		variant: {
			neutral: 'bg-secondary-subtle text-foreground',
			info: 'bg-info-subtle text-info-subtle-foreground',
			warning: 'bg-warning-subtle text-warning-subtle-foreground',
			error: 'bg-destructive-subtle text-destructive-subtle-foreground',
			success: 'bg-success-subtle text-success-subtle-foreground'
		}
	},
	defaultVariants: {
		variant: 'neutral'
	}
});

export type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>;
