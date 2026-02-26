/**
 * Migration: Raw Timber Listings (Supplier)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateRawTimberListings() {
    console.log('\n========================================');
    console.log('🎯 Starting Raw Timber Listings Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const woodTypesId = await getCollectionId(pb, 'wood_types');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    const fields = [
        { name: 'description', type: 'text', required: false },
    ];

    // Add relation fields if collections exist
    if (usersId) {
        fields.unshift({
            name: 'supplier',
            type: 'relation',
            required: true,
            collectionId: usersId,
            cascadeDelete: true,
            maxSelect: 1
        });
    }

    if (woodTypesId) {
        fields.splice(1, 0, {
            name: 'wood_type',
            type: 'relation',
            required: true,
            collectionId: woodTypesId,
            maxSelect: 1
        });
    }

    // Add remaining fields after relations
    fields.push(
        { name: 'diameter', type: 'number', required: false },
        { name: 'length', type: 'number', required: false },
        { name: 'volume', type: 'number', required: true },
        { name: 'price', type: 'number', required: true },
        {
            name: 'unit',
            type: 'select',
            required: false,
            values: ['m3', 'batang', 'ton']
        },
        { name: 'photos', type: 'file', maxSelect: 5, maxSize: 5242880 },
        { name: 'legality_doc', type: 'file', maxSelect: 1, maxSize: 10485760 },
        {
            name: 'status',
            type: 'select',
            required: false,
            values: ['available', 'sold']
        },
    );

    await upsertCollection(pb, {
        name: 'raw_timber_listings',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.role = "supplier"',
        updateRule: '@request.auth.id = supplier',
        deleteRule: '@request.auth.id = supplier',
        fields,
        indexes: [
            'CREATE INDEX idx_raw_timber_supplier ON raw_timber_listings (supplier)',
            'CREATE INDEX idx_raw_timber_status ON raw_timber_listings (status)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Raw Timber Listings migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateRawTimberListings().catch(console.error);
}

export { migrateRawTimberListings };
