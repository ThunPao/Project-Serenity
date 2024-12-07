<script>
	import { page } from '$app/stores';
  </script>
  
  <div class="container mx-auto flex items-center justify-center pt-20">
	<div class="text-center space-y-8">
	  <div class="inline-flex items-center space-x-4 text-6xl font-bold text-red-500">
		<!-- Error Code -->
		{#each String($page.status).slice(0, 4) as row}
		  <span class="border border-red-500 rounded-lg p-4 shadow-lg">
			{row}
		  </span>
		{/each}
	  </div>
  
	  <!-- Error Message -->
	  <p class="text-xl text-gray-700">
		{$page.error?.message || "An unexpected error occurred. Please try again later."}
	  </p>
  
	  <!-- Back to Home Button -->
	  <a 
		href="/" 
		class="btn variant-filled-primary"
	  >
		กลับหน้าหลัก
	  </a>
	</div>
  </div>
  