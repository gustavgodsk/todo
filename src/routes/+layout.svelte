<script>
	import '../app.css';
  import Notification from '$lib/components/Notification.svelte';
	
	let { children } = $props();
  const bgGradient = "bg-gradient-to-r from-gray-700 via-gray-900 to-black"

</script>

<div class="text-white h-full min-h-screen overflow-hidden w-full {bgGradient}">
{@render children()}

</div>

<Notification/>