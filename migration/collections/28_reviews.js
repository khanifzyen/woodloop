/**
 * Migration: Reviews (Buyer → Product)
 * Based on docs/07-skema.md
 * Rating & ulasan untuk produk dari pembeli yang sudah menyelesaikan pesanan.
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateReviews() {
    console.log('\n========================================');
    console.log('🎯 Starting Reviews Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const productsId = await getCollectionId(pb, 'products');
    const ordersId = await getCollectionId(pb, 'orders');

    if (!usersId || !productsId) {
        console.error('❌ Users/Products collection not found. Run earlier migrations first.');
        process.exit(1);
    }

    const fields = [];

    if (productsId) {
        fields.push({
            name: 'product',
            type: 'relation',
            required: true,
            collectionId: productsId,
            maxSelect: 1
        });
    }

    if (usersId) {
        fields.push({
            name: 'buyer',
            type: 'relation',
            required: true,
            collectionId: usersId,
            maxSelect: 1
        });
    }

    if (ordersId) {
        fields.push({
            name: 'order',
            type: 'relation',
            required: true,
            collectionId: ordersId,
            maxSelect: 1
        });
    }

    fields.push(
        { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
        { name: 'comment', type: 'text', required: false },
    );

    await upsertCollection(pb, {
        name: 'reviews',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: '@request.auth.role = "buyer" && @request.auth.id = buyer',
        updateRule: '@request.auth.id = buyer',
        deleteRule: '@request.auth.id = buyer',
        fields,
        indexes: [
            'CREATE INDEX idx_reviews_product ON reviews (product)',
            'CREATE INDEX idx_reviews_buyer ON reviews (buyer)',
            'CREATE UNIQUE INDEX idx_reviews_order_product ON reviews (product, buyer)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Reviews migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateReviews().catch(console.error);
}

export { migrateReviews };
