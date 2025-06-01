<script>
	import '../app.css';
  import Notification from '$lib/components/Notification.svelte';
	
	let { children } = $props();
  const bgGradient = "bg-gradient-to-r from-gray-700 via-gray-900 to-black"

</script>

<div class="text-white {bgGradient}">
{@render children()}

</div>

<Notification/>

