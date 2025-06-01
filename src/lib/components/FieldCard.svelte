<script>
  import {ChevronLeft, ChevronRight, LoaderCircle, Plus, Trash2} from "lucide-svelte"
  import { addNotification } from "$lib/stores/notifications";
    import Task from "./Task.svelte";
    import { flip } from "svelte/animate";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";


  let {field, updateTaskStatus, removeFromTasks, removeFromFields, openMenu} = $props();
  let isDeleting = $state(false);
  let preventActions = $state(false);
  let input = $state(null);
  let newTaskInput = $state(null);
  let container = $state(null);
  let innerContainer = $state(null);
  let initWidth = $state(null);
  let expanded = $state(false);

  let centerOnResize = $state(false);
  let resizeTimeout = $state(null)

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

  async function addTask(description = "Description"){
    if (description.length == 0) return;
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
      newTaskInput.value = "";
    } catch (error) {
      console.log(error)
    }
  }

  onMount(()=>{
    console.log()
    initWidth = container.clientWidth
    container.style.width = initWidth;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        handleResize(entry)
      }
    });
    
    resizeObserver.observe(container);
    resizeObserver.observe(innerContainer);

    return () => resizeObserver.disconnect();
  })

  $effect(()=>{
    if (expanded == true){
      initWidth = container.clientWidth;
      container.style.width = "100vw" 
    } else {
      container.style.width = `${initWidth}px`
    }
  })

  function toggleExpansion(){

    centerOnResize = true;
    clearTimeout(resizeTimeout); // Prevent overlapping timeouts
    resizeTimeout = setTimeout(() => {
      centerOnResize = false;
    }, 500);

    expanded = !expanded;

  }

  function handleResize(e){
    const el = e.target;
    if (el == container && centerOnResize == true){
      container.scrollIntoView({ inline: "center" });
    } else if (el == innerContainer){
      container.style.width = `${innerContainer.clientWidth}px`;
    }

  }

</script>

<div class="flex flex-row justify-center min-w-82 transition-[width] duration-[500ms] h-full" bind:this={container}>

<div  class="flex flex-col h-full w-fit group/fieldcard" bind:this={innerContainer}>
  <div class="flex mt-8 mb-8 flex-row group/fieldname relative">
    <input type="text" class=" text-white  w-full focus:outline-none text-2xl disabled:bg-gray-500 selection:bg-red-700" disabled={preventActions} value={field.name} onchange={handleInputUpdate} onclick={(e) => e.preventDefault()} bind:this={input} onfocus={() => input.select()}>
    <button class="absolute top-0 right-0 hover:text-red-500 text-sm transition-all disabled:bg-gray-200 group-hover/fieldname:w-8 group-hover/fieldname:px-2 py-2 w-0 h-full overflow-hidden duration-[100ms]" disabled={isDeleting || preventActions} onclick={deleteField} tabindex="-1">
      {#if isDeleting}
      <LoaderCircle class="animate-spin w-4 h-4"/>
      {:else}
      <Trash2 class="w-4 h-4"/>
      {/if}  
    </button>
  </div>
  <button class="w-full flex items-center group/addtask justify-center py-2"  onclick={()=> newTaskInput.focus()}>
    <Plus class="w-0 group-hover/addtask:w-10 transition-all"/>
  </button>

    <input type="text" 
    class="text-center text-lg h-0 focus:h-10 bg-pink-500 transition-all focus:outline-none"
    bind:this={newTaskInput}
    onfocus={() => newTaskInput.select()}
    disabled={isDeleting || preventActions}
    onkeydown={(e) => e.key === "Enter" && addTask(e.target.value)}>

    <div class="grid grid-flow-col  grid-rows-10 h-full  gap-4 min-h-54  h-full">

    {#each field.tasks.filter(task => task.done == false) as task, i (task.id)}
    <div animate:flip={{duration:500}} transition:fade>
      <Task {task} updateTaskStatus={updateTaskStatus} {removeFromTasks} {openMenu}/>
    </div>
    {/each}
    </div>

    <button class=" h-20 flex items-center hover:text-white text-transparent justify-center  group/expand cursor-pointer" onclick={toggleExpansion}>
      <ChevronLeft class="group-hover/expand:mr-6 transition-all"/>
      <ChevronRight class="group-hover/expand:ml-6 transition-all"/>
    </button>

</div>
</div>
