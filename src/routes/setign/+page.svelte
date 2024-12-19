<script>
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
</script>

<PrimeLayer
	title="ตั้งชื่อในเกมส์"
	linkPaths={[
		{
			title: 'ตั้งชื่อในเกมส์',
			link: ''
		}
	]}
	subTitle="กรุณาตั้งชื่อในเกมส์"
>
	<form method="post">
		<input type="text" name="playerName" placeholder="พิมพ์ชื่อในเกมส์" />
        <button type="submit" class="variant-filled-primary">Send</button>
	</form>
</PrimeLayer>
