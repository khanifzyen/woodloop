import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL);

async function check() {
  try {
    await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
    const col = await pb.collections.getOne('users');
    console.log("Full role field:", JSON.stringify(col.fields.find(f => f.name === 'role'), null, 2));

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}
check();
