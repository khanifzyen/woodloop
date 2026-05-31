/**
 * Migration: Backfill raw_timber_order_details from existing raw_timber_orders
 *
 * Existing raw_timber_orders have a single `listing` field directly on the record.
 * This script creates one raw_timber_order_detail per existing order that has
 * a listing populated and doesn't already have details.
 */

import { authenticateAdmin } from '../pb-client.js';

async function backfillOrderDetails() {
    console.log('\n========================================');
    console.log('🎯 Starting Backfill: raw_timber_order_details...');
    console.log('========================================');

    const pb = await authenticateAdmin();

    // Get all raw_timber_orders that have a listing field populated
    const orders = await pb.collection('raw_timber_orders').getList(1, 200, {
        sort: '-created',
    });

    console.log(`Found ${orders.totalItems} raw_timber_orders. Checking for details...`);

    let backfilled = 0;
    let skipped = 0;

    for (const order of orders.items) {
        const listing = order.listing;
        if (!listing) {
            skipped++;
            console.log(`  ⏭️  Order ${order.id}: no listing field, skipping`);
            continue;
        }

        // Check if details already exist for this order
        const existingDetails = await pb.collection('raw_timber_order_details').getList(1, 1, {
            filter: `order="${order.id}"`,
        });

        if (existingDetails.totalItems > 0) {
            skipped++;
            console.log(`  ⏭️  Order ${order.id}: already has ${existingDetails.totalItems} detail(s)`);
            continue;
        }

        // Create one detail record from the old flat fields
        const quantity = order.quantity || 1;
        const unitPrice = order.total_price / quantity;
        const subtotal = order.total_price;

        await pb.collection('raw_timber_order_details').create({
            order: order.id,
            listing: listing,
            quantity: quantity,
            unit_price: unitPrice,
            subtotal: subtotal,
        });

        backfilled++;
        console.log(`  ✓ Order ${order.id}: created detail (listing=${listing}, qty=${quantity}, price=${unitPrice})`);
    }

    console.log('\n========================================');
    console.log('✅ Backfill completed!');
    console.log(`   Total orders: ${orders.totalItems}`);
    console.log(`   Backfilled: ${backfilled}`);
    console.log(`   Skipped: ${skipped}`);
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    backfillOrderDetails().catch(console.error);
}

export { backfillOrderDetails };
