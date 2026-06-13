/**
 * Migration: Update user_documents API rule to allow enabler to update documents
 * (approve/reject verification, add notes)
 */

import { authenticateAdmin, getCollection } from '../pb-client.js';

async function updateUserDocumentsRule() {
    console.log('\n========================================');
    console.log('🔄 Updating user_documents rule — adding enabler update access...');
    console.log('========================================');

    const pb = await authenticateAdmin();

    const col = await getCollection(pb, 'user_documents');
    if (!col) {
        console.error('❌ user_documents collection not found. Run migration 18 first.');
        process.exit(1);
    }

    try {
        await pb.collections.update(col.id, {
            updateRule: '@request.auth.id = user || @request.auth.role = "enabler"',
        });
        console.log('   ✅ Updated updateRule — enabler can now update documents');
    } catch (error) {
        console.error('   ❌ Failed:', error.message);
        if (error.response?.data) {
            console.error('      Details:', JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }

    console.log('\n========================================');
    console.log('✅ user_documents rule updated!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    updateUserDocumentsRule().catch(console.error);
}

export { updateUserDocumentsRule };
