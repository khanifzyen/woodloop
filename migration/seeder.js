import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL);
const DEFAULT_PASSWORD = 'password12345';

function qrCodeId() {
  return 'wl-' + crypto.randomUUID().slice(0, 8);
}

async function seedData() {
    console.log('🌱 Starting WoodLoop Database Seeder...');

    try {
        console.log('Authenticating as admin...');
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        // ====================================================================
        // 1. Wood Types
        // ====================================================================
        console.log('\n🌲 Seeding Wood Types...');
        const woodTypesData = [
            { name: 'Jati', carbon_factor: 1.5 },
            { name: 'Mahoni', carbon_factor: 1.4 },
            { name: 'Trembesi', carbon_factor: 1.2 },
            { name: 'Mindi', carbon_factor: 1.1 },
            { name: 'Akasia', carbon_factor: 1.3 },
            { name: 'Pinus', carbon_factor: 1.0 },
            { name: 'Sungkai', carbon_factor: 0.9 },
            { name: 'Lainnya', carbon_factor: 0 },
        ];
        const woodTypesMap = {};
        for (const wt of woodTypesData) {
            try {
                const existing = await pb.collection('wood_types').getFirstListItem(`name="${wt.name}"`);
                woodTypesMap[wt.name] = existing.id;
            } catch (err) {
                if (err.status === 404) {
                    const r = await pb.collection('wood_types').create(wt);
                    woodTypesMap[wt.name] = r.id;
                    console.log(`  + Created wood type "${wt.name}"`);
                }
            }
        }

        // ====================================================================
        // 2. Demo Users — semua 7 role
        // ====================================================================
        console.log('\n👥 Seeding Demo Users...');
        const roles = ['supplier', 'generator', 'aggregator', 'converter', 'enabler', 'buyer', 'designer'];
        const usersMap = {};
        for (const role of roles) {
            const email = `demo.${role}@woodloop.id`;
            const name = `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`;
            try {
                const existing = await pb.collection('users').getFirstListItem(`email="${email}"`);
                usersMap[role] = existing.id;
                await pb.collection('users').update(existing.id, { password: DEFAULT_PASSWORD, passwordConfirm: DEFAULT_PASSWORD });
            } catch (err) {
                if (err.status === 404) {
                    const r = await pb.collection('users').create({
                        email, password: DEFAULT_PASSWORD, passwordConfirm: DEFAULT_PASSWORD,
                        name, role, emailVisibility: true, verified: true,
                        phone: `081234567${Math.floor(Math.random() * 1000)}`,
                        workshop_name: `${name} Workshop`,
                        address: 'Jl. Pemuda No. 1, Jepara',
                        location_lat: -6.58 + (Math.random() - 0.5) * 0.05,
                        location_lng: 110.66 + (Math.random() - 0.5) * 0.05,
                    });
                    usersMap[role] = r.id;
                    console.log(`  + Created user "${email}"`);
                }
            }
        }

        // Indonesian spelling variant for aggregator
        const agregatorEmail = 'demo.agregator@woodloop.id';
        try {
            await pb.collection('users').getFirstListItem(`email="${agregatorEmail}"`);
            console.log(`  - User "${agregatorEmail}" already exists`);
        } catch (err) {
            if (err.status === 404 && usersMap['aggregator']) {
                await pb.collection('users').create({
                    email: agregatorEmail, password: DEFAULT_PASSWORD, passwordConfirm: DEFAULT_PASSWORD,
                    name: 'Demo Agregator', role: 'aggregator', emailVisibility: true, verified: true,
                    phone: '081234567999',
                    workshop_name: 'Demo Agregator Workshop',
                    address: 'Jl. Pemuda No. 1, Jepara',
                    location_lat: -6.58 + (Math.random() - 0.5) * 0.05,
                    location_lng: 110.66 + (Math.random() - 0.5) * 0.05,
                });
                console.log(`  + Created user "${agregatorEmail}"`);
            }
        }

        // ====================================================================
        // 3. RAW TIMBER LISTINGS (Supplier)
        // ====================================================================
        console.log('\n🪵 Seeding Raw Timber Listings (Supplier)...');
        const timberData = [
            { wood_type: 'Jati', shape: 'log', diameter: 40, length: 300, volume: 0.38, price: 2500000, unit: 'm3', grade: 'perhutani', status: 'available', description: 'Kayu Jati Perhutani grade A, diameter 40cm panjang 3m' },
            { wood_type: 'Mahoni', shape: 'square', width: 15, height: 15, length: 200, volume: 0.045, price: 450000, unit: 'batang', grade: 'hutan_rakyat', status: 'available', description: 'Balok Mahoni ukuran 15x15cm panjang 2m' },
            { wood_type: 'Trembesi', shape: 'papan', width: 30, height: 4, length: 250, volume: 0.03, price: 350000, unit: 'batang', grade: 'hutan_rakyat', status: 'available', description: 'Papan Trembesi lebar 30cm tebal 4cm panjang 2.5m — cocok meja' },
        ];
        for (const t of timberData) {
            try {
                const existing = await pb.collection('raw_timber_listings').getFirstListItem(`description="${t.description}"`);
                console.log(`  - Timber "${t.description.slice(0, 40)}..." already exists`);
            } catch (err) {
                if (err.status === 404) {
                    await pb.collection('raw_timber_listings').create({
                        ...t,
                        wood_type: woodTypesMap[t.wood_type],
                        supplier: usersMap['supplier'],
                        stock: 5,
                    });
                    console.log(`  + Created timber "${t.shape} ${t.wood_type}"`);
                }
            }
        }

        // ====================================================================
        // 4. WASTE LISTINGS (Generator)
        // ====================================================================
        console.log('\n♻️ Seeding Waste Listings (Generator)...');
        const wasteData = [
            { wood_type: 'Jati', form: 'offcut_small', condition: 'dry', volume: 50, unit: 'kg', price_estimate: 25000, status: 'available', description: 'Potongan kecil sisa pembuatan kursi Jati, kondisi kering cocok untuk craft kecil.' },
            { wood_type: 'Mahoni', form: 'sawdust', condition: 'dry', volume: 5, unit: 'sack', price_estimate: 10000, status: 'available', description: 'Serbuk gergaji Mahoni bersih, 5 karung besar.' },
            { wood_type: 'Trembesi', form: 'offcut_large', condition: 'mixed', volume: 2, unit: 'm3', price_estimate: 500000, status: 'booked', description: 'Potongan besar Trembesi bentuk tidak beraturan. Cocok untuk meja resin.' },
        ];
        for (const w of wasteData) {
            try {
                const existing = await pb.collection('waste_listings').getFirstListItem(`description="${w.description}"`);
                console.log(`  - Waste "${w.form} ${w.wood_type}" already exists`);
            } catch (err) {
                if (err.status === 404) {
                    await pb.collection('waste_listings').create({
                        ...w, wood_type: woodTypesMap[w.wood_type], generator: usersMap['generator'],
                    });
                    console.log(`  + Created waste "${w.form} ${w.wood_type}"`);
                }
            }
        }

        // ====================================================================
        // 5. GENERATOR PRODUCTS (Generator)
        // ====================================================================
        console.log('\n🪑 Seeding Generator Products...');
        const genProdData = [
            { name: 'Kursi Lipat Jati Minimalis', description: 'Kursi lipat dari kayu Jati solid, cocok untuk teras atau ruang tamu minimalis.', category: 'furniture', price: 350000, stock: 10, wood_type: 'Jati', status: 'active' },
            { name: 'Rak Dinding Mahoni Potong', description: 'Rak dinding dari sisa potongan Mahoni — unik dan ramah lingkungan.', category: 'furniture', price: 150000, stock: 15, wood_type: 'Mahoni', status: 'active' },
        ];
        for (const p of genProdData) {
            try {
                const existing = await pb.collection('generator_products').getFirstListItem(`name="${p.name}"`);
                console.log(`  - Gen product "${p.name}" already exists`);
            } catch (err) {
                if (err.status === 404) {
                    await pb.collection('generator_products').create({
                        ...p, wood_type: woodTypesMap[p.wood_type], generator: usersMap['generator'],
                    });
                    console.log(`  + Created gen product "${p.name}"`);
                }
            }
        }

        // ====================================================================
        // 6. PICKUPS (Aggregator — needed before warehouse inventory)
        // ====================================================================
        console.log('\n🚚 Seeding Pickups (Aggregator)...');
        let pickupId = null;
        try {
            // get a waste listing to reference
            const wasteList = await pb.collection('waste_listings').getList(1, 1, { filter: 'status="available"' });
            if (wasteList.items.length > 0) {
                const wl = wasteList.items[0];
                try {
                    const existing = await pb.collection('pickups').getFirstListItem(
                        `aggregator="${usersMap['aggregator']}" && waste_listing="${wl.id}"`
                    );
                    pickupId = existing.id;
                    console.log(`  - Pickup for "${wl.form}" already exists`);
                } catch (err) {
                    if (err.status === 404) {
                        const p = await pb.collection('pickups').create({
                            aggregator: usersMap['aggregator'],
                            waste_listing: wl.id,
                            status: 'completed',
                            scheduled_date: new Date().toISOString(),
                            actual_date: new Date().toISOString(),
                            weight_verified: 100,
                            notes: 'Pickup demo',
                        });
                        pickupId = p.id;
                        console.log(`  + Created pickup for "${wl.form}"`);
                    }
                }
            }
        } catch (e) { console.log('  ! No waste listings available for pickup'); }

        // ====================================================================
        // 7. WAREHOUSE INVENTORY (Aggregator)
        // ====================================================================
        console.log('\n🏭 Seeding Warehouse Inventory (Aggregator)...');
        const warehouseData = [
            { wood_type: 'Jati', form: 'offcut_small', weight: 200, price_per_kg: 8000, status: 'in_stock' },
            { wood_type: 'Mahoni', form: 'sawdust', weight: 150, price_per_kg: 3000, status: 'in_stock' },
        ];
        for (const w of warehouseData) {
            try {
                const existing = await pb.collection('warehouse_inventory').getFirstListItem(
                    `aggregator="${usersMap['aggregator']}" && wood_type="${woodTypesMap[w.wood_type]}" && form="${w.form}"`
                );
                console.log(`  - Warehouse "${w.form} ${w.wood_type}" already exists`);
            } catch (err) {
                if (err.status === 404) {
                    await pb.collection('warehouse_inventory').create({
                        ...w, wood_type: woodTypesMap[w.wood_type],
                        aggregator: usersMap['aggregator'],
                        pickup: pickupId || undefined,
                    });
                    console.log(`  + Created warehouse "${w.form} ${w.wood_type}"`);
                }
            }
        }

        // ====================================================================
        // 7. DESIGN RECIPES (Designer)
        // ====================================================================
        console.log('\n📐 Seeding Design Recipes...');
        const recipeData = [
            {
                title: 'Meja Resin dari Potongan Trembesi',
                description: 'Manfaatkan potongan besar Trembesi menjadi meja resin yang artistik. Langkah-langkah: 1) Keringkan kayu selama 2 minggu, 2) Amplas permukaan hingga halus, 3) Siapkan cetakan resin, 4) Tuang resin epoxy perlahan, 5) Tunggu 24 jam, 6) Amplas dan vernis.',
                suitable_wood_types: ['Trembesi'],
                suitable_forms: ['offcut_large'],
                difficulty: 'hard',
                author: usersMap['designer'],
            },
            {
                title: 'Gantungan Kunci dari Offcut Kecil',
                description: 'Ide craft sederhana dari potongan kayu kecil. Potong offcut menjadi bentuk geometris, amplas, lubangi, beri ring dan kait gantungan kunci. Cocok untuk limbah Jati atau Mahoni.',
                suitable_wood_types: ['Jati', 'Mahoni'],
                suitable_forms: ['offcut_small'],
                difficulty: 'easy',
                author: usersMap['designer'],
            },
        ];
        for (const r of recipeData) {
            try {
                const e = await pb.collection('design_recipes').getFirstListItem(`title="${r.title}"`);
                console.log(`  - Recipe "${r.title}" already exists`);
            } catch (err) {
                if (err.status === 404) {
                    const woodIds = r.suitable_wood_types.map((n) => woodTypesMap[n]).filter(Boolean);
                    await pb.collection('design_recipes').create({
                        title: r.title, description: r.description,
                        suitable_wood_types: woodIds,
                        suitable_forms: r.suitable_forms,
                        difficulty: r.difficulty, author: r.author,
                    });
                    console.log(`  + Created recipe "${r.title}"`);
                }
            }
        }

        // ====================================================================
        // 8. DESIGN ARTICLES (Designer)
        // ====================================================================
        console.log('\n📝 Seeding Design Articles...');
        const articleData = [
            {
                title: 'Prinsip Desain untuk Dibongkar (Design for Disassembly)',
                slug: 'prinsip-design-for-disassembly',
                category: 'design_for_disassembly',
                excerpt: 'Bagaimana merancang produk yang mudah dibongkar kembali untuk memaksimalkan daur ulang material.',
                content: `## Apa itu Design for Disassembly?\n\nDesign for Disassembly (DfD) adalah pendekatan desain yang memudahkan produk untuk dibongkar menjadi komponen-komponennya di akhir masa pakai. Ini memungkinkan material seperti kayu, logam, dan plastik dapat dipisahkan dan didaur ulang secara optimal.\n\n## Prinsip Dasar\n\n1. **Gunakan sambungan mekanis** — Hindari lem permanen, gunakan baut atau sistem knock-down.\n2. **Standardisasi komponen** — Buat komponen yang mudah dilepas dan diganti.\n3. **Aksesibilitas** — Pastikan titik sambungan mudah dijangkau.\n4. **Material homogen** — Hindari mencampur material yang sulit dipisahkan.\n\n## Contoh di WoodLoop\n\nProduk furnitur yang menggunakan sambungan baut daripada paku memungkinkan pengrajin mengganti bagian yang rusak tanpa membuang seluruh produk. Ini memperpanjang umur produk dan mengurangi limbah.`,
                published: true,
                author: usersMap['designer'],
            },
            {
                title: 'Upcycling: Mengubah Limbah Menjadi Karya Bernilai Tinggi',
                slug: 'upcycling-limbah-jadi-bernilai',
                category: 'upcycling',
                excerpt: 'Strategi kreatif mengubah sisa produksi kayu menjadi produk premium yang diminati pasar.',
                content: `## Apa itu Upcycling?\n\nUpcycling berbeda dengan recycling. Jika recycling mengubah material menjadi bahan baku yang sama kualitasnya (atau lebih rendah), upcycling justru meningkatkan nilai material — mengubah limbah menjadi produk yang lebih bernilai.\n\n## Limbah Kayu yang Cocok untuk Upcycling\n\n### 1. Offcut Besar → Furniture\nPotongan kayu sisa produksi dengan ukuran di atas 30cm masih bisa disambung menjadi meja, kursi, atau panel dinding.\n\n### 2. Offcut Kecil → Craft & Decor\nPotongan kecil bisa dirangkai menjadi mozaik, bingkai foto, atau aksesori rumah.\n\n### 3. Serbuk Gergaji → Papan Partikel\nSerbuk gergaji bisa dicampur resin menjadi papan partikel untuk aplikasi non-struktural.\n\n## Studi Kasus: Meja Resin Trembesi\n\nDi WoodLoop, potongan Trembesi yang tidak beraturan diubah menjadi meja resin yang dijual dengan harga 3-5x lipat dari harga kayu aslinya. Ini adalah contoh sempurna upcycling.`,
                published: true,
                author: usersMap['designer'],
            },
        ];
        for (const a of articleData) {
            try {
                const e = await pb.collection('design_articles').getFirstListItem(`slug="${a.slug}"`);
                console.log(`  - Article "${a.title}" already exists`);
            } catch (err) {
                if (err.status === 404) {
                    await pb.collection('design_articles').create(a);
                    console.log(`  + Created article "${a.title}"`);
                }
            }
        }

        // ====================================================================
        // 9. DESIGN NOTES (Designer)
        // ====================================================================
        console.log('\n📋 Seeding Design Notes...');

        // Get a generator product to reference
        let genProductId = null;
        try {
            const gp = await pb.collection('generator_products').getFirstListItem(`generator="${usersMap['generator']}"`);
            genProductId = gp.id;
        } catch { /* no generator products yet */ }

        const noteData = [
            {
                target_type: 'generator_product',
                target_id: genProductId || 'placeholder',
                content: 'Saran: untuk kursi lipat ini, pertimbangkan menggunakan sambungan knock-down system agar pelanggan bisa merakit sendiri. Ini mengurangi biaya pengiriman dan memudahkan perbaikan di masa depan. Bisa juga ditambahkan fitur "easy-replace" untuk dudukan kursi yang aus.',
                is_public: true,
                designer: usersMap['designer'],
            },
            {
                target_type: 'generator_product',
                target_id: genProductId || 'placeholder',
                content: 'Rak dinding ini bisa dikembangkan dengan sistem modular — pelanggan bisa menambah unit rak sesuai kebutuhan. Gunakan sistem alur/pasak tanpa paku untuk estetika yang lebih bersih.',
                is_public: true,
                designer: usersMap['designer'],
            },
        ];
        for (const n of noteData) {
            try {
                const e = await pb.collection('design_notes').getFirstListItem(`designer="${usersMap['designer']}" && content="${n.content.slice(0, 50)}"`);
                console.log('  - Design note already exists');
            } catch (err) {
                if (err.status === 404) {
                    await pb.collection('design_notes').create(n);
                    console.log('  + Created design note');
                }
            }
        }

        // ====================================================================
        // 10. DESIGN CONSULTATIONS (Designer)
        // ====================================================================
        console.log('\n💬 Seeding Design Consultations...');
        const consultData = [
            {
                designer: usersMap['designer'],
                client: usersMap['converter'],
                title: 'Konsultasi Desain Meja Resin',
                description: 'Saya ingin membuat meja resin dari potongan Trembesi, butuh saran tentang teknik finishing dan pemilihan resin yang tepat.',
                budget: 500000,
                status: 'open',
                type: 'client_request',
            },
            {
                designer: usersMap['designer'],
                client: usersMap['generator'],
                title: 'Penawaran: Redesain Kursi Lipat',
                description: 'Saya menawarkan jasa redesain untuk kursi lipat Jati agar lebih ergonomis dan menggunakan lebih sedikit material.',
                budget: 750000,
                status: 'negotiation',
                type: 'designer_offer',
            },
        ];
        for (const c of consultData) {
            try {
                const e = await pb.collection('design_consultations').getFirstListItem(`title="${c.title}"`);
                console.log(`  - Consultation "${c.title}" already exists`);
            } catch (err) {
                if (err.status === 404) {
                    await pb.collection('design_consultations').create(c);
                    console.log(`  + Created consultation "${c.title}"`);
                }
            }
        }

        // ====================================================================
        // 11. MARKETPLACE TRANSACTIONS (Converter → Aggregator)
        // ====================================================================
        console.log('\n🛒 Seeding Marketplace Transactions (Converter)');
        try {
            const whItems = await pb.collection('warehouse_inventory').getList(1, 2, {
                filter: `aggregator="${usersMap['aggregator']}" && status="in_stock"`,
            });
            for (const item of whItems.items) {
                const desc = `Pembelian ${item.form} dari Aggregator`;
                try {
                    await pb.collection('marketplace_transactions').getFirstListItem(`description="${desc}"`);
                    console.log(`  - Transaction "${desc}" already exists`);
                } catch (err) {
                    if (err.status === 404) {
                        await pb.collection('marketplace_transactions').create({
                            buyer: usersMap['converter'],
                            seller: usersMap['aggregator'],
                            inventory_item: item.id,
                            quantity: 10,
                            total_price: (item.price_per_kg || 5000) * 10,
                            status: 'received',
                            payment_method: 'wallet',
                            description: desc,
                        });
                        console.log(`  + Created transaction "${desc}"`);
                    }
                }
            }
        } catch { /* no warehouse items yet */ }

        // ====================================================================
        // 12. PRODUCTS (Converter — produk upcycled)
        // ====================================================================
        console.log('\n🎨 Seeding Products (Converter)...');
        const productData = [
            { name: 'Meja Resin Trembesi Artisan', description: 'Meja bundar diameter 80cm dari potongan Trembesi dengan resin epoxy bening. Setiap meja memiliki pola kayu yang unik.', category: 'furniture', price: 2500000, stock: 3, qr_code_id: qrCodeId(), converter: usersMap['converter'] },
            { name: 'Lampu Gantung Offcut Mahoni', description: 'Lampu gantung artistik dari potongan Mahoni yang disusun geometris. Diameter 40cm, tinggi 60cm.', category: 'decor', price: 450000, stock: 7, qr_code_id: qrCodeId(), converter: usersMap['converter'] },
        ];
        for (const p of productData) {
            try {
                const e = await pb.collection('products').getFirstListItem(`name="${p.name}"`);
                console.log(`  - Product "${p.name}" already exists`);
            } catch (err) {
                if (err.status === 404) {
                    await pb.collection('products').create(p);
                    console.log(`  + Created product "${p.name}" (QR: ${p.qr_code_id})`);
                }
            }
        }

        // ====================================================================
        // 13. ORDERS (Buyer — beli dari Converter)
        // ====================================================================
        console.log('\n📦 Seeding Orders (Buyer)...');
        try {
            const convProducts = await pb.collection('products').getList(1, 1, {
                filter: `converter="${usersMap['converter']}"`,
            });
            if (convProducts.items.length > 0) {
                const prod = convProducts.items[0];
                const desc = `Order: ${prod.name}`;
                try {
                    await pb.collection('orders').getFirstListItem(`buyer="${usersMap['buyer']}" && product="${prod.id}"`);
                    console.log(`  - Order "${prod.name}" already exists`);
                } catch (err) {
                    if (err.status === 404) {
                        await pb.collection('orders').create({
                            buyer: usersMap['buyer'],
                            product: prod.id,
                            quantity: 1,
                            total_price: prod.price,
                            shipping_address: 'Jl. Industri No. 10, Jepara',
                            status: 'received',
                            payment_method: 'bank_transfer',
                        });
                        console.log(`  + Created order "${prod.name}"`);
                    }
                }
            }
        } catch { /* no products yet */ }

        // ====================================================================
        // 14. WISHLIST (Buyer)
        // ====================================================================
        console.log('\n❤️ Seeding Wishlist (Buyer)...');
        try {
            const allProducts = await pb.collection('products').getList(1, 5);
            for (const p of allProducts.items) {
                try {
                    await pb.collection('wishlist').getFirstListItem(`buyer="${usersMap['buyer']}" && product="${p.id}"`);
                } catch (err) {
                    if (err.status === 404) {
                        await pb.collection('wishlist').create({ buyer: usersMap['buyer'], product: p.id });
                        console.log(`  + Added "${p.name}" to wishlist`);
                        break; // just add one
                    }
                }
            }
        } catch { /* no products */ }

        // ====================================================================
        // 15. IMPACT METRICS (Enabler dashboard)
        // ====================================================================
        console.log('\n📊 Seeding Impact Metrics...');
        const currentMonth = new Date().toISOString().slice(0, 7);
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const period = d.toISOString().slice(0, 7);
            try {
                await pb.collection('impact_metrics').getFirstListItem(`period="${period}"`);
                console.log(`  - Impact metric for ${period} already exists`);
            } catch (err) {
                if (err.status === 404) {
                    await pb.collection('impact_metrics').create({
                        co2_saved: Math.round(150 + Math.random() * 200),
                        waste_diverted: Math.round(200 + Math.random() * 500),
                        economic_value: Math.round(5000000 + Math.random() * 10000000),
                        period,
                    });
                    console.log(`  + Created impact metric for ${period}`);
                }
            }
        }

        // ====================================================================
        // 16. WALLET TRANSACTIONS
        // ====================================================================
        console.log('\n💰 Seeding Wallet Transactions...');
        const allRoleIds = Object.values(usersMap);
        for (const uid of allRoleIds) {
            try {
                const existing = await pb.collection('wallet_transactions').getList(1, 1, { filter: `user="${uid}"` });
                if (existing.items.length > 0) {
                    console.log(`  - Wallet tx for user ${uid.slice(0, 8)}... already exists`);
                    continue;
                }
            } catch { /* empty */ }

            await pb.collection('wallet_transactions').create({
                user: uid,
                type: 'credit',
                amount: 500000,
                balance_after: 500000,
                description: 'Saldo awal demo',
                reference_type: 'topup',
            });
            console.log(`  + Created wallet tx for user ${uid.slice(0, 8)}...`);
        }

        // ====================================================================
        // DONE
        // ====================================================================
        console.log('\n✅ Seeding complete!');
        console.log(`\n🔑 You can login to the app with any role:`);
        console.log(`  - Emails: demo.[role]@woodloop.id`);
        console.log(`  - Password: ${DEFAULT_PASSWORD}`);
        console.log(`  - Roles: ${roles.join(', ')}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error.response?.data || error.message);
    }
}

seedData();
