/**
 * Migration: Bids (Bidding/Auction)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateBids() {
    console.log('\n========================================');
    console.log('🎯 Starting Bids Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const wasteListingsId = await getCollectionId(pb, 'waste_listings');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    const fields = [];

    if (usersId) {
        fields.push({
            name: 'bidder',
            type: 'relation',
            required: true,
            collectionId: usersId,
            maxSelect: 1
        });
    }

    if (wasteListingsId) {
        fields.push({
            name: 'waste_listing',
            type: 'relation',
            required: true,
            collectionId: wasteListingsId,
            maxSelect: 1
        });
    }

    fields.push(
        { name: 'bid_amount', type: 'number', required: true, min: 0 },
        { name: 'message', type: 'text', required: false },
        {
            name: 'status',
            type: 'select',
            required: false,
            values: ['pending', 'accepted', 'rejected', 'expired']
        },
    );

    await upsertCollection(pb, {
        name: 'bids',
        type: 'base',
        listRule: '@request.auth.id = bidder || @request.auth.id = waste_listing.generator',
        viewRule: '@request.auth.id = bidder || @request.auth.id = waste_listing.generator',
        createRule: '@request.auth.role = "aggregator"',
        updateRule: '@request.auth.id = waste_listing.generator',
        deleteRule: '@request.auth.id = bidder && status = "pending"',
        fields,
        indexes: [
            'CREATE INDEX idx_bids_bidder ON bids (bidder)',
            'CREATE INDEX idx_bids_waste ON bids (waste_listing)',
            'CREATE INDEX idx_bids_status ON bids (status)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Bids migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateBids().catch(console.error);
}

export { migrateBids };
