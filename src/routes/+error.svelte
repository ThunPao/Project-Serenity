<script>
	import { page } from '$app/stores';
</script>

<div class="container mx-auto">
	<div class="grid items-center justify-center min-h-screen">
		<article class="prose">
			<h1>{$page.status}: {$page.error.message}</h1>
		</article>
	</div>
</div>
