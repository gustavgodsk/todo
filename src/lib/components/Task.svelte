<script>
    import { addNotification } from "$lib/stores/notifications";
    import { Check, Circle, LoaderCircle, Trash2, X } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
    import { quintOut } from "svelte/easing";
    import { draw, slide } from "svelte/transition";

  const dispatch = createEventDispatcher();
  let {task, updateTaskStatus, removeFromTasks, openMenu, launchFireworks} = $props();

  let preventActions = $state(false);
  let isDeleting = $state(false);
  let showDelete = $state(false);
  let buttonX = $state(null)
  let buttonY = $state(null)
  let deleteBtn = $state(null)
  let isCompleting = $state(false)


  async function toggleTaskStatus(e){

    e.preventDefault();
    e.stopPropagation();
    if (preventActions || isDeleting) return;
    preventActions = true;

    const done = !task.done;
    isCompleting = done;
    // await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await fetch("/api/tasks/update-done", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          task_id: task.id,
          done
        })
      })

      const result = await response.json();
      const newTask = result.task;
      updateTaskStatus(newTask.id, newTask.done)
      addNotification(result, response.status)

      if (newTask.done) launchFireworks(1);

    } catch (error) {
      throw new Error(error)
    } finally {
      preventActions = false;
      isCompleting = false;
    }
  }

    async function deleteTask(){
    const task_id = task.id;
    isDeleting = true;
    preventActions = true;
    try {
      const response = await fetch("/api/tasks/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          task_id
        })
      })

      const result = await response.json();
      addNotification(result, response.status)
      removeFromTasks(result.task.id)
    } catch (error) {
      throw new Error(error)
    } finally {
      isDeleting = false;
      preventActions = false;
    }
  }

  function handleRightClick(e){
    e.stopPropagation();
    e.preventDefault();

    const actions = [];

    const action = {
      callback: handleDeleteButtonClick,
      name: "Delete"
    }

    actions.push(action)

    openMenu(e, actions)
  }

  function handleDeleteButtonClick(){
    if (isDeleting || preventActions) return;
    deleteTask();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex flex-row select-none w-full h-full min-w-76 group/task" onclick={(e) => showDelete = false} oncontextmenu={handleRightClick}>
  <button
    class="flex flex-row items-center flex-1 justify-between gap-6  py-2 px-8 cursor-pointer {task.done ? 'bg-transparent hover:bg-black/20 font-light' : 'bg-gray-600  shadow-lg dropshadow-lg'}"
    onclick={toggleTaskStatus}
    disabled={preventActions || isDeleting}
  >
    <span class="whitespace-nowrap text-white">{task.description}</span>
    <div class="flex text-white/60 transition-all {isDeleting || preventActions ? "": "group-hover/task:scale-[115%]"}">
      {#if isCompleting}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check text-green-400">
          <path d="M20 6 9 17l-5-5" in:draw={{duration: 500, easing: quintOut}}/>
        </svg>
      {:else if task.done && preventActions}
        <LoaderCircle class="p-1 animate-spin"/>
      {:else if task.done}
        <Check class="group-hover/task:hidden"/>
        <X class="group-hover/task:flex hidden text-red-400"/>
      {:else if task.done == false}
        <Circle class="transition-all  {isDeleting || preventActions ? "": "group-hover/task:text-green-400"} "/>
      {/if}
    </div>
  </button>

</div>

  <!-- {#if showDelete} -->
<!--     
  <button onclick={deleteTask} disabled={isDeleting || preventActions} class="absolute disabled:bg-gray-200 z-[100] hover:text-red-500 transition-all cursor-pointer" style="top: {buttonY}px; left: {buttonX}px;" tabindex="-1" transition:slide bind:this={deleteBtn}>
      <Trash2 class=""/>
  </button> -->
  <!-- {/if} -->