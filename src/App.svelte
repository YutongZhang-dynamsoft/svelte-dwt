<script>
	import Dwt from './Dwt.svelte'
	export let title;
</script>

<main>
	<h1>{title}!</h1>
	<p>Visit the <a href="https://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx">our product page</a> to learn more.</p>
	
	<Dwt />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>