/**
 * Migration: Chats (Communication)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateChats() {
    console.log('\n========================================');
    console.log('🎯 Starting Chats Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    const fields = [];

    if (usersId) {
        fields.push(
            {
                name: 'sender',
                type: 'relation',
                required: true,
                collectionId: usersId,
                maxSelect: 1
            },
            {
                name: 'receiver',
                type: 'relation',
                required: true,
                collectionId: usersId,
                maxSelect: 1
            }
        );
    }

    fields.push(
        { name: 'message', type: 'text', required: true },
        { name: 'is_read', type: 'bool', required: false },
        { name: 'attachment', type: 'file', maxSelect: 1, maxSize: 10485760 },
    );

    await upsertCollection(pb, {
        name: 'chats',
        type: 'base',
        listRule: '@request.auth.id = sender || @request.auth.id = receiver',
        viewRule: '@request.auth.id = sender || @request.auth.id = receiver',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id = receiver',
        deleteRule: '@request.auth.id = sender',
        fields,
        indexes: [
            'CREATE INDEX idx_chats_sender ON chats (sender)',
            'CREATE INDEX idx_chats_receiver ON chats (receiver)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Chats migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateChats().catch(console.error);
}

export { migrateChats };
