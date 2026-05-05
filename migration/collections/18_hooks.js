/**
 * Migration: PocketBase Hooks
 * 
 * Hooks sudah dibuat di file terpisah: pb_hooks/woodloop.pb.js
 * 
 * File tersebut di-upload manual ke folder pb_hooks/ di server PocketBase.
 * Tidak perlu di-run via migrasi ini.
 * 
 * Lihat pb_hooks/README.md untuk instruksi deploy.
 */

import { authenticateAdmin } from '../pb-client.js';

async function setupHooks() {
    console.log('\n========================================');
    console.log('🎯 PocketBase Hooks');
    console.log('========================================');
    console.log('');
    console.log('✅ Hooks sudah dibuat di: pb_hooks/woodloop.pb.js');
    console.log('');
    console.log('📋 Cara deploy:');
    console.log('   1. Upload pb_hooks/woodloop.pb.js ke server PocketBase');
    console.log('   2. Taruh di folder pb_hooks/ (di samping executable PB)');
    console.log('   3. Restart PocketBase');
    console.log('');
    console.log('📄 Baca pb_hooks/README.md untuk instruksi lengkap.');
    console.log('');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    setupHooks().catch(console.error);
}

export { setupHooks };
