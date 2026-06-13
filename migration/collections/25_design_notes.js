/**
 * Migration: Design Notes (Desainer)
 * Based on docs/07-skema.md — collection 19
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateDesignNotes() {
    console.log('\n========================================');
    console.log('📋 Starting Design Notes Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');

    const fields = [
        {
            name: 'designer',
            type: 'relation',
            required: true,
            collectionId: usersId,
            maxSelect: 1
        },
        {
            name: 'target_type',
            type: 'select',
            required: true,
            values: ['generator_product', 'converter_product']
        },
        { name: 'target_id', type: 'text', required: true },
        { name: 'content', type: 'text', required: true },
        {
            name: 'sketch',
            type: 'file',
            maxSelect: 3,
            maxSize: 5242880,
            mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        },
        { name: 'is_public', type: 'bool', required: false },
    ];

    await upsertCollection(pb, {
        name: 'design_notes',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.role = "designer"',
        updateRule: '@request.auth.role = "designer"',
        deleteRule: '@request.auth.role = "designer"',
        fields,
        indexes: [
            'CREATE INDEX idx_design_notes_designer ON design_notes (designer)',
            'CREATE INDEX idx_design_notes_target ON design_notes (target_type, target_id)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Design Notes migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateDesignNotes().catch(console.error);
}

export { migrateDesignNotes };
