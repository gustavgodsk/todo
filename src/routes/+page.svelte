<script>
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';
    import { addNotification } from '$lib/stores/notifications.js';

  let {data} = $props();
  let projects = $state([]);


  onMount(()=>{
    projects = data.projects;
  })

  async function addProject(){
    const title = "newTitle";

    try {
      const response = await fetch("/api/projects/add", {
        method: "POST",
          headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title
        })
      })

      const result = await response.json();
      addNotification(result, response.status)
      //add in front of projects
      projects.unshift(result.projects)
    } catch (error) {
      throw new Error(error)
    }
  }

  function removeFromProjects(e){

    const id = e.detail.id;
    projects = projects.filter(project => project.id !== id);

  }

  
</script>

<div class=" min-h-screen hide-scrollbar max-h-screen overflow-y-auto">
    <button class="bg-blue-500 p-40" onclick={addProject}>
      add project
    </button>
    <button class="bg-red-500">Lets go</button>

    <div class="grid grid-cols-4 p-10  gap-10 auto-rows-[400px]">

      {#each projects as project (project.id)}
      <div  animate:flip={{duration:500}} transition:fade>
        <ProjectCard {project} on:deleteProject={removeFromProjects}/>
      </div>
      {/each}
    </div>




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