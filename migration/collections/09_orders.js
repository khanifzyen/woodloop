/**
 * Migration: Orders (Buyer ↔ Converter)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateOrders() {
    console.log('\n========================================');
    console.log('🎯 Starting Orders Migration...');
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
        { name: 'total_price', type: 'number', required: true },
        {
            name: 'status',
            type: 'select',
            required: false,
            values: ['payment_pending', 'paid', 'processing', 'shipped', 'received', 'cancelled']
        },
        { name: 'shipping_address', type: 'text', required: true },
        { name: 'snap_token', type: 'text', required: false },
        { name: 'snap_redirect_url', type: 'url', required: false },
        {
            name: 'payment_method',
            type: 'select',
            required: false,
            values: ['qris', 'virtual_account', 'bank_transfer', 'cod']
        },
    );

    await upsertCollection(pb, {
        name: 'orders',
        type: 'base',
        listRule: '@request.auth.id = buyer || @request.auth.id = product.converter',
        viewRule: '@request.auth.id = buyer || @request.auth.id = product.converter',
        createRule: '@request.auth.role = "buyer"',
        updateRule: '@request.auth.id = buyer || @request.auth.id = product.converter',
        deleteRule: null,
        fields,
        indexes: [
            'CREATE INDEX idx_orders_buyer ON orders (buyer)',
            'CREATE INDEX idx_orders_product ON orders (product)',
            'CREATE INDEX idx_orders_status ON orders (status)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Orders migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateOrders().catch(console.error);
}

export { migrateOrders };
