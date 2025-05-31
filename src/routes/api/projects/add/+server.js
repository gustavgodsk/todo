import pkg from "pg"
const {Pool} = pkg;


const pool = new Pool({
  connectionString: process.env.DB_URL
})

export async function POST({request}){

  const {title} = await request.json();
  console.log(title)
  const client = await pool.connect();
  try {
    const {rows} = await client.query("INSERT INTO projects (title) VALUES ($1) RETURNING *", [title]);

    console.log(rows)
    // if (rows.length === 0){
    //   throw new Error("Could not insert projects")
    // }

    return new Response(JSON.stringify({message: `Added ${rows[0].title}`, projects: rows[0]}), {status: 200})
  } catch (error) {
    return new Error({error})
  } finally {
    client.release();
  }
}