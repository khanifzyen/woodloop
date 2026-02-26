/**
 * Migration: Pickups (Aggregator)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migratePickups() {
    console.log('\n========================================');
    console.log('🎯 Starting Pickups Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const wasteListingsId = await getCollectionId(pb, 'waste_listings');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    const fields = [];

    if (usersId) {
        fields.push({
            name: 'aggregator',
            type: 'relation',
            required: true,
            collectionId: usersId,
            maxSelect: 1
        });
    }

    if (wasteListingsId) {
        fields.push({
            name: 'waste_listing',
            type: 'relation',
            required: true,
            collectionId: wasteListingsId,
            maxSelect: 1
        });
    }

    fields.push(
        { name: 'scheduled_date', type: 'date', required: false },
        { name: 'actual_date', type: 'date', required: false },
        {
            name: 'status',
            type: 'select',
            required: false,
            values: ['pending', 'on_the_way', 'completed', 'cancelled']
        },
        { name: 'weight_verified', type: 'number', required: false },
        { name: 'pickup_photo', type: 'file', maxSelect: 3, maxSize: 5242880 },
        { name: 'notes', type: 'text', required: false },
    );

    await upsertCollection(pb, {
        name: 'pickups',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.role = "aggregator"',
        updateRule: '@request.auth.id = aggregator',
        deleteRule: '@request.auth.id = aggregator && status = "pending"',
        fields,
        indexes: [
            'CREATE INDEX idx_pickups_aggregator ON pickups (aggregator)',
            'CREATE INDEX idx_pickups_status ON pickups (status)',
            'CREATE INDEX idx_pickups_waste ON pickups (waste_listing)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Pickups migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migratePickups().catch(console.error);
}

export { migratePickups };
