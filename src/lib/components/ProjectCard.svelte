<script>
  import {LoaderCircle} from "lucide-svelte"
  import { createEventDispatcher } from "svelte";
  import { addNotification } from "$lib/stores/notifications";

  const dispatch = createEventDispatcher();

  let {project} = $props();
  let isDeleting = $state(false);
  let preventActions = $state(false);
  let input = $state(null);
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

<a href="/{project.id}" class="flex flex-col w-full h-full p-10 relative group {projectGradient}">
  <p class="text-white">{project.id}</p>
  <input type="text" class="bg-gray-200 text-black disabled:bg-gray-500" disabled={preventActions} value={project.title} onchange={handleInputUpdate} onclick={(e) => e.preventDefault()} bind:this={input}>
  <button class="absolute top-0 right-0 bg-red-500 p-2 hover:bg-red-200 text-sm transition-all disabled:bg-gray-200 group-hover:flex hidden duration-[200ms]" disabled={isDeleting || preventActions} onclick={deleteProject}>
    {#if isDeleting}
    <div class="flex flex-row items-center gap-2">
    <LoaderCircle class="animate-spin w-4 h-4"/>
     deleting...

    </div>
    {:else}
    Delete
    {/if}  
  </button>
</a>