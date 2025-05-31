<script>
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';
    import { addNotification } from '$lib/stores/notifications.js';
    import FieldCard from '$lib/components/FieldCard.svelte';
    import MoodBoard from '$lib/components/MoodBoard.svelte';

  let {data} = $props();
  let project = $state(null);
  let fields = $derived(project?.fields)
  let scale = $state(null)

  function handleScale(newScale){
    scale = newScale;
    console.log(scale)
  }


  onMount(()=>{
    project = data.project;
  })

  async function addField(){
    const name = "newField";

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
</script>

<MoodBoard {handleScale}>

<div 
		style="
			position: absolute;
			left: {3000 * scale}px;
			top: {100 * scale}px;
			width: {120 * scale}px;
			height: {60 * scale}px;
			font-size: {14 * scale}px;
		"
		class="bg-green-300 border"
>
<!-- <div class="absolute bg-blue-500/20" style="top: {200*scale}px"> -->
  <p>{project?.title}</p>
    <button class="bg-blue-500 p-40" onclick={addField}>
      add field
    </button>
    <button class="bg-red-500">Lets go</button>

    <div class="flex flex-row gap-10 m-10">

      {#each fields as field (field.id)}
      <div  animate:flip={{duration:500}} transition:fade>
        <!-- <ProjectCard {project} on:deleteProject={removeFromProjects}/> -->
         <FieldCard {field} {removeFromFields} updateTaskStatus={updateTaskStatus} {removeFromTasks}/>
      </div>
      {/each}
    </div>




</div>
</MoodBoard>
