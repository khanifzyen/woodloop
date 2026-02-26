/**
 * Migration: Wallet Transactions (All Roles)
 * Based on docs/07-skema.md
 * Immutable transaction log — create/update/delete only via hooks
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateWalletTransactions() {
    console.log('\n========================================');
    console.log('🎯 Starting Wallet Transactions Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    const fields = [];

    if (usersId) {
        fields.push({
            name: 'user',
            type: 'relation',
            required: true,
            collectionId: usersId,
            maxSelect: 1
        });
    }

    fields.push(
        {
            name: 'type',
            type: 'select',
            required: false,
            values: ['credit', 'debit']
        },
        { name: 'amount', type: 'number', required: true, min: 0 },
        { name: 'balance_after', type: 'number', required: false },
        { name: 'description', type: 'text', required: false },
        {
            name: 'reference_type',
            type: 'select',
            required: false,
            values: ['pickup', 'marketplace_transaction', 'order', 'topup', 'withdrawal']
        },
        { name: 'reference_id', type: 'text', required: false },
    );

    await upsertCollection(pb, {
        name: 'wallet_transactions',
        type: 'base',
        listRule: '@request.auth.id = user',
        viewRule: '@request.auth.id = user',
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields,
        indexes: [
            'CREATE INDEX idx_wallet_user ON wallet_transactions (user)',
            'CREATE INDEX idx_wallet_type ON wallet_transactions (type)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Wallet Transactions migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateWalletTransactions().catch(console.error);
}

export { migrateWalletTransactions };
