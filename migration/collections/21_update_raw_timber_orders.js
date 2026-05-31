/**
 * Migration: Update raw_timber_orders schema
 * - Remove `listing` field (moved to raw_timber_order_details)
 * - Remove `quantity` field (moved to raw_timber_order_details)
 *
 * Must run AFTER: 19_raw_timber_order_details.js, 20_backfill_order_details.js
 */

import { authenticateAdmin } from '../pb-client.js';

async function updateRawTimberOrders() {
    console.log('\n========================================');
    console.log('🎯 Updating raw_timber_orders schema...');
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
    const fieldsToRemove = ['listing', 'quantity'];
    let hasChanges = false;

    const updatedFields = existingFields.filter((f) => {
        if (fieldsToRemove.includes(f.name)) {
            console.log(`   - Removing field: ${f.name}`);
            hasChanges = true;
            return false;
        }
        return true;
    });

    if (!hasChanges) {
        console.log('   ⏭️  Fields already removed. No changes needed.');
        return;
    }

    // Update collection with filtered fields
    await pb.collections.update(collection.id, {
        fields: updatedFields,
        indexes: collection.indexes || [],
        listRule: collection.listRule,
        viewRule: collection.viewRule,
        createRule: collection.createRule,
        updateRule: collection.updateRule,
        deleteRule: collection.deleteRule,
    });

    console.log('   ✅ Fields removed successfully from raw_timber_orders');

    // Verify
    const updated = await pb.collections.getOne('raw_timber_orders');
    const remainingNames = updated.fields.map((f) => f.name);
    console.log(`   📋 Remaining fields: ${remainingNames.join(', ')}`);

    console.log('\n========================================');
    console.log('✅ raw_timber_orders update completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    updateRawTimberOrders().catch(console.error);
}

export { updateRawTimberOrders };
