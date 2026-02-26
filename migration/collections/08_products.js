/**
 * Migration: Products (Converter)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateProducts() {
    console.log('\n========================================');
    console.log('🎯 Starting Products Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const mktTransactionsId = await getCollectionId(pb, 'marketplace_transactions');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    const fields = [];

    if (usersId) {
        fields.push({
            name: 'converter',
            type: 'relation',
            required: true,
            collectionId: usersId,
            cascadeDelete: true,
            maxSelect: 1
        });
    }

    fields.push(
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text', required: false },
        {
            name: 'category',
            type: 'select',
            required: false,
            values: ['furniture', 'decor', 'accessories', 'art', 'other']
        },
        { name: 'price', type: 'number', required: true },
        { name: 'stock', type: 'number', required: false },
        { name: 'photos', type: 'file', maxSelect: 5, maxSize: 5242880 },
    );

    if (mktTransactionsId) {
        fields.push({
            name: 'source_transactions',
            type: 'relation',
            required: false,
            collectionId: mktTransactionsId,
            maxSelect: 999
        });
    }

    fields.push(
        { name: 'qr_code_id', type: 'text', required: false },
    );

    await upsertCollection(pb, {
        name: 'products',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: '@request.auth.id = converter',
        updateRule: '@request.auth.id = converter',
        deleteRule: '@request.auth.id = converter',
        fields,
        indexes: [
            'CREATE INDEX idx_products_converter ON products (converter)',
            'CREATE INDEX idx_products_category ON products (category)',
            'CREATE UNIQUE INDEX idx_products_qr ON products (qr_code_id)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Products migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateProducts().catch(console.error);
}

export { migrateProducts };
