<script lang="ts">
	export let data;
</script>

<!-- Content -->
<div class="container mx-auto border-2 p-3 py-10">
	<div class="space-y-2">
		<div class="xl:flex gap-4">
			<img
				class="border-br-2 max-w-screen-lg rounded-md border-primary-500"
				src="/background/bg.webp"
				alt=""
				draggable="false"
			/>
			<div class="flex xl:grid items-center justify-center gap-2">
				{#each [1, 2, 3] as row}
					<button disabled class="btn h-full w-96 min-h-32 bg-surface-500 text-center shadow-md">
						<div
							class="flex h-full items-center justify-center font-bold text-white"
						>
							CONTENT
						</div>
					</button>
				{/each}
			</div>
		</div>
		<div class="container mx-auto space-y-4">
			<div class="p-2">ค้นหา</div>
			<div class="grid justify-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each data.colla as row}
					<a href={'/view/' + row.catId} class="card-hover rounded-lg shadow-md">
						<div class="card-header">
							<img draggable="false" class="w-96" src={'/items/' + row.imageUrl} alt="1" />
						</div>
						<div class="flex justify-between p-4 card-footer text-surface-400">
							<div>Title</div>
							<div>Content</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
