/**
 * WoodLoop — PocketBase Migration Runner
 *
 * This script runs all collection migrations in order.
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in your credentials
 *   2. Run: npm install
 *   3. Run: npm run migrate
 */

import { migrateUsers } from './collections/01_users.js';
import { migrateWoodTypes } from './collections/02_wood_types.js';
import { migrateRawTimberListings } from './collections/03_raw_timber_listings.js';
import { migrateWasteListings } from './collections/04_waste_listings.js';
import { migratePickups } from './collections/05_pickups.js';
import { migrateWarehouseInventory } from './collections/06_warehouse_inventory.js';
import { migrateMarketplaceTransactions } from './collections/07_marketplace_transactions.js';
import { migrateProducts } from './collections/08_products.js';
import { migrateOrders } from './collections/09_orders.js';
import { migrateCartItems } from './collections/10_cart_items.js';
import { migrateWalletTransactions } from './collections/11_wallet_transactions.js';
import { migrateImpactMetrics } from './collections/12_impact_metrics.js';
import { migrateChats } from './collections/13_chats.js';
import { migrateNotifications } from './collections/14_notifications.js';
import { migrateDesignRecipes } from './collections/15_design_recipes.js';
import { migrateBids } from './collections/16_bids.js';
import { migrateGeneratorProducts } from './collections/17_generator_products.js';

async function runAllMigrations() {
    console.log('🚀 WoodLoop — Starting PocketBase migrations...\n');
    console.log('═'.repeat(50));

    try {
        // 1. Auth & Master Data (no dependencies)
        console.log('\n📦 [1/17] Migrating Users...');
        await migrateUsers();

        console.log('\n🌳 [2/17] Migrating Wood Types...');
        await migrateWoodTypes();

        // 2. Supplier & Generator listings (depend on users, wood_types)
        console.log('\n🪵 [3/17] Migrating Raw Timber Listings...');
        await migrateRawTimberListings();

        console.log('\n♻️ [4/17] Migrating Waste Listings...');
        await migrateWasteListings();

        // 3. Aggregator flow (depend on users, waste_listings)
        console.log('\n🚚 [5/17] Migrating Pickups...');
        await migratePickups();

        console.log('\n🏭 [6/17] Migrating Warehouse Inventory...');
        await migrateWarehouseInventory();

        // 4. Marketplace (depend on users, warehouse_inventory)
        console.log('\n💰 [7/17] Migrating Marketplace Transactions...');
        await migrateMarketplaceTransactions();

        // 5. Converter products (depend on users, marketplace_transactions)
        console.log('\n🎨 [8/17] Migrating Products...');
        await migrateProducts();

        // 6. Buyer flow (depend on users, products)
        console.log('\n📦 [9/17] Migrating Orders...');
        await migrateOrders();

        console.log('\n🛒 [10/17] Migrating Cart Items...');
        await migrateCartItems();

        // 7. Shared features (depend on users)
        console.log('\n💳 [11/17] Migrating Wallet Transactions...');
        await migrateWalletTransactions();

        console.log('\n🌍 [12/17] Migrating Impact Metrics...');
        await migrateImpactMetrics();

        console.log('\n💬 [13/17] Migrating Chats...');
        await migrateChats();

        console.log('\n🔔 [14/17] Migrating Notifications...');
        await migrateNotifications();

        // 8. Additional features
        console.log('\n📐 [15/17] Migrating Design Recipes...');
        await migrateDesignRecipes();

        console.log('\n🏷️ [16/17] Migrating Bids...');
        await migrateBids();

        console.log('\n🪑 [17/17] Migrating Generator Products...');
        await migrateGeneratorProducts();

        console.log('\n' + '═'.repeat(50));
        console.log('✅ All 17 migrations completed successfully!');
        console.log('═'.repeat(50));

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runAllMigrations();
