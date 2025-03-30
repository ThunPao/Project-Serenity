<script lang="ts">
	import { TableHandler, Datatable } from '@vincjo/datatables';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData, ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	let { data }: { data: PageData } = $props();

	const { form } = superForm(data.form);

	const table = new TableHandler(data.colla, { rowsPerPage: 50 });
	let editMenu: HTMLDialogElement | null = null;
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
		<form use:enhance method="POST" action="?/editItem">
			<input type="hidden" name="id" bind:value={$form.id} />
			<input
				type="text"
				class="input variant-filled-primary p-3"
				name="title"
				bind:value={$form.title}
			/>
			<input
				type="text"
				class="input variant-filled-primary p-3"
				name="price"
				bind:value={$form.price}
			/>
			<button type="submit" class="variant-filled-primary btn">แก้ไข</button>
		</form>
		<button onclick={() => editMenu?.close()} class="btn via-fuchsia-100">Close</button>
	</div>
</dialog>
<div class="px-4">
	<div class="gap-4 py-10 lg:flex">
		<div class="bg-base rounded-md">
			<ul class="items-center gap-4 p-4 max-lg:flex">
				<li><Icon icon="mdi:house" width="50" height="50" /></li>
				<li><Icon icon="mdi:shopping" width="50" height="50" /></li>
				<li><Icon icon="mdi:cart" width="50" height="50" /></li>
			</ul>
		</div>
		<div class="h-full w-full rounded-md">
			<div class="flex items-center justify-between p-4">
				<div class="text-lg">จำนวนสินค้าทั้งหมด {table.rows.length} รายการ</div>
				<button class="variant-filled-primary btn">+ เพิ่มสินค้า</button>
			</div>
			<Datatable basic headless {table}>
				<table class="table-compact pl-4">
					<thead>
						<tr>
							<th>รายการสินค้า</th>
							<th>ราคา</th>
							<!-- <th>Command</th> -->
							<th colspan="2">กระทำ</th>
						</tr>
					</thead>
					<tbody>
						{#each table.rows as row}
							<tr>
								<td class="">{row.title}</td>
								<td>${row.price.toFixed(2)}</td>
								<!-- <td
									>{#each row.itemCommand as item}
										{item.itemCommand}
									{/each}
								</td> -->
								<td>
									<button
										type="submit"
										class="variant-filled-primary btn"
										onclick={() => {
											// $form = {
											// 	...row,
											// 	$form.id = row.id
											// }
											$form = row;

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

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		transition: box-shadow 0.3s ease; /* Transition for the table itself */
	}

	th,
	td {
		padding: 12px;
		text-align: left;
		border-bottom: 1px solid #ddd;
		transition:
			background-color 0.3s ease,
			color 0.3s ease; /* Transition for cells */
	}

	tr:hover td {
		/* Target data cells specifically */
		@apply bg-surface-100;
	}

	tr:hover th {
		/* Target header cells specifically */
		/* background-color: #bbdefb; */
		@apply bg-surface-100;
	}
</style>
