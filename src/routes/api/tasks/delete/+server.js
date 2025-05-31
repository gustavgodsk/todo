import pkg from "pg";

const {Pool} = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL
})


export async function DELETE({request}){
  const {task_id}= await request.json();
  const client = await pool.connect();

  try {
    const {rows} = await client.query("DELETE FROM tasks WHERE id=$1 RETURNING *", [task_id]);

    console.log(rows)
    if (rows.length === 0){
      return new Response(JSON.stringify({message: "Could not delete task with id " + task_id}), {status: 500})
    }

    return new Response(JSON.stringify({message: `Deleted '${rows[0].description}'`, task: rows[0]}), {status: 200})

  } catch (error) {  
    return new Response(JSON.stringify({message: "Could not delete task", error}), {status: 500})
  } finally {
    client.release();
  }
}