<script>
    import { addNotification } from "$lib/stores/notifications";
    import { Check, Circle, Trash2 } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let {task, updateTaskStatus, removeFromTasks} = $props();

  let preventActions = $state(false);
  let isDeleting = $state(false);

  async function completeTask(){
    if (preventActions || task.done) return;
    preventActions = true;
    const done = true;
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
    } catch (error) {
      throw new Error(error)
    } finally {
      preventActions = false;
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
</script>

<div class="flex flex-row group/task">
  <button
    class="flex flex-row items-center justify-between flex-1 p-2 {task.done ? 'bg-gray-500' : 'bg-blue-200'}"
    onclick={completeTask}
    disabled={task.done || preventActions}
  >
    <span>{task.description}</span>
    <div class="flex">
      {#if task.done}
        <Check/>
      {:else}
      <Circle/>
      {/if}
    </div>
  </button>
  <button onclick={deleteTask} disabled={isDeleting || preventActions} class="disabled:bg-gray-200">
      <Trash2 class="flex w-0 group-hover/task:w-10 hover:text-red-500 group-hover/task:p-2 h-auto  transition-all duration-[100ms]"/>
  </button>
</div>
