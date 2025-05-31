import pkg from "pg";

const {Pool} = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL
})

export async function PATCH({request}){
  const {task_id, done} = await request.json();
  const client = await pool.connect();
  try {
    const {rows} = await client.query("UPDATE tasks SET done=$1 WHERE id=$2 RETURNING *", [done, task_id]);
    const task = rows[0];
    return new Response(JSON.stringify({message: done ? `Completed '${task.description}'`: `Uncompleted '${task.description}'`, task}), {status:200})
  } catch (error) {
    return new Response(JSON.stringify({message: "Could not update done status on task"}), {status: 500})
  } finally {
    client.release();
  }
}