import pkg from "pg"
import dotenv from "dotenv"
const {Pool} = pkg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL
})

export async function GET(){
  
  const client = await pool.connect();
  try {
    const projectsResult = await client.query("SELECT * FROM projects ORDER BY id DESC");
    const projects = projectsResult.rows;
    const projectIds = projects.map(project => project.id);

    let fields = [];
    if (projectIds.length > 0){
      let fieldsResult = await client.query("SELECT * FROM fields WHERE project_id = ANY($1) ORDER BY id DESC", [projectIds]);
      fields = fieldsResult.rows;
    }


    // Create a map of project_id => fields
    const fieldMap = {};
    for (let field of fields) {
      if (!fieldMap[field.project_id]) {
        fieldMap[field.project_id] = [];
      }
      fieldMap[field.project_id].push(field);
    }

    // Assign tasks to their corresponding fields
    for (let project of projects) {
      project.fields = fieldMap[project.id] || [];
    }

    return new Response(JSON.stringify({message: "Successfully found rows", projects}), {status: 200})
  } catch (error) {
    return new Response(JSON.stringify({message: "Could not find projects", error}), {status: 500})
  } finally {
    client.release();
  }
}