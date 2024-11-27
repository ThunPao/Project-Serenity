<script lang="ts">
	export let data;
	const { title, imageUrl } = data.colla;
</script>

<div class="container mx-auto">
	<div class="card">
		<div class="flex justify-center py-2">
			<!-- src={'/items/' + imageUrl} -->
			<img
				draggable="false"
				class="w-96 duration-100 active:scale-105"
				src="/items/coalore.webp"
				alt="1"
			/>
		</div>

		{title}
	</div>
</div>
