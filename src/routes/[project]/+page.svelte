<script>
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade, slide } from 'svelte/transition';
    import { addNotification } from '$lib/stores/notifications.js';
    import FieldCard from '$lib/components/FieldCard.svelte';
    import Task from '$lib/components/Task.svelte';
    import { ChevronLeft, ListChecks } from 'lucide-svelte';
    import ContextMenu from '$lib/components/ContextMenu.svelte';

  let {data} = $props();
  let project = $state(null);
  let fields = $derived(project?.fields)
  let completedTasks = $derived(getCompletedTasks(fields));
  let newFieldInput = $state(null)
  let showCompletedTasks = $state(false);
  let scrollContainer = $state(null)

  let showMenu = $state(false);
  let menuX = $state(0)
  let menuY = $state(0)
  let menuActions = $state([])

  onMount(()=>{
    project = data.project;
  })


  function getCompletedTasks(fields = []){
    let completedTasks = [];
    fields.forEach(field => {
      let tasks = field.tasks;
      tasks = tasks.filter(task => task.done == true);
      completedTasks = completedTasks.concat(tasks);
    });
    return completedTasks;
  }

  async function addField(name = "newField"){
    if (name.length == 0) return;

    try {
      const response = await fetch("/api/fields/add", {
        method: "POST",
          headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          project_id: project.id
        })
      })

      const result = await response.json();
      addNotification(result, response.status)
      //add in front of projects
      fields.unshift(result.field)
      newFieldInput.value = "";
    } catch (error) {
      throw new Error(error)
    }
  }

  function removeFromFields(field_id){
    fields = fields.filter(field => field.id !== field_id);
  }

  function updateTaskStatus(task_id, done) {
    for (const field of project.fields) {
      const task = field.tasks.find(t => t.id === task_id);
      if (task) {
        task.done = done;
        break; // Stop once the task is found and updated
      }
    }
  }

  function removeFromTasks(task_id) {
    console.log("removing from tasks!")
    for (const field of project.fields) {
      const index = field.tasks.findIndex(t => t.id === task_id);
      if (index !== -1) {
        field.tasks.splice(index, 1); // Remove the task in-place
        break; // Stop after removing
      }
    }
  }

  function handleWheel(event) {
    if (event.deltaY !== 0) {
      event.preventDefault();
      scrollContainer.scrollLeft += event.deltaY;
    }
  }

  function handleContextMenu(event){
    event.preventDefault();
    openMenu(event);
  }

  function openMenu(e, actions = []){
    if (actions.length == 0) return;
    showMenu = true;
    menuX = e.clientX;
    menuY = e.clientY;
    menuActions = actions;
  }

  function closeMenu(){
    showMenu = false;
  }
 
</script>


<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex flex-row h-screen" oncontextmenu={handleContextMenu}>
  <!-- <div class=""> -->
  <div class="flex flex-col overflow-x-auto hide-scrollbar"  onwheel={handleWheel}  bind:this={scrollContainer}>
    <a href="/" class="absolute h-full  top-0 left-0 w-4 hover:bg-blue-200/50 hover:blur-xl transition-all py-2 flex items-start">
      <ChevronLeft class="w-full h-auto aspect-square"/>

    </a>
    <p class="text-lg font-bold absolute bottom-0 left-0 p-2">{project?.title}</p>

    <div class="flex flex-row gap-10  h-full">
      <div class=" bg-pink-500/50 p-2 min-h-20 flex flex-col justify-center items-center " onclick={() => newFieldInput.focus()}>
        <input 
        type="text" 
        bind:this={newFieldInput} 
        value="" 
        class="text-xl text-center focus:outline-none"
        onfocus={() => newFieldInput.select()}
        onkeydown={(e) => e.key === "Enter" && addField(e.target.value)}>
      </div>
      {#each fields as field (field.id)}
      <div class="" animate:flip={{duration:500}} transition:fade>
        <!-- <ProjectCard {project} on:deleteProject={removeFromProjects}/> -->
        <FieldCard {field} {removeFromFields} updateTaskStatus={updateTaskStatus} {removeFromTasks} {openMenu}/>
      </div>
      {/each}

      <div class="min-h-screen min-w-[100vw]"></div>
    </div>
    
  </div>


  <div class="absolute relative left-0 h-screen max-h-screen">
    <button class="absolute top-0 -ml-14 p-2 m-4 text-black bg-gray-200 rounded-full" onclick={() => showCompletedTasks = !showCompletedTasks}>
      <ListChecks/>
    </button>
    {#if showCompletedTasks}
    <div class="flex flex-col max-h-screen overflow-y-auto hide-scrollbar" transition:slide={{axis:"x"}}>
      {#each completedTasks as task, i (task.id)}
      <div animate:flip>
        <Task {task} {removeFromTasks}/>

      </div>
      {/each}
    </div>
    {/if}

  </div>
{#if showMenu}
  <ContextMenu x={menuX} y={menuY} {closeMenu} {menuActions}/>
{/if}
</div>



<style>
  /* Webkit browsers (Chrome, Safari, Edge) */
  .hide-scrollbar {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
  }
</style>