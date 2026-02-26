# PocketBase Migration Style Guide

Project ini menggunakan mekanisme migrasi skema database **custom berbasis Node.js** (`migration/`), bukan menggunakan fitur migrasi bawaan PocketBase (Go) atau tools eksternal lainnya. Pendekatan ini dipilih untuk fleksibilitas dan kemudahan integrasi dengan workflow JavaScript/TypeScript.

## Arsitektur Migrasi

Arsitektur migrasi terdiri dari tiga komponen utama:

1.  **Runner (`migration/index.js`)**: Script utama yang mengeksekusi file-file migrasi secara berurutan dalam `try/catch` dengan `process.exit(1)` jika gagal.
2.  **Client Helper (`migration/pb-client.js`)**: Wrapper di atas SDK PocketBase yang menyediakan fungsi utilitas. Menggunakan **singleton PocketBase instance** dengan `autoCancellation(false)` dan resolusi `.env` via `__dirname`.
3.  **Collection Migrations (`migration/collections/*.js`)**: File definisi skema untuk setiap collection (atau grup collection terkait).

### Struktur Direktori

```
migration/
├── .env                # Environment variables (URL, Admin Credentials)
├── .env.example        # Template environment variables
├── index.js            # Entry point (Runner)
├── pb-client.js        # PocketBase SDK Wrapper & Helpers
├── package.json        # Dependencies + individual migration scripts
└── collections/        # File definisi migrasi
    ├── 01_users.js
    ├── 02_wood_types.js
    ├── 03_raw_timber_listings.js
    └── ...
```

### Environment Variables

File `.env` menggunakan prefix `POCKETBASE_`:

```
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=your_admin_password
```

## pb-client.js — Pola Singleton

`pb-client.js` menggunakan pola **singleton** — PocketBase instance dibuat sekali di level modul, bukan per-fungsi:

```javascript
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const pb = new PocketBase(process.env.POCKETBASE_URL);
pb.autoCancellation(false); // Penting! Mencegah race condition

export { pb };
```

### Fungsi-Fungsi Utama

| Fungsi | Deskripsi |
| :--- | :--- |
| `authenticateAdmin()` | Login sebagai superuser, return `pb` instance |
| `collectionExists(pb, name)` | Cek apakah collection ada (return boolean) |
| `getCollection(pb, name)` | Get collection object (return null jika tidak ada) |
| `getCollectionId(pb, name)` | Get collection ID string untuk relasi |
| `upsertCollection(pb, schema)` | **Inti migrasi** — create/update idempotent |

## Cara Kerja (`upsertCollection`)

Fungsi ini bersifat **idempotent**, artinya aman dijalankan berkali-kali.

Logika `upsertCollection`:

1.  Cek apakah collection sudah ada (`getCollection`).
2.  **Jika Belum Ada:**
    - Create collection baru dengan skema lengkap (fields, indexes, rules).
    - Jalankan `verifyFields()` untuk memastikan semua field berhasil tersimpan.
    - Log setiap field yang dibuat.
3.  **Jika Sudah Ada:**
    - Bandingkan fields yang didefinisikan di kode dengan yang ada di database.
    - Jika ada field baru, tambahkan ke array `updatedFields`.
    - Jika ada perubahan properti (seperti `required` atau `type`), update field tersebut.
    - Merge indexes (menambahkan index baru tanpa menghapus yang lama, berdasarkan nama index).
    - Cek dan update API Rules jika berbeda.
    - **Skip update jika tidak ada perubahan** (`⏭️ No changes detected`).

> **Note:** Script ini **TIDAK MENGHAPUS** field atau collection yang sudah ada di database tapi tidak ada di kode (non-destructive), kecuali untuk properti spesifik yang ditimpa.

## Panduan Membuat Migrasi Baru

### 1. Buat File Baru

Buat file di `migration/collections/` dengan penomoran urut, misal `18_new_feature.js`.

### 2. Import Helper

```javascript
import { authenticateAdmin, upsertCollection, getCollectionId } from '../pb-client.js';
```

### 3. Definisikan Fungsi Migrasi

Gunakan pola berikut — **relation fields ditambahkan secara kondisional** menggunakan `getCollectionId` dan `push`:

