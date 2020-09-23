import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		title: 'Dynamic Web TWAIN loves Svelte'
	}
});

export default app;