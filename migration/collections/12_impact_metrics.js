/**
 * Migration: Impact Metrics (Auto-calculated)
 * Based on docs/07-skema.md
 * Public read, create/update only via hooks
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateImpactMetrics() {
    console.log('\n========================================');
    console.log('🎯 Starting Impact Metrics Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const wasteListingsId = await getCollectionId(pb, 'waste_listings');
    const pickupsId = await getCollectionId(pb, 'pickups');

    const fields = [];

    if (wasteListingsId) {
        fields.push({
            name: 'waste_listing',
            type: 'relation',
            required: false,
            collectionId: wasteListingsId,
            maxSelect: 1
        });
    }

    if (pickupsId) {
        fields.push({
            name: 'pickup',
            type: 'relation',
            required: false,
            collectionId: pickupsId,
            maxSelect: 1
        });
    }

    fields.push(
        { name: 'co2_saved', type: 'number', required: false },
        { name: 'waste_diverted', type: 'number', required: false },
        { name: 'economic_value', type: 'number', required: false },
        { name: 'period', type: 'text', required: false },
    );

    await upsertCollection(pb, {
        name: 'impact_metrics',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields,
        indexes: [
            'CREATE INDEX idx_impact_period ON impact_metrics (period)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Impact Metrics migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateImpactMetrics().catch(console.error);
}

export { migrateImpactMetrics };
