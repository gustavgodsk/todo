export async function load({fetch}){
  try {
    const response = await fetch("/api/projects", {
      method: "GET"
    })

    const {projects} = await response.json();
    return {projects};
  } catch (error) {
    
  }
}