/**
 * Migration: Design Recipes (Design Clinic)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateDesignRecipes() {
    console.log('\n========================================');
    console.log('🎯 Starting Design Recipes Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');
    const woodTypesId = await getCollectionId(pb, 'wood_types');

    const fields = [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: false },
    ];

    if (woodTypesId) {
        fields.push({
            name: 'suitable_wood_types',
            type: 'relation',
            required: false,
            collectionId: woodTypesId,
            maxSelect: 999
        });
    }

    fields.push(
        {
            name: 'suitable_forms',
            type: 'select',
            required: false,
            maxSelect: 5,
            values: ['offcut_large', 'offcut_small', 'shaving', 'sawdust', 'logs_end']
        },
        { name: 'photos', type: 'file', maxSelect: 5, maxSize: 5242880 },
    );

    if (usersId) {
        fields.push({
            name: 'author',
            type: 'relation',
            required: false,
            collectionId: usersId,
            maxSelect: 1
        });
    }

    fields.push({
        name: 'difficulty',
        type: 'select',
        required: false,
        values: ['easy', 'medium', 'hard']
    });

    await upsertCollection(pb, {
        name: 'design_recipes',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.role = "converter" || @request.auth.role = "enabler"',
        updateRule: '@request.auth.role = "converter" || @request.auth.role = "enabler"',
        deleteRule: '@request.auth.role = "converter" || @request.auth.role = "enabler"',
        fields,
        indexes: [
            'CREATE INDEX idx_recipes_author ON design_recipes (author)',
            'CREATE INDEX idx_recipes_difficulty ON design_recipes (difficulty)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Design Recipes migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateDesignRecipes().catch(console.error);
}

export { migrateDesignRecipes };
