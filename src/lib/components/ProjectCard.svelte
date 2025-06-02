<script>
  import {LoaderCircle, Trash2} from "lucide-svelte"
  import { createEventDispatcher } from "svelte";
  import { addNotification } from "$lib/stores/notifications";
    import { fade, slide } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let {project} = $props();
  let isDeleting = $state(false);
  let preventActions = $state(false);
  let input = $state(null);
  let showDelete = $state(null)

  const projectGradient = "bg-gradient-to-b from-[#06b6d4] via-[#2563eb] to-[#6366f1]"

  async function deleteProject(e){
    e.preventDefault();
    const id = project.id;
    isDeleting = true;
    preventActions = true;
    try {
      const response = await fetch("/api/projects/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id
        })
      })

      const result = await response.json();
      addNotification(result, response.status)
      //remove from projects
      dispatch("deleteProject", {
        id
      })
    } catch (error) {
      throw new Error(error)
    } finally {
      isDeleting = false;
      preventActions = false;
    }
  }

  async function handleInputUpdate(){
    preventActions = true;
    const newTitle = input.value;

    try {
      const response = await fetch("/api/projects/update-title", {
        method: "PATCH",
        headers: {
          "Content-Type": "appplication/json",
        },
        body: JSON.stringify({
          id: project.id,
          newTitle
        })
      })

      const result = await response.json();
      addNotification(result, response.status)
    } catch (error) {
      throw new Error(error)
    } finally {
      preventActions = false;
    }
  }
</script>

<a href="/{project.id}" class="flex flex-col w-full h-full p-10 relative group bg-transparent "
onmouseenter={() => showDelete = true}
onmouseleave={() => showDelete = false}>
  <input type="text" class="focus:outline-none selection:bg-black/50 text-white text-2xl font-bold " disabled={preventActions} value={project.title} onchange={handleInputUpdate} onclick={(e) => e.preventDefault()} bind:this={input} onfocus={(e) => e.target.select()} spellcheck="false">
  <button class="absolute top-0 right-0 p-2 hover:text-red-500 cursor-pointer text-sm transition-all  duration-[200ms]" disabled={isDeleting || preventActions} onclick={deleteProject}>
    {#if showDelete}
    <div class="" transition:slide={{duration:200}}>
      {#if isDeleting}
      <LoaderCircle class="animate-spin w-4 h-4"/>
      {:else}
      <Trash2 class="w-4 h-4"/>
      {/if}  
    </div>
    {/if}
  </button>
</a>