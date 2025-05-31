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
    const {rows} = await client.query("SELECT * FROM projects ORDER BY id DESC");

    return new Response(JSON.stringify({message: "Successfully found rows", projects: rows}), {status: 200})
  } catch (error) {
    return new Response(JSON.stringify({message: "Could not find projects", error}), {status: 500})
  } finally {
    client.release();
  }
}