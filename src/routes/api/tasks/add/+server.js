import pkg from "pg"
const {Pool} = pkg;


const pool = new Pool({
  connectionString: process.env.DB_URL
})

export async function POST({request}){

  const {description, field_id} = await request.json();
  console.log(description, field_id)
  const client = await pool.connect();
  const done = false;
  try {
    const {rows} = await client.query("INSERT INTO tasks (description, field_id, done) VALUES ($1, $2, $3) RETURNING *", [description, field_id, done]);
    console.log(rows)


    return new Response(JSON.stringify({message: `Added task ${rows[0].description}`, task: rows[0]}), {status: 200})
  } catch (error) {
    return new Response(JSON.stringify({message: "Could not add field", error}), {status: 500})
  } finally {
    client.release();
  }
}