<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import 'virtual:uno.css';
	import '$lib/styles/theme.css';
	let { children } = $props();
</script>

{@render children()}
