/**
 * Migration: User Documents (Legality Documents per User)
 * Stores legal documents (NIB, SVLK, SK Pengesahan, etc.) for suppliers/generators.
 * One user can have multiple documents.
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateUserDocuments() {
    console.log('\n========================================');
    console.log('🎯 Starting User Documents Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    await upsertCollection(pb, {
        name: 'user_documents',
        type: 'base',
        listRule: '@request.auth.id = user',
        viewRule: '@request.auth.id = user || @request.auth.role = "enabler"',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id = user',
        deleteRule: '@request.auth.id = user',
        fields: [
            {
                name: 'user',
                type: 'relation',
                required: true,
                collectionId: usersId,
                cascadeDelete: true,
                maxSelect: 1,
            },
            {
                name: 'doc_type',
                type: 'select',
                required: true,
                values: ['NIB', 'SVLK', 'SK_Pengesahan', 'Izin_Usaha', 'Sertifikat_Lainnya', 'Lainnya'],
            },
            {
                name: 'doc_name',
                type: 'text',
                required: false, // custom display name (optional override)
            },
            {
                name: 'file',
                type: 'file',
                required: true,
                maxSelect: 1,
                maxSize: 10485760, // 10 MB
            },
            {
                name: 'verified',
                type: 'bool',
                required: false, // admin can mark document as verified
            },
            {
                name: 'notes',
                type: 'text',
                required: false, // admin notes on document
            },
        ],
        indexes: [
            'CREATE INDEX idx_user_documents_user ON user_documents (user)',
            'CREATE INDEX idx_user_documents_type ON user_documents (doc_type)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ User Documents migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateUserDocuments().catch(console.error);
}

export { migrateUserDocuments };