```javascript
async function migrateNewFeature() {
    console.log('\n========================================');
    console.log('🎯 Starting New Feature Migration...');
    console.log('========================================');

    const pb = await authenticateAdmin();

    // Ambil ID collection lain untuk relasi (jika perlu)
    const usersId = await getCollectionId(pb, 'users');

    if (!usersId) {
        console.error('❌ Users collection not found. Run 01_users.js first.');
        process.exit(1);
    }

    // Bangun fields array — tambahkan relasi secara kondisional
    const fields = [];

    if (usersId) {
        fields.push({
            name: 'user',
            type: 'relation',
            required: true,
            collectionId: usersId,
            maxSelect: 1
        });
    }

    fields.push(
        { name: 'title', type: 'text', required: true },
        { name: 'amount', type: 'number', required: true, min: 0 },
        {
            name: 'status',
            type: 'select',
            required: false,
            values: ['active', 'inactive']
        },
        { name: 'photo', type: 'file', maxSelect: 1, maxSize: 5242880 },
    );

    await upsertCollection(pb, {
        name: 'new_feature',
        type: 'base',
        // API Rules (kosongkan string '' untuk public, null untuk admin-only/hook-only)
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id = user',
        deleteRule: null,
        fields,
        indexes: [
            'CREATE INDEX idx_feature_user ON new_feature (user)',
            'CREATE INDEX idx_feature_status ON new_feature (status)',
        ],
    });

    console.log('\n========================================');
    console.log('✅ New Feature migration completed!');
    console.log('========================================\n');
}

// Boilerplate agar bisa dijalankan standalone atau via runner
if (import.meta.url === `file://${process.argv[1]}`) {
    migrateNewFeature().catch(console.error);
}

export { migrateNewFeature };
```

### 4. Khusus Auth Collection (`users`)

Untuk collection `users` yang sudah ada sebagai Auth Collection, **jangan gunakan `upsertCollection`**. Gunakan pola manual:

```javascript
import { authenticateAdmin, getCollection } from '../pb-client.js';

async function migrateUsers() {
    const pb = await authenticateAdmin();
    const existing = await getCollection(pb, 'users');

    if (!existing) {
        console.error('❌ Users collection not found.');
        process.exit(1);
    }

    const customFields = [
        { name: 'name', type: 'text', required: true },
        // ... field lainnya
    ];

    // Check mana yang belum ada
    const existingFieldNames = existing.fields?.map(f => f.name) || [];
    const newFields = customFields.filter(f => !existingFieldNames.includes(f.name));

    // Merge lalu update
    const mergedFields = [...existing.fields, ...newFields];

    await pb.collections.update('users', {
        fields: mergedFields,
        listRule: '...',
        // ... rules lainnya
    });
}
```

### 5. Daftarkan di Runner

Edit `migration/index.js`, import fungsi baru, dan panggil di dalam `runAllMigrations`:

```javascript
import { migrateNewFeature } from './collections/18_new_feature.js';

// Di dalam try block:
console.log('\n🆕 [18/18] Migrating New Feature...');
await migrateNewFeature();
```

### 6. Tambahkan Script Individual di `package.json`

```json
"migrate:new-feature": "node collections/18_new_feature.js"
```

## Konvensi Penting

### Field Types

| Type | Contoh Properti |
| :--- | :--- |
| `text` | `{ name: 'title', type: 'text', required: true }` |
| `number` | `{ name: 'price', type: 'number', required: true, min: 0 }` |
| `bool` | `{ name: 'is_read', type: 'bool', required: false }` |
| `date` | `{ name: 'deadline', type: 'date', required: true }` |
| `select` | `{ name: 'status', type: 'select', values: ['a', 'b'], maxSelect: 1 }` |
| `file` | `{ name: 'photo', type: 'file', maxSelect: 1, maxSize: 5242880 }` |
| `relation` | `{ name: 'user', type: 'relation', collectionId: usersId, maxSelect: 1 }` |
| `url` | `{ name: 'link', type: 'url', required: false }` |
| `editor` | `{ name: 'content', type: 'editor', required: true }` |

### API Rules

| Value | Arti |
| :--- | :--- |
| `''` (string kosong) | Publik (siapa saja bisa akses) |
| `null` | Admin-only / Hook-only (tidak bisa diakses via API) |
| `'@request.auth.id != ""'` | Hanya user yang sudah login |
| `'@request.auth.id = user'` | Hanya pemilik record |
| `'@request.auth.role = "admin"'` | Hanya user dengan role admin |

## Menjalankan Migrasi

1.  Pastikan file `.env` di folder `migration/` sudah terisi dengan kredensial Admin PocketBase.
2.  Jalankan perintah:

```bash
cd migration
npm install
npm run migrate
```

Untuk menjalankan migrasi individual:

```bash
npm run migrate:users
npm run migrate:wood-types
# dll
```
