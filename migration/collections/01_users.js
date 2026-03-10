/**
 * Migration: Users Collection (extends PocketBase Auth)
 * Based on docs/07-skema.md
 *
 * Note: PocketBase already has a built-in 'users' auth collection.
 * This script updates it with additional custom fields using upsert logic.
 */

import { authenticateAdmin, getCollection } from '../pb-client.js';

async function migrateUsers() {
    console.log('\n========================================');
    console.log('🎯 Starting Users Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();

    // Get existing users collection
    const existing = await getCollection(pb, 'users');

    if (!existing) {
        console.error('❌ Users collection not found. PocketBase should have this by default.');
        process.exit(1);
    }

    console.log(`\n🔍 Checking collection: users...`);
    console.log(`   📦 Collection "users" exists. Checking fields...`);

    // Define required custom fields
    const customFields = [
        { name: 'name', type: 'text', required: true },
        { name: 'avatar', type: 'file', maxSelect: 1, maxSize: 5242880 },
        {
            name: 'role',
            type: 'select',
            required: true,
            values: ['supplier', 'generator', 'aggregator', 'converter', 'enabler', 'buyer']
        },
        { name: 'workshop_name', type: 'text', required: false },
        { name: 'address', type: 'text', required: false },
        { name: 'location_lat', type: 'number', required: false, min: -90, max: 90 },
        { name: 'location_lng', type: 'number', required: false, min: -180, max: 180 },
        { name: 'phone', type: 'text', required: false },
        { name: 'user_code', type: 'text', required: false },
        { name: 'is_verified', type: 'bool', required: false },
        { name: 'bio', type: 'text', required: false },
        { name: 'production_capacity', type: 'text', required: false },
        { name: 'machine_type', type: 'text', required: false },
        { name: 'fleet_type', type: 'text', required: false },
        { name: 'warehouse_capacity', type: 'text', required: false },
    ];

    // Check which fields are missing
    const existingFieldNames = existing.fields?.map(f => f.name) || [];
    const newFields = customFields.filter(f => !existingFieldNames.includes(f.name));

    if (newFields.length === 0) {
        console.log(`   ⏭️  All custom fields already exist.`);
    } else {
        console.log(`   ➕ Adding ${newFields.length} new fields:`);
        newFields.forEach(f => console.log(`      + ${f.name} (${f.type})`));
    }

    // Merge existing fields with new fields
    const mergedFields = [...existing.fields, ...newFields];

    try {
        await pb.collections.update('users', {
            fields: mergedFields,
            indexes: [
                'CREATE INDEX idx_users_role ON users (role)',
            ],
            // API Rules for users
            listRule: '@request.auth.id != ""',
            viewRule: '@request.auth.id != ""',
            createRule: '',
            updateRule: '@request.auth.id = id',
            deleteRule: '@request.auth.id = id',
        });
        console.log(`   ✅ Users collection updated successfully!`);
    } catch (error) {
        console.error(`   ❌ Failed to update users:`, error.message);
        if (error.response?.data) {
            console.error(`      Details:`, JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }

    console.log('\n========================================');
    console.log('✅ Users migration completed!');
    console.log('========================================\n');
}

// Only run if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
    migrateUsers().catch(console.error);
}

export { migrateUsers };
