<script>
	import { applyAction, enhance } from '$app/forms';

	const { data } = $props();
</script>

Shop Category Page
<div class="grid gap-4">
	{#each data.colla as row}
		<form
			method="post"
			action="?/deleteShopCat"
			use:enhance={({ formElement, formData, action, cancel }) => {
				return async ({ result }) => {
					console.log(result);
					if (result.type === 'failure') {
						console.log('Error: ' + result.status);
					}
					if (result.type === 'success') {
						console.log('Res D');
						console.log(result.data);
					}
					await applyAction(result);
				};
			}}
		>
			<div class="variant-filled-surface badge space-x-4 py-4">
				<div>{row.title}</div>
				<input type="hidden" name="catId" value={row.id} />
				<button type="submit" class="variant-filled-error btn">Delete</button>
			</div>
		</form>
	{/each}
</div>

<form method="POST" action="?/addShopCat" class="space-y-4 p-3">
	<input class="input p-3 text-lg" type="text" name="title" placeholder="Input Title Here" />
	<button class="variant-filled-primary btn" type="submit">Add ShopCat</button>
</form>
