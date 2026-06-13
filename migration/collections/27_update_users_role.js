/**
 * Migration: Update users collection role field to include 'designer'
 */

import { authenticateAdmin, getCollection } from '../pb-client.js';

async function updateUsersRole() {
    console.log('\n========================================');
    console.log('🔄 Updating users role field — adding designer...');
    console.log('========================================');

    const pb = await authenticateAdmin();

    const existing = await getCollection(pb, 'users');
    if (!existing) {
        console.error('❌ Users collection not found.');
        process.exit(1);
    }

    // Find the role field
    const roleFieldIndex = existing.fields.findIndex(f => f.name === 'role');
    if (roleFieldIndex === -1) {
        console.error('❌ Role field not found on users collection.');
        process.exit(1);
    }

    const roleField = existing.fields[roleFieldIndex];
    const currentValues = roleField.values || [];

    if (currentValues.includes('designer')) {
        console.log('   ⏭️  designer already in role values.');
        return;
    }

    const updatedValues = [...currentValues, 'designer'];
    existing.fields[roleFieldIndex].values = updatedValues;

    try {
        await pb.collections.update(existing.id, {
            fields: existing.fields,
        });
        console.log(`   ✅ Added 'designer' to role field values.`);
    } catch (error) {
        console.error(`   ❌ Failed:`, error.message);
        if (error.response?.data) {
            console.error(`      Details:`, JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }

    console.log('\n========================================');
    console.log('✅ Users role field updated!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    updateUsersRole().catch(console.error);
}

export { updateUsersRole };
