/**
 * Migration: Waste Listings (Generator)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateWasteListings() {
    console.log('\n========================================');
    console.log('🎯 Starting Waste Listings Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const woodTypesId = await getCollectionId(pb, 'wood_types');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    const fields = [];

    if (usersId) {
        fields.push({
            name: 'generator',
            type: 'relation',
            required: true,
            collectionId: usersId,
            cascadeDelete: true,
            maxSelect: 1
        });
    }

    if (woodTypesId) {
        fields.push({
            name: 'wood_type',
            type: 'relation',
            required: true,
            collectionId: woodTypesId,
            maxSelect: 1
        });
    }

    fields.push(
        {
            name: 'form',
            type: 'select',
            required: false,
            values: ['offcut_large', 'offcut_small', 'shaving', 'sawdust', 'logs_end']
        },
        {
            name: 'condition',
            type: 'select',
            required: false,
            values: ['dry', 'wet', 'oiled', 'mixed']
        },
        { name: 'volume', type: 'number', required: true },
        {
            name: 'unit',
            type: 'select',
            required: false,
            values: ['kg', 'm3', 'sack', 'pickup']
        },
        { name: 'photos', type: 'file', maxSelect: 5, maxSize: 5242880 },
        { name: 'price_estimate', type: 'number', required: false },
        {
            name: 'status',
            type: 'select',
            required: false,
            values: ['available', 'booked', 'collected', 'sold']
        },
        { name: 'description', type: 'text', required: false },
    );

    await upsertCollection(pb, {
        name: 'waste_listings',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.role = "generator"',
        updateRule: '@request.auth.id = generator || @request.auth.role = "aggregator"',
        deleteRule: '@request.auth.id = generator',
        fields,
        indexes: [
            'CREATE INDEX idx_waste_generator ON waste_listings (generator)',
            'CREATE INDEX idx_waste_status ON waste_listings (status)',
            'CREATE INDEX idx_waste_wood_type ON waste_listings (wood_type)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Waste Listings migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateWasteListings().catch(console.error);
}

export { migrateWasteListings };
