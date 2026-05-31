/**
 * Migration: Add total_quantity to raw_timber_orders
 *
 * Adds a convenience field total_quantity (sum of detail quantities)
 * so we don't need to expand details just to show the count.
 */

import { authenticateAdmin } from '../pb-client.js';

async function addTotalQuantity() {
    console.log('\n========================================');
    console.log('🎯 Adding total_quantity to raw_timber_orders...');
    console.log('========================================');

    const pb = await authenticateAdmin();

    // Get existing collection
    let collection;
    try {
        collection = await pb.collections.getOne('raw_timber_orders');
    } catch (err) {
        console.error('❌ raw_timber_orders collection not found:', err.message);
        process.exit(1);
    }

    const existingFields = collection.fields || [];
    const hasField = existingFields.some((f) => f.name === 'total_quantity');

    if (hasField) {
        console.log('   ⏭️  total_quantity already exists. No changes needed.');
        return;
    }

    const updatedFields = [
        ...existingFields,
        { name: 'total_quantity', type: 'number', required: false, min: 0 },
    ];

    await pb.collections.update(collection.id, {
        fields: updatedFields,
        indexes: collection.indexes || [],
        listRule: collection.listRule,
        viewRule: collection.viewRule,
        createRule: collection.createRule,
        updateRule: collection.updateRule,
        deleteRule: collection.deleteRule,
    });

    console.log('   ✅ total_quantity field added successfully');

    // Backfill existing orders
    console.log('\n   📦 Backfilling total_quantity for existing orders...');
    const orders = await pb.collection('raw_timber_orders').getList(1, 200, { sort: '-created' });
    let updated = 0;

    for (const order of orders.items) {
        const details = await pb.collection('raw_timber_order_details').getList(1, 100, {
            filter: `order="${order.id}"`,
        });
        const totalQty = details.items.reduce((sum, d) => sum + (d.quantity || 0), 0);
        if (totalQty > 0 || order.total_quantity !== totalQty) {
            await pb.collection('raw_timber_orders').update(order.id, { total_quantity: totalQty });
            updated++;
            console.log(`   ✓ Order ${order.id}: total_quantity → ${totalQty}`);
        }
    }

    console.log(`   ✅ Backfilled ${updated} orders`);

    console.log('\n========================================');
    console.log('✅ total_quantity migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    addTotalQuantity().catch(console.error);
}

export { addTotalQuantity };
