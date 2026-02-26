import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL);

async function check() {
  try {
    await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
    const col = await pb.collections.getOne('users');
    console.log("Users fields:");
    console.log(JSON.stringify(col.fields.map(f => ({ name: f.name, type: f.type, required: f.required })), null, 2));

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}
check();
