import pkg from "pg"
const {Pool} = pkg;


const pool = new Pool({
  connectionString: process.env.DB_URL
})

export async function POST({request}){

  const {name, project_id} = await request.json();
  const client = await pool.connect();
  try {
    const {rows} = await client.query("INSERT INTO fields (name, project_id) VALUES ($1, $2) RETURNING *", [name, project_id]);

    // if (rows.length === 0){
    //   throw new Error("Could not insert projects")
    // }
    const field = rows[0];
    field.tasks = [];

    return new Response(JSON.stringify({message: `Added field ${field.name}`, field}), {status: 200})
  } catch (error) {
    return new Response(JSON.stringify({message: "Could not add field", error}), {status: 500})
  } finally {
    client.release();
  }
}