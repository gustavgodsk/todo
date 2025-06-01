<script>
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade, slide } from 'svelte/transition';
    import { addNotification } from '$lib/stores/notifications.js';
    import { Plus } from 'lucide-svelte';

  let {data} = $props();
  let projects = $state([]);



  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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

    <div class="grid grid-cols-4 p-10  gap-10 auto-rows-[400px]">
      <button class=" flex items-center group cursor-pointer hover:bg-white/10 transition-all justify-center" onclick={addProject}>
        <Plus class="group-hover:scale-[200%] transiton-all duration-[500ms]"/>
      </button>
      {#each projects as project, i (project.id)}
      <div class="relative group" animate:flip={{duration:500}} transition:slide>
        <div class="absolute inset-0  group-hover:scale-105 transition-all " style="background-color: {getRandomColor()}; opacity: 0.5"></div>
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