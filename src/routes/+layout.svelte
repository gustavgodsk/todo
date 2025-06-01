<script>
	import '../app.css';
  import Notification from '$lib/components/Notification.svelte';
  import { Maximize, Minimize } from 'lucide-svelte';
    import { onDestroy, onMount } from 'svelte';
    import { scale, slide } from 'svelte/transition';
	
	let { children } = $props();
  const bgGradient = "bg-gradient-to-r from-gray-700 via-gray-900 to-black";

  let accesGained = $state(false)
  let typedKeys = $state([]);
  let isFullscreen = $state(false)

  onMount(()=>{
    document.addEventListener("keydown", handleKeyDown)
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })

  onDestroy(()=>{
  })

  function handleKeyDown(e){
    if (!accesGained){
      typedKeys.push(e.key)
      checkAccess();
    }
    
    if (e.code == "KeyF"){
      toggleFullscreen();
    }
  }

  function checkAccess(){
    if (typedKeys.join("").slice(-8) == "xddEnter") {
      accesGained = true;
    }
  }

  function toggleFullscreen(){
    if (!accesGained) return;
    if (isFullscreen === true){
      document.exitFullscreen();
    } else if (isFullscreen === false){
      document.documentElement.requestFullscreen();
    }

    isFullscreen = !isFullscreen;
  }

  function getRandomFontSize(){

    return Math.random() * 100 + 20
  }

  let container = $state(null)

</script>

<div class="text-white max-h-screen overflow-hidden {bgGradient}">
{#if accesGained}
  
{@render children()}
<Notification/>
<button class="absolute bottom-0 right-0 w-16 p-4 h-auto aspect-square text-white/20 hover:text-white transition-all  cursor-pointer " onclick={toggleFullscreen}>
  {#if isFullscreen}
    <Minimize class="w-full h-full"/>
  {:else}
    <Maximize class="w-full h-full"/>
  {/if}
</button>

{:else}
<div class="h-screen overflow-hidden max-h-screen gap-1 flex items-center max-w-screen w-screen p-20 justify-center flex-wrap" bind:this={container}>
  {#if typedKeys.length == 0}
    <p class="select-none text-9xl font-lighter leading-none password" in:slide={{axis:"x"}}>~</p>
  {/if}
  {#each typedKeys as key}
  <p class="select-none text-9xl font-lighter leading-none password border-b-8 border-white" transition:slide={{axis:"x"}}>*</p>
    
  {/each}
</div>

{/if}


</div>



