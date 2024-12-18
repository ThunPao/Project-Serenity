<script>
	import { applyAction, enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
</script>

<form
	method="post"
	use:enhance={({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			if (result.type === 'success') {
				invalidate('app:curSession');
			}
			await applyAction(result);
		};
	}}
>
	<button class="variant-filled-primary btn" type="submit">Submit</button>
</form>
