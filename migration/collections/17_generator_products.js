/**
 * Migration: Generator Products (Generator)
 * Based on docs/07-skema.md
 * Separate from Converter `products` collection
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateGeneratorProducts() {
    console.log('\n========================================');
    console.log('🎯 Starting Generator Products Migration...');
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

    fields.push(
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text', required: false },
        {
            name: 'category',
            type: 'select',
            required: false,
            values: ['furniture', 'custom_order', 'raw_material', 'other']
        },
        { name: 'price', type: 'number', required: true },
        { name: 'stock', type: 'number', required: false },
        { name: 'photos', type: 'file', maxSelect: 5, maxSize: 5242880 },
    );

    if (woodTypesId) {
        fields.push({
            name: 'wood_type',
            type: 'relation',
            required: false,
            collectionId: woodTypesId,
            maxSelect: 1
        });
    }

    fields.push({
        name: 'status',
        type: 'select',
        required: false,
        values: ['active', 'sold_out', 'draft']
    });

    await upsertCollection(pb, {
        name: 'generator_products',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: '@request.auth.id = generator',
        updateRule: '@request.auth.id = generator',
        deleteRule: '@request.auth.id = generator',
        fields,
        indexes: [
            'CREATE INDEX idx_gen_prod_generator ON generator_products (generator)',
            'CREATE INDEX idx_gen_prod_status ON generator_products (status)',
            'CREATE INDEX idx_gen_prod_category ON generator_products (category)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Generator Products migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateGeneratorProducts().catch(console.error);
}

export { migrateGeneratorProducts };
