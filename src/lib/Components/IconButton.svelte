<script>
	import Icon from "@iconify/svelte";

    export let icon;
    export let text;
    export let width = 50;
    export let height = 50;
  </script>
  
  <div class="flex flex-col items-center rounded-lg gap-1 hover:scale-105 duration-200 cursor-pointer active:scale-110 select-none hover:bg-surface-50 w-full p-1">
    <Icon class="text-primary-500" {icon} {width} {height} />
    <span>{text}</span>
  </div>