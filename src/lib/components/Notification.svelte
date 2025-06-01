<script>
  import { notifications } from '$lib/stores/notifications.js';
    import { flip } from 'svelte/animate';
  import { fade, scale } from 'svelte/transition';

</script>

<div class="fixed bottom-0 right-0 gap-2 w-full select-none p-10 flex pointer-events-none flex-col">
  {#each $notifications as { message, status, id }, i (id)}
    <div class="{status == 200 ? "bg-gradient-to-r from-sky-400 to-blue-500": "bg-gradient-to-r from-red-500 to-red-800"} text-sm  self-end w-fit py-2 px-4 rounded-xl" animate:flip transition:fade>
      {message}
    </div>
  {/each}
</div>
