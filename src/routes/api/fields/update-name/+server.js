import pkg from "pg";

const {Pool} = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL
})

export async function PATCH({request}){
  const {id, newName} = await request.json();
  const client = await pool.connect();
  
  try {
    const {rows} = await client.query("UPDATE fields SET name=$1 WHERE id=$2 RETURNING *", [newName, id])

    return new Response(JSON.stringify({message: `Updated name to '${rows[0].name}'`, project: rows[0]}), {status:200})
  } catch (error) {
    return new Response(JSON.stringify({message: "Could not update title", error}), {status: 500})
  } finally {
    client.release();
  }
}