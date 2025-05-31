import pkg from "pg";

const {Pool} = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL
})


export async function DELETE({request}){
  const {id}= await request.json();
  const client = await pool.connect();

  try {
    const {rows} = await client.query("DELETE FROM projects WHERE id=$1 RETURNING *", [id]);

    console.log(rows)
    if (rows.length === 0){
      return new Response(JSON.stringify({message: "Could not delete project with id " + id}), {status: 500})
    }

    return new Response(JSON.stringify({message: `Deleted '${rows[0].title}'`, project: rows[0]}), {status: 200})

  } catch (error) {  
    return new Response(JSON.stringify({message: "Could not delete project", error}), {status: 500})
  } finally {
    client.release();
  }
}