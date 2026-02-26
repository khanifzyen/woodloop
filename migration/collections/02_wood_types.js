/**
 * Migration: Wood Types (Master Data)
 * Based on docs/07-skema.md
 */

import { authenticateAdmin, upsertCollection } from '../pb-client.js';

async function migrateWoodTypes() {
    console.log('\n========================================');
    console.log('🎯 Starting Wood Types Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();

    await upsertCollection(pb, {
        name: 'wood_types',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: '@request.auth.role = "enabler"',
        updateRule: '@request.auth.role = "enabler"',
        deleteRule: '@request.auth.role = "enabler"',
        fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'carbon_factor', type: 'number', required: false },
        ],
        indexes: [
            'CREATE UNIQUE INDEX idx_wood_types_name ON wood_types (name)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Wood Types migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateWoodTypes().catch(console.error);
}

export { migrateWoodTypes };
