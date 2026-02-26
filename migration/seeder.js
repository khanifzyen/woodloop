import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL);

// Hardcoded default password for demo users
const DEFAULT_PASSWORD = 'password12345';

async function seedData() {
    console.log("🌱 Starting WoodLoop Database Seeder...");

    try {
        console.log("Authenticating as admin...");
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        // 1. Seed Wood Types
        console.log("\n🌲 Seeding Wood Types...");
        const woodTypesData = [
            { name: 'Jati', carbon_factor: 1.5 },
            { name: 'Mahoni', carbon_factor: 1.4 },
            { name: 'Trembesi', carbon_factor: 1.2 },
            { name: 'Mindi', carbon_factor: 1.1 },
            { name: 'Akasia', carbon_factor: 1.3 },
            { name: 'Pinus', carbon_factor: 1.0 },
        ];

        const woodTypesMap = {}; // name -> id

        for (const wt of woodTypesData) {
            try {
                // Check if exists
                const existing = await pb.collection('wood_types').getFirstListItem(`name="${wt.name}"`);
                console.log(`  - Wood type "${wt.name}" already exists (${existing.id})`);
                woodTypesMap[wt.name] = existing.id;
            } catch (err) {
                // Not found, create it
                if (err.status === 404) {
                    const record = await pb.collection('wood_types').create(wt);
                    console.log(`  + Created wood type "${wt.name}" (${record.id})`);
                    woodTypesMap[wt.name] = record.id;
                } else {
                    console.error(`  ! Error checking wood type "${wt.name}": ${err.message}`);
                }
            }
        }

        // 2. Seed Demo Users
        console.log("\n👥 Seeding Demo Users...");
        const roles = ['supplier', 'generator', 'aggregator', 'converter', 'enabler', 'buyer'];
        const usersMap = {}; // role -> user id

        for (const role of roles) {
            const email = `demo.${role}@woodloop.id`;
            const name = `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`;

            try {
                const existing = await pb.collection('users').getFirstListItem(`email="${email}"`);
                console.log(`  - User "${email}" already exists (${existing.id})`);
                usersMap[role] = existing.id;

                // ensure password is set correctly for testing
                await pb.collection('users').update(existing.id, {
                    password: DEFAULT_PASSWORD,
                    passwordConfirm: DEFAULT_PASSWORD
                });
            } catch (err) {
                if (err.status === 404) {
                    const userData = {
                        email: email,
                        password: DEFAULT_PASSWORD,
                        passwordConfirm: DEFAULT_PASSWORD,
                        name: name,
                        role: role,
                        emailVisibility: true,
                        verified: true,
                        phone: `081234567${Math.floor(Math.random() * 1000)}`,
                        workshop_name: `${name} Workshop`,
                        address: 'Jl. Pemuda No. 1, Jepara',
                        location_lat: -6.58,
                        location_lng: 110.66,
                    };
                    const record = await pb.collection('users').create(userData);
                    console.log(`  + Created user "${email}" (${record.id})`);
                    usersMap[role] = record.id;
                } else {
                    console.error(`  ! Error checking user "${email}": ${err.message}`);
                }
            }
        }

        // 3. Seed Waste Listings (Generator mapping to wood types)
        console.log("\n🪵 Seeding Waste Listings...");
        const generatorId = usersMap['generator'];

        const wasteData = [
            {
                generator: generatorId,
                wood_type: woodTypesMap['Jati'],
                form: 'offcut_small',
                condition: 'dry',
                volume: 50,
                unit: 'kg',
                price_estimate: 25000,
                status: 'available',
                description: 'Potongan kecil sisa pembuatan kursi Jati, kondisi kering cocok untuk craft kecil.'
            },
            {
                generator: generatorId,
                wood_type: woodTypesMap['Mahoni'],
                form: 'sawdust',
                condition: 'dry',
                volume: 5,
                unit: 'sack',
                price_estimate: 10000,
                status: 'available',
                description: 'Serbuk gergaji Mahoni bersih, 5 karung besar.'
            },
            {
                generator: generatorId,
                wood_type: woodTypesMap['Trembesi'],
                form: 'offcut_large',
                condition: 'mixed',
                volume: 2,
                unit: 'm3',
                price_estimate: 500000,
                status: 'booked',
                description: 'Potongan besar Trembesi bentuk tidak beraturan. Cocok untuk meja resin.'
            }
        ];

        for (const waste of wasteData) {
            try {
                // Simple deduction to prevent duplicate seeding (checking description just for basic idempotency)
                const existing = await pb.collection('waste_listings').getFirstListItem(`description="${waste.description}"`);
                console.log(`  - Waste listing "${waste.form} ${waste.unit}" already exists (${existing.id})`);
            } catch (err) {
                if (err.status === 404) {
                    const record = await pb.collection('waste_listings').create(waste);
                    console.log(`  + Created waste listing "${waste.form} ${waste.unit}" (${record.id})`);
                } else {
                    console.error(`  ! Error checking waste listing: ${err.message}`);
                }
            }
        }

        console.log("\n✅ Seeding complete!");
        console.log(`\n🔑 You can login to the app with any role:`);
        console.log(`  - Emails: demo.[role]@woodloop.id (e.g. demo.supplier@woodloop.id)`);
        console.log(`  - Password: ${DEFAULT_PASSWORD}`);

    } catch (error) {
        console.error("❌ Seeding failed:", error.response?.data || error.message);
    }
}

seedData();
