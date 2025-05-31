import pkg from "pg";

const {Pool} = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL
})

export async function PATCH({request}){
  const {id, newTitle} = await request.json();
  const client = await pool.connect();
  
  try {
    const {rows} = await client.query("UPDATE projects SET title=$1 WHERE id=$2 RETURNING *", [newTitle, id])

    return new Response(JSON.stringify({message: `Updated title to '${rows[0].title}'`, project: rows[0]}), {status:200})
  } catch (error) {
    return new Response(JSON.stringify({message: "Could not update title", error}), {status: 500})
  } finally {
    client.release();
  }
}