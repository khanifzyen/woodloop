/**
 * Migration: Raw Timber Order Details
 * Line items for raw_timber_orders (master-detail with raw_timber_orders)
 *
 * Security: unit_price is stored here but server-validated via PB Hook.
 * Client may send a price, but the hook will override it with the
 * actual price from raw_timber_listings.
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateRawTimberOrderDetails() {
    console.log('\n========================================');
    console.log('🎯 Starting Raw Timber Order Details Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const rawTimberOrdersId = await getCollectionId(pb, 'raw_timber_orders');
    const rawTimberListingsId = await getCollectionId(pb, 'raw_timber_listings');

    if (!rawTimberOrdersId || !rawTimberListingsId) {
        console.error('❌ Required collections not found. Run raw_timber_orders and raw_timber_listings migrations first.');
        process.exit(1);
    }

    const fields = [
        {
            name: 'order',
            type: 'relation',
            required: true,
            collectionId: rawTimberOrdersId,
            cascadeDelete: true,
            maxSelect: 1
        },
        {
            name: 'listing',
            type: 'relation',
            required: true,
            collectionId: rawTimberListingsId,
            maxSelect: 1
        },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'unit_price', type: 'number', required: true },
        { name: 'subtotal', type: 'number', required: true },
    ];

    await upsertCollection(pb, {
        name: 'raw_timber_order_details',
        type: 'base',
        listRule: '@request.auth.id = order.buyer || @request.auth.id = order.seller',
        viewRule: '@request.auth.id = order.buyer || @request.auth.id = order.seller',
        createRule: '@request.auth.role = "generator"',
        updateRule: null,
        deleteRule: null,
        fields,
        indexes: [
            'CREATE INDEX idx_rtod_order ON raw_timber_order_details (order)',
            'CREATE INDEX idx_rtod_listing ON raw_timber_order_details (listing)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Raw Timber Order Details migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateRawTimberOrderDetails().catch(console.error);
}

export { migrateRawTimberOrderDetails };
