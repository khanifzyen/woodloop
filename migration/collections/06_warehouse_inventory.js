/**
 * Migration: Warehouse Inventory (Aggregator)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateWarehouseInventory() {
    console.log('\n========================================');
    console.log('🎯 Starting Warehouse Inventory Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const pickupsId = await getCollectionId(pb, 'pickups');
    const woodTypesId = await getCollectionId(pb, 'wood_types');

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

    if (pickupsId) {
        fields.push({
            name: 'pickup',
            type: 'relation',
            required: true,
            collectionId: pickupsId,
            maxSelect: 1
        });
    }

    if (woodTypesId) {
        fields.push({
            name: 'wood_type',
            type: 'relation',
            required: false,
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
        { name: 'weight', type: 'number', required: true },
        { name: 'price_per_kg', type: 'number', required: false },
        {
            name: 'status',
            type: 'select',
            required: false,
            values: ['in_stock', 'reserved', 'sold']
        },
        { name: 'photos', type: 'file', maxSelect: 3, maxSize: 5242880 },
    );

    await upsertCollection(pb, {
        name: 'warehouse_inventory',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id = aggregator',
        updateRule: '@request.auth.id = aggregator',
        deleteRule: '@request.auth.id = aggregator && status = "in_stock"',
        fields,
        indexes: [
            'CREATE INDEX idx_warehouse_aggregator ON warehouse_inventory (aggregator)',
            'CREATE INDEX idx_warehouse_status ON warehouse_inventory (status)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Warehouse Inventory migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateWarehouseInventory().catch(console.error);
}

export { migrateWarehouseInventory };
