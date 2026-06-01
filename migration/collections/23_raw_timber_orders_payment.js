/**
 * Migration: Add payment fields to raw_timber_orders
 *
 * Adds snap_token, snap_redirect_url, and payment_method fields
 * to support Midtrans Snap payment integration.
 *
 * Based on docs/07-skema.md — same fields as orders collection.
 */

import { authenticateAdmin } from '../pb-client.js';

async function addPaymentFields() {
    console.log('\n========================================');
    console.log('🎯 Adding payment fields to raw_timber_orders...');
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

    const existingNames = new Set(collection.fields.map((f) => f.name));
    const newFields = [];

    if (!existingNames.has('snap_token')) {
        newFields.push({ name: 'snap_token', type: 'text', required: false });
        console.log('   📦 Adding snap_token...');
    } else {
        console.log('   ⏭️  snap_token already exists');
    }

    if (!existingNames.has('snap_redirect_url')) {
        newFields.push({ name: 'snap_redirect_url', type: 'url', required: false });
        console.log('   📦 Adding snap_redirect_url...');
    } else {
        console.log('   ⏭️  snap_redirect_url already exists');
    }

    if (!existingNames.has('payment_method')) {
        newFields.push({
            name: 'payment_method',
            type: 'select',
            required: false,
            values: ['qris', 'virtual_account', 'bank_transfer', 'cod'],
        });
        console.log('   📦 Adding payment_method...');
    } else {
        console.log('   ⏭️  payment_method already exists');
    }

    if (newFields.length === 0) {
        console.log('   ✅ All fields already exist. No changes needed.');
        return;
    }

    await pb.collections.update(collection.id, {
        fields: [...collection.fields, ...newFields],
        indexes: collection.indexes || [],
        listRule: collection.listRule,
        viewRule: collection.viewRule,
        createRule: collection.createRule,
        updateRule: collection.updateRule,
        deleteRule: collection.deleteRule,
    });

    console.log(`   ✅ Added ${newFields.length} field(s) successfully`);
    console.log('\n========================================');
    console.log('✅ Payment fields migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    addPaymentFields().catch(console.error);
}

export { addPaymentFields };
