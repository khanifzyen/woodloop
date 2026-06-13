/**
 * Migration: Wishlist (Buyer → Product)
 * Based on docs/07-skema.md
 * Produk favorit yang disimpan Buyer untuk dibeli nanti.
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateWishlist() {
    console.log('\n========================================');
    console.log('🎯 Starting Wishlist Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const productsId = await getCollectionId(pb, 'products');

    if (!usersId || !productsId) {
        console.error('❌ Users/Products collection not found. Run earlier migrations first.');
        process.exit(1);
    }

    const fields = [];

    if (usersId) {
        fields.push({
            name: 'buyer',
            type: 'relation',
            required: true,
            collectionId: usersId,
            cascadeDelete: true,
            maxSelect: 1
        });
    }

    if (productsId) {
        fields.push({
            name: 'product',
            type: 'relation',
            required: true,
            collectionId: productsId,
            maxSelect: 1
        });
    }

    // no additional scalar fields

    await upsertCollection(pb, {
        name: 'wishlist',
        type: 'base',
        listRule: '@request.auth.id = buyer',
        viewRule: '@request.auth.id = buyer',
        createRule: '@request.auth.id = buyer',
        updateRule: '@request.auth.id = buyer',
        deleteRule: '@request.auth.id = buyer',
        fields,
        indexes: [
            'CREATE INDEX idx_wishlist_buyer ON wishlist (buyer)',
            'CREATE INDEX idx_wishlist_product ON wishlist (product)',
            'CREATE UNIQUE INDEX idx_wishlist_buyer_product ON wishlist (buyer, product)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Wishlist migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateWishlist().catch(console.error);
}

export { migrateWishlist };
