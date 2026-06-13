/**
 * Migration: Add shipping_lat, shipping_lng, cancel_reason to orders
 * Based on docs/07-skema.md
 * Incremental field additions untuk Buyer → Converter orders.
 */

import { authenticateAdmin, getCollection } from '../pb-client.js';

async function updateOrdersFields() {
    console.log('\n========================================');
    console.log('🎯 Starting Orders Field Update...');
    console.log('========================================');

    const pb = await authenticateAdmin();

    // ── Orders (Buyer ↔ Converter) ──
    const ordersCol = await getCollection(pb, 'orders');
    if (!ordersCol) {
        console.error('❌ Orders collection not found.');
        process.exit(1);
    }

    const existingFields = ordersCol.fields || [];
    const fieldNames = existingFields.map(f => f.name);

    const newFields = [];

    if (!fieldNames.includes('shipping_lat')) {
        newFields.push({ name: 'shipping_lat', type: 'number', required: false });
        console.log('   + New field: shipping_lat (number)');
    }
    if (!fieldNames.includes('shipping_lng')) {
        newFields.push({ name: 'shipping_lng', type: 'number', required: false });
        console.log('   + New field: shipping_lng (number)');
    }
    if (!fieldNames.includes('cancel_reason')) {
        newFields.push({ name: 'cancel_reason', type: 'text', required: false });
        console.log('   + New field: cancel_reason (text)');
    }

    if (newFields.length === 0) {
        console.log('   ⏭️  No new fields to add for orders.');
    } else {
        const updatedFields = [...existingFields, ...newFields];
        await pb.collections.update(ordersCol.id, { fields: updatedFields });
        console.log(`   ✅ Added ${newFields.length} field(s) to orders.`);
    }

    console.log('\n========================================');
    console.log('✅ Orders fields update completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    updateOrdersFields().catch(console.error);
}

export { updateOrdersFields };
