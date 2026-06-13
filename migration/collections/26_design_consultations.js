/**
 * Migration: Design Consultations (Marketplace Jasa Desain)
 * Based on docs/07-skema.md — collection 20
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateDesignConsultations() {
    console.log('\n========================================');
    console.log('🤝 Starting Design Consultations Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');

    const fields = [
        {
            name: 'designer',
            type: 'relation',
            required: false,
            collectionId: usersId,
            maxSelect: 1
        },
        {
            name: 'client',
            type: 'relation',
            required: true,
            collectionId: usersId,
            maxSelect: 1
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: false },
        { name: 'budget', type: 'number', required: false },
        {
            name: 'status',
            type: 'select',
            required: false,
            values: ['open', 'negotiation', 'in_progress', 'completed', 'cancelled']
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            values: ['client_request', 'designer_offer']
        },
    ];

    await upsertCollection(pb, {
        name: 'design_consultations',
        type: 'base',
        listRule: '@request.auth.id = designer || @request.auth.id = client',
        viewRule: '@request.auth.id = designer || @request.auth.id = client',
        createRule: '@request.auth.role = "designer" || @request.auth.role = "generator" || @request.auth.role = "converter"',
        updateRule: '@request.auth.id = designer || @request.auth.id = client',
        deleteRule: '@request.auth.id = designer || @request.auth.id = client',
        fields,
        indexes: [
            'CREATE INDEX idx_design_consultations_designer ON design_consultations (designer)',
            'CREATE INDEX idx_design_consultations_client ON design_consultations (client)',
            'CREATE INDEX idx_design_consultations_status ON design_consultations (status)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Design Consultations migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateDesignConsultations().catch(console.error);
}

export { migrateDesignConsultations };
