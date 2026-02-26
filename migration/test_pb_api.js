import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);

async function test() {
  await pb.admins.authWithPassword('admin@woodloop.id', 'admin12345');
  console.log("Logged in");
  
  try {
    const col = await pb.collections.create({
      name: 'test_col_123',
      type: 'base',
      fields: [
        { name: 'title', type: 'text', required: true }
      ]
    });
    console.log("Created collection:", JSON.stringify(col.fields, null, 2));
    
    // Attempt to add a field
    const updated = await pb.collections.update('test_col_123', {
      fields: [
        ...col.fields,
        { name: 'description', type: 'text', required: false }
      ]
    });
    console.log("Updated fields:", JSON.stringify(updated.fields, null, 2));

    await pb.collections.delete('test_col_123');
  } catch (err) {
    console.error(err.response?.data || err);
  }
}
test();
