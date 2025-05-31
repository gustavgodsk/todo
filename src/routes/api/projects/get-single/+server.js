import pkg from "pg";
import dotenv from "dotenv"

dotenv.config();

const {Pool} = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL
})

export async function GET({url}){
  const id = url.searchParams.get("id")
  const client = await pool.connect();

  try {
    let { rows } = await client.query("SELECT * FROM projects WHERE id=$1", [id]);
    const project = rows[0];

    let fieldResult = await client.query("SELECT * FROM fields WHERE project_id=$1 ORDER BY id DESC", [id]);
    const fields = fieldResult.rows;
    project.fields = fields;

    // Extract field IDs
    const fieldIds = fields.map(field => field.id);

    let tasks = [];
    if (fieldIds.length > 0) {
      const taskResult = await client.query("SELECT * FROM tasks WHERE field_id = ANY($1) ORDER BY done = true, id DESC", [fieldIds]);
      tasks = taskResult.rows;
    }

    // Create a map of field_id => tasks
    const taskMap = {};
    for (let task of tasks) {
      if (!taskMap[task.field_id]) {
        taskMap[task.field_id] = [];
      }
      taskMap[task.field_id].push(task);
    }

    // Assign tasks to their corresponding fields
    for (let field of fields) {
      field.tasks = taskMap[field.id] || [];
    }

    console.log(fields)

    return new Response(JSON.stringify({message: "Project found!", project}), {status:200})
  } catch (error) {
    return new Response(JSON.stringify({message: "Could not find project", error}), {status:200})
  } finally {
    client.release();
  }
}