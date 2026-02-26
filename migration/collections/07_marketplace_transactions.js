/**
 * Migration: Marketplace Transactions (Converter ↔ Aggregator)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateMarketplaceTransactions() {
    console.log('\n========================================');
    console.log('🎯 Starting Marketplace Transactions Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const warehouseId = await getCollectionId(pb, 'warehouse_inventory');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    const fields = [];

    if (usersId) {
        fields.push(
            {
                name: 'buyer',
                type: 'relation',
                required: true,
                collectionId: usersId,
                maxSelect: 1
            },
            {
                name: 'seller',
                type: 'relation',
                required: true,
                collectionId: usersId,
                maxSelect: 1
            }
        );
    }

    if (warehouseId) {
        fields.push({
            name: 'inventory_item',
            type: 'relation',
            required: true,
            collectionId: warehouseId,
            maxSelect: 1
        });
    }

    fields.push(
        { name: 'quantity', type: 'number', required: true },
        { name: 'total_price', type: 'number', required: true },
        {
            name: 'status',
            type: 'select',
            required: false,
            values: ['pending', 'paid', 'shipped', 'received', 'cancelled']
        },
        {
            name: 'payment_method',
            type: 'select',
            required: false,
            values: ['wallet', 'bank_transfer', 'cod']
        },
    );

    await upsertCollection(pb, {
        name: 'marketplace_transactions',
        type: 'base',
        listRule: '@request.auth.id = buyer || @request.auth.id = seller',
        viewRule: '@request.auth.id = buyer || @request.auth.id = seller',
        createRule: '@request.auth.role = "converter"',
        updateRule: '@request.auth.id = buyer || @request.auth.id = seller',
        deleteRule: null,
        fields,
        indexes: [
            'CREATE INDEX idx_mkt_buyer ON marketplace_transactions (buyer)',
            'CREATE INDEX idx_mkt_seller ON marketplace_transactions (seller)',
            'CREATE INDEX idx_mkt_status ON marketplace_transactions (status)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Marketplace Transactions migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateMarketplaceTransactions().catch(console.error);
}

export { migrateMarketplaceTransactions };
