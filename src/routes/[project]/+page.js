export async function load({fetch, params}){
  const id = params.project;

  const response = await fetch(`/api/projects/get-single?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const {project} = await response.json();

  return {project}
}