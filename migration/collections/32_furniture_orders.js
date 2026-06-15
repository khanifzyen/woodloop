/**
 * Migration: Add sold_count to generator_products + create furniture_orders
 * Furniture marketplace: Buyer dapat membeli produk dari Generator
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateFurnitureOrders() {
    console.log('\n========================================');
    console.log('🪑 Starting Furniture Orders Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const genProductsId = await getCollectionId(pb, 'generator_products');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    // 1. Add sold_count to generator_products
    console.log('\n📊 Adding sold_count to generator_products...');
    await upsertCollection(pb, {
        name: 'generator_products',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: '@request.auth.id = generator',
        updateRule: '@request.auth.id = generator',
        deleteRule: '@request.auth.id = generator',
        fields: [
            { name: 'sold_count', type: 'number', required: false, min: 0 },
        ],
        indexes: [],
    });

    // 2. Create furniture_orders collection
    console.log('\n📦 Creating furniture_orders collection...');
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

    if (genProductsId) {
        fields.push({
            name: 'product',
            type: 'relation',
            required: true,
            collectionId: genProductsId,
            maxSelect: 1
        });
    }

    if (usersId) {
        fields.push({
            name: 'seller',
            type: 'relation',
            required: true,
            collectionId: usersId,
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
        { name: 'cancel_reason', type: 'text', required: false },
    );

    await upsertCollection(pb, {
        name: 'furniture_orders',
        type: 'base',
        listRule: '@request.auth.id = buyer || @request.auth.id = seller',
        viewRule: '@request.auth.id = buyer || @request.auth.id = seller',
        createRule: '@request.auth.role = "buyer"',
        updateRule: '@request.auth.id = buyer || @request.auth.id = seller',
        deleteRule: null,
        fields,
        indexes: [
            'CREATE INDEX idx_furniture_orders_buyer ON furniture_orders (buyer)',
            'CREATE INDEX idx_furniture_orders_seller ON furniture_orders (seller)',
            'CREATE INDEX idx_furniture_orders_product ON furniture_orders (product)',
            'CREATE INDEX idx_furniture_orders_status ON furniture_orders (status)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Furniture Orders migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateFurnitureOrders().catch(console.error);
}

export { migrateFurnitureOrders };
