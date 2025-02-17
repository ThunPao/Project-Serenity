<script lang="ts">
	import { TableHandler, Datatable } from '@vincjo/datatables';
	import type { PageData, ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	const table = new TableHandler(data.colla, { rowsPerPage: 50 });
	let editMenu: HTMLDialogElement | null = null;
	let formData = $state({
		id: 0,
		title: ''
	});
</script>

<dialog bind:this={editMenu}>
	<div class="bg-surface-50-900-token p-4">
		<h3>แก้ไข</h3>
		<!-- use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'failure') {
					console.log('Error: ' + result.status);
					alert('Oh no');
				}
				if (result.type === 'success') {
					alert('Yay!');
				} else {
					console.error('Invalid data or fetch failure');
				}
				await applyAction(result);
			};
		}} -->
		<form method="post" action="?/editItem">
			<input type="hidden" name="shopId" value={formData.id} />
			<input
				type="text"
				class="input variant-filled-primary p-3"
				name="title"
				value={formData.title}
			/>
			<button type="submit" class="variant-filled-primary btn">แก้ไข</button>
		</form>
		<button onclick={() => editMenu?.close()} class="btn via-fuchsia-100">Close</button>
	</div>
</dialog>
<div class="px-4">
	<div class="flex gap-4 py-10">
		<div class="w-96 rounded-md bg-white">
			<ul class="prose p-4">
				<li>Home</li>
				<li>ShopItems</li>
				<li>ShopCategory</li>
			</ul>
		</div>
		<div class="h-full w-full rounded-md bg-white">
			<div class="flex items-center justify-between p-4">
				<div class="text-lg">จำนวนสินค้าทั้งหมด {table.rows.length} รายการ</div>
				<button class="variant-filled-primary btn">+ เพิ่มสินค้า</button>
			</div>
			<Datatable basic {table}>
				<table>
					<thead>
						<tr>
							<th>รายการสินค้า</th>
							<th>ราคา</th>
							<th>Command</th>
							<th>กระทำ</th>
						</tr>
					</thead>
					<tbody>
						{#each table.rows as row}
							<tr>
								<td class="w-full">{row.title}</td>
								<td>${row.price.toFixed(2)}</td>
								<td
									>{#each row.itemCommand as item}
										{item.itemCommand}
									{/each}
								</td>
								<td>
									<button
										type="submit"
										class="variant-filled-primary btn"
										onclick={(e) => {
											formData = {
												id: row.id,
												title: row.title
											};
											editMenu?.showModal();
										}}>แก้ไข</button
									>
								</td>
								<td>
									<form
										method="post"
										action="?/delItem"
										use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'failure') {
													console.log('Error: ' + result.status);
												}
												if (result.type === 'success') {
													alert('Yay!');
												} else {
													console.error('Invalid data or fetch failure');
												}
												await applyAction(result);
											};
										}}
									>
										<input type="hidden" name="shopId" value={row.id} />
										<button type="submit" class="variant-filled-error btn">ลบแม่งเลย</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</Datatable>
		</div>
	</div>
</div>
