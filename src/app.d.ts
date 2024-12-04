// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '*.svx' {
	import { SvelteComponentTyped } from 'svelte';
	export default class MDsveXComponent extends SvelteComponentTyped<
		Record<string, any>,
		Record<string, any>,
		Record<string, any>
	> {}
}

export {};
