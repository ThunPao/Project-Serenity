<script>
	let { data } = $props();
</script>

Shop Category Page
<div class="grid gap-4">
	{#each data.colla as row}
		<form method="post" action="?/deleteShopCat">
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
