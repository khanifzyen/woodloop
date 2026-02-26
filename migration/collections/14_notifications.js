/**
 * Migration: Notifications (System)
 * Based on docs/07-skema.md
 * Create only via hooks, user can read/toggle/delete
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateNotifications() {
    console.log('\n========================================');
    console.log('🎯 Starting Notifications Migration...');
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
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'text', required: true },
        {
            name: 'type',
            type: 'select',
            required: false,
            values: ['order', 'pickup', 'payment', 'system', 'promo']
        },
        { name: 'is_read', type: 'bool', required: false },
        { name: 'reference_type', type: 'text', required: false },
        { name: 'reference_id', type: 'text', required: false },
    );

    await upsertCollection(pb, {
        name: 'notifications',
        type: 'base',
        listRule: '@request.auth.id = user',
        viewRule: '@request.auth.id = user',
        createRule: null,
        updateRule: '@request.auth.id = user',
        deleteRule: '@request.auth.id = user',
        fields,
        indexes: [
            'CREATE INDEX idx_notif_user ON notifications (user)',
            'CREATE INDEX idx_notif_read ON notifications (is_read)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Notifications migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateNotifications().catch(console.error);
}

export { migrateNotifications };
