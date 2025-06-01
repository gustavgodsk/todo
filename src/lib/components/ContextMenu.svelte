<script>
  import { onMount, onDestroy } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import {Trash2} from "lucide-svelte" 

  let {x, y, closeMenu, menuActions = []} = $props();

  let menuElement;

  function handleClickOutside(event) {
    if (!menuElement.contains(event.target)) {
      closeMenu?.();
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });
</script>

<div
  bind:this={menuElement}
  transition:slide
  class=""
  style="
    position: absolute;
    top: {y}px;
    left: {x}px;
    z-index: 1000;
  "
>
{#each menuActions as action, i}
{#if action.name == "Delete"}
    
  <button 
  onclick={()=>{
    action.callback();
    closeMenu();
  }} 
  class=" hover:text-red-500 transition-all cursor-pointer">
      <Trash2 class=""/>
  </button>
{:else}
  <button 
  class="p-2 text-sm font-light text-black bg-gray-300 hover:bg-gray-400 transition-all cursor-pointer" 
  onclick={()=>{
    action.callback();
    closeMenu();
  }}>{action.name}</button>
{/if}

{/each}
  <!-- <button onclick={() => alert('Clicked menu item')} class="text-black">Menu Button</button> -->
</div>