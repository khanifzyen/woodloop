/**
 * Migration: Cart Items (Buyer)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateCartItems() {
    console.log('\n========================================');
    console.log('🎯 Starting Cart Items Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const productsId = await getCollectionId(pb, 'products');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    const fields = [];

    if (usersId) {
        fields.push({
            name: 'buyer',
            type: 'relation',
            required: true,
            collectionId: usersId,
            cascadeDelete: true,
            maxSelect: 1
        });
    }

    if (productsId) {
        fields.push({
            name: 'product',
            type: 'relation',
            required: true,
            collectionId: productsId,
            maxSelect: 1
        });
    }

    fields.push(
        { name: 'quantity', type: 'number', required: true, min: 1 },
    );

    await upsertCollection(pb, {
        name: 'cart_items',
        type: 'base',
        listRule: '@request.auth.id = buyer',
        viewRule: '@request.auth.id = buyer',
        createRule: '@request.auth.id = buyer',
        updateRule: '@request.auth.id = buyer',
        deleteRule: '@request.auth.id = buyer',
        fields,
        indexes: [
            'CREATE INDEX idx_cart_buyer ON cart_items (buyer)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Cart Items migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateCartItems().catch(console.error);
}

export { migrateCartItems };
