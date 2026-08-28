import type { Snippet } from 'svelte';
import type { ToastVariant } from '../toast/toast.js';

export interface ToastItem {
	id: string | number;
	title: string;
	description?: string;
	variant?: ToastVariant;
	icon?: Snippet;
	action?: Snippet;
	duration?: number;
}
