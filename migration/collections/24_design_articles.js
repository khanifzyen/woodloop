/**
 * Migration: Design Articles (Desainer)
 * Based on docs/07-skema.md — collection 18
 */

import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';

async function migrateDesignArticles() {
    console.log('\n========================================');
    console.log('📝 Starting Design Articles Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();
    const usersId = await getCollectionId(pb, 'users');

    const fields = [
        {
            name: 'author',
            type: 'relation',
            required: true,
            collectionId: usersId,
            maxSelect: 1,
            cascadeDelete: true
        },
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'content', type: 'text', required: true },
        { name: 'excerpt', type: 'text', required: false },
        {
            name: 'cover_image',
            type: 'file',
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        },
        {
            name: 'category',
            type: 'select',
            required: false,
            values: ['dematerialization', 'design_for_disassembly', 'product_longevity', 'upcycling', 'general']
        },
        { name: 'published', type: 'bool', required: false },
        { name: 'tags', type: 'text', required: false },
    ];

    await upsertCollection(pb, {
        name: 'design_articles',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: '@request.auth.role = "designer"',
        updateRule: '@request.auth.role = "designer"',
        deleteRule: '@request.auth.role = "designer"',
        fields,
        indexes: [
            'CREATE UNIQUE INDEX idx_design_articles_slug ON design_articles (slug)',
            'CREATE INDEX idx_design_articles_author ON design_articles (author)',
            'CREATE INDEX idx_design_articles_published ON design_articles (published)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ Design Articles migration completed!');
    console.log('========================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    migrateDesignArticles().catch(console.error);
}

export { migrateDesignArticles };
