<script>
  import {LoaderCircle} from "lucide-svelte"
  import { addNotification } from "$lib/stores/notifications";
    import Task from "./Task.svelte";


  let {field, updateTaskStatus, removeFromTasks, removeFromFields} = $props();
  let isDeleting = $state(false);
  let preventActions = $state(false);
  let input = $state(null);
  const gradient = "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"

  async function deleteField(e){
    e.preventDefault();
    const id = field.id;
    isDeleting = true;
    preventActions = true;
    try {
      const response = await fetch("/api/fields/delete", {
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
      //remove from fields
      removeFromFields(result.field.id);
    } catch (error) {
      throw new Error(error)
    } finally {
      isDeleting = false;
      preventActions = false;
    }
  }

  async function handleInputUpdate(){
    preventActions = true;
    const newName = input.value;

    try {
      const response = await fetch("/api/fields/update-name", {
        method: "PATCH",
        headers: {
          "Content-Type": "appplication/json",
        },
        body: JSON.stringify({
          id: field.id,
          newName
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

  async function addTask(){
    const description = "new Task!!"

    try {
      const response = await fetch("/api/tasks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          field_id: field.id,
          description
        })
      })

      const result = await response.json();
      field.tasks.unshift(result.task)
      addNotification(result, response.status)
    } catch (error) {
      console.log(error)
    }
  }

</script>

<div  class="flex flex-col w-full h-full p-10 relative group/fieldcard {gradient}">
  <p class="text-white">{field.id}</p>
  <input type="text" class="bg-gray-200 text-black disabled:bg-gray-500" disabled={preventActions} value={field.name} onchange={handleInputUpdate} onclick={(e) => e.preventDefault()} bind:this={input}>
  <button class="absolute top-0 right-0 bg-red-500 p-2 hover:bg-red-200 text-sm transition-all disabled:bg-gray-200 group-hover/fieldcard:flex hidden duration-[200ms]" disabled={isDeleting || preventActions} onclick={deleteField}>
    {#if isDeleting}
    <div class="flex flex-row items-center gap-2">
    <LoaderCircle class="animate-spin w-4 h-4"/>
     deleting...

    </div>
    {:else}
    Delete
    {/if}  
  </button>
  <div class="flex flex-col gap-2">
  {#each field.tasks as task}
    <Task {task} updateTaskStatus={updateTaskStatus} {removeFromTasks}/>
  {/each}
  </div>
 

  <button class="bg-green-400 mt-2 p-1" onclick={addTask}>Add task</button>
</div>