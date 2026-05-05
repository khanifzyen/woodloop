/// <reference path="../pb_data/types.d.ts" />

/**
 * WoodLoop — PocketBase JS Hooks
 * 
 * Drop file ini ke folder `pb_hooks/` di server PocketBase kamu.
 * Nama file bebas, asal ekstensi .pb.js
 * 
 * Hooks yang dicover:
 *   1. Pickup created      → set waste_listing.status = "booked"
 *   2. Pickup completed    → create warehouse_inventory, impact_metrics, wallet_tx
 *   3. Marketplace tx paid → update warehouse stock, create wallet_txs
 *   4. Bid accepted        → auto-create pickup, reject other bids
 */

// ══════════════════════════════════════════════════════════════
// HOOK 1: After Pickup Created → mark waste_listing as "booked"
// ══════════════════════════════════════════════════════════════
onRecordAfterCreateSuccess((e) => {
    try {
        const pickup = e.record;
        const wasteListingId = pickup.getString("waste_listing");
        
        if (wasteListingId) {
            const wasteListing = $app.findRecordById("waste_listings", wasteListingId);
            wasteListing.set("status", "booked");
            $app.dao().saveRecord(wasteListing);
            console.log(`[WoodLoop] waste_listing ${wasteListingId} → booked`);
        }
    } catch (err) {
        console.error("[WoodLoop] Hook 1 error:", err);
    }
    e.next();
}, "pickups");

// ══════════════════════════════════════════════════════════════
// HOOK 2: After Pickup Updated to "completed"
//         → set waste_listing to "collected"
//         → create warehouse_inventory entry
//         → create impact_metrics entry
//         → create wallet_transaction (credit for generator)
// ══════════════════════════════════════════════════════════════
onRecordAfterUpdateSuccess((e) => {
    try {
        const pickup = e.record;
        const newStatus = pickup.getString("status");
        
        // Only run when status changes to "completed"
        if (newStatus !== "completed") {
            e.next();
            return;
        }
        
        const wasteListingId = pickup.getString("waste_listing");
        const aggregatorId = pickup.getString("aggregator");
        const weightVerified = pickup.getFloat("weight_verified") || 0;
        
        if (!wasteListingId || !aggregatorId) {
            console.log("[WoodLoop] Hook 2 skipped: missing waste_listing or aggregator");
            e.next();
            return;
        }
        
        // --- 2a. Set waste_listing status to "collected" ---
        const wasteListing = $app.findRecordById("waste_listings", wasteListingId);
        wasteListing.set("status", "collected");
        $app.dao().saveRecord(wasteListing);
        console.log(`[WoodLoop] waste_listing ${wasteListingId} → collected`);
        
        // Get wood_type from waste_listing for carbon calculation
        const woodTypeId = wasteListing.getString("wood_type");
        const priceEstimate = wasteListing.getFloat("price_estimate") || 0;
        const generatorId = wasteListing.getString("generator");
        
        // --- 2b. Create warehouse_inventory ---
        const woodTypesColl = $app.findCollectionByNameOrId("warehouse_inventory");
        const inventoryItem = new Record(woodTypesColl);
        
        inventoryItem.set("aggregator", aggregatorId);
        inventoryItem.set("pickup", pickup.id);
        inventoryItem.set("weight", weightVerified);
        inventoryItem.set("status", "in_stock");
        
        // Copy form from waste_listing if available
        const wasteForm = wasteListing.getString("form");
        if (wasteForm) inventoryItem.set("form", wasteForm);
        if (woodTypeId) inventoryItem.set("wood_type", woodTypeId);
        
        $app.dao().saveRecord(inventoryItem);
        console.log(`[WoodLoop] warehouse_inventory created for pickup ${pickup.id}`);
        
        // --- 2c. Create impact_metrics ---
        const impactColl = $app.findCollectionByNameOrId("impact_metrics");
        const impactMetric = new Record(impactColl);
        
        // Get carbon_factor from wood_type
        let carbonFactor = 1.5; // default
        if (woodTypeId) {
            try {
                const woodType = $app.findRecordById("wood_types", woodTypeId);
                carbonFactor = woodType.getFloat("carbon_factor") || 1.5;
            } catch (_) { /* use default */ }
        }
        
        impactMetric.set("waste_listing", wasteListingId);
        impactMetric.set("pickup", pickup.id);
        impactMetric.set("co2_saved", weightVerified * carbonFactor);
        impactMetric.set("waste_diverted", weightVerified);
        impactMetric.set("economic_value", priceEstimate);
        
        const now = new Date();
        const period = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
        impactMetric.set("period", period);
        
        $app.dao().saveRecord(impactMetric);
        console.log(`[WoodLoop] impact_metrics created: CO2 saved=${weightVerified * carbonFactor}kg`);
        
        // --- 2d. Create wallet_transaction (credit generator) ---
        if (generatorId && priceEstimate > 0) {
            const walletColl = $app.findCollectionByNameOrId("wallet_transactions");
            const tx = new Record(walletColl);
            
            // Hitung balance_after dengan mencari transaksi terakhir user ini
            let balanceAfter = priceEstimate;
            try {
                const lastTx = $app.findFirstRecordByFilter(
                    "wallet_transactions",
                    "user = {:userId}",
                    "-created",
                    { userId: generatorId }
                );
                // findFirstRecordByFilter throws if not found
                const lastBalance = lastTx.getFloat("balance_after") || 0;
                balanceAfter = lastBalance + priceEstimate;
            } catch (_) {
                // No previous transaction, balance = priceEstimate
            }
            
            tx.set("user", generatorId);
            tx.set("type", "credit");
            tx.set("amount", priceEstimate);
            tx.set("balance_after", balanceAfter);
            tx.set("description", "Pembayaran limbah kayu (pickup #" + pickup.id.slice(0, 8) + ")");
            tx.set("reference_type", "pickup");
            tx.set("reference_id", pickup.id);
            
            $app.dao().saveRecord(tx);
            console.log(`[WoodLoop] wallet_transaction: credit ${priceEstimate} to generator ${generatorId}`);
        }
        
    } catch (err) {
        console.error("[WoodLoop] Hook 2 error:", err);
    }
    e.next();
}, "pickups");

// ══════════════════════════════════════════════════════════════
// HOOK 3: After Marketplace Transaction Paid
//         → update warehouse_inventory status to "sold"
//         → create wallet_transactions for buyer & seller
// ══════════════════════════════════════════════════════════════
onRecordAfterUpdateSuccess((e) => {
    try {
        const tx = e.record;
        const newStatus = tx.getString("status");
        
        if (newStatus !== "paid") {
            e.next();
            return;
        }
        
        const inventoryItemId = tx.getString("inventory_item");
        const buyerId = tx.getString("buyer");
        const sellerId = tx.getString("seller");
        const totalPrice = tx.getFloat("total_price") || 0;
        
        // --- 3a. Update warehouse_inventory → "sold" ---
        if (inventoryItemId) {
            try {
                const inventoryItem = $app.findRecordById("warehouse_inventory", inventoryItemId);
                inventoryItem.set("status", "sold");
                $app.dao().saveRecord(inventoryItem);
                console.log(`[WoodLoop] warehouse_inventory ${inventoryItemId} → sold`);
            } catch (err) {
                console.error("[WoodLoop] Hook 3a error:", err);
            }
        }
        
        // --- 3b. Wallet: debit buyer ---
        if (buyerId && totalPrice > 0) {
            const walletColl = $app.findCollectionByNameOrId("wallet_transactions");
            
            // Debit buyer
            const buyerTx = new Record(walletColl);
            let buyerBalanceAfter = -totalPrice;
            try {
                const lastTx = $app.findFirstRecordByFilter(
                    "wallet_transactions", "user = {:userId}", "-created",
                    { userId: buyerId }
                );
                buyerBalanceAfter = (lastTx.getFloat("balance_after") || 0) - totalPrice;
            } catch (_) {}
            
            buyerTx.set("user", buyerId);
            buyerTx.set("type", "debit");
            buyerTx.set("amount", totalPrice);
            buyerTx.set("balance_after", buyerBalanceAfter);
            buyerTx.set("description", "Pembelian bahan baku (tx #" + tx.id.slice(0, 8) + ")");
            buyerTx.set("reference_type", "marketplace_transaction");
            buyerTx.set("reference_id", tx.id);
            $app.dao().saveRecord(buyerTx);
            console.log(`[WoodLoop] wallet: debit ${totalPrice} from buyer ${buyerId}`);
            
            // Credit seller
            const sellerTx = new Record(walletColl);
            let sellerBalanceAfter = totalPrice;
            try {
                const lastTx = $app.findFirstRecordByFilter(
                    "wallet_transactions", "user = {:userId}", "-created",
                    { userId: sellerId }
                );
                sellerBalanceAfter = (lastTx.getFloat("balance_after") || 0) + totalPrice;
            } catch (_) {}
            
            sellerTx.set("user", sellerId);
            sellerTx.set("type", "credit");
            sellerTx.set("amount", totalPrice);
            sellerTx.set("balance_after", sellerBalanceAfter);
            sellerTx.set("description", "Penjualan bahan baku (tx #" + tx.id.slice(0, 8) + ")");
            sellerTx.set("reference_type", "marketplace_transaction");
            sellerTx.set("reference_id", tx.id);
            $app.dao().saveRecord(sellerTx);
            console.log(`[WoodLoop] wallet: credit ${totalPrice} to seller ${sellerId}`);
        }
        
    } catch (err) {
        console.error("[WoodLoop] Hook 3 error:", err);
    }
    e.next();
}, "marketplace_transactions");

// ══════════════════════════════════════════════════════════════
// HOOK 4: After Bid Accepted
//         → auto-create pickup record
//         → set waste_listing to "booked"
//         → reject all other bids on same listing
// ══════════════════════════════════════════════════════════════
onRecordAfterUpdateSuccess((e) => {
    try {
        const bid = e.record;
        const newStatus = bid.getString("status");
        
        if (newStatus !== "accepted") {
            e.next();
            return;
        }
        
        const wasteListingId = bid.getString("waste_listing");
        const bidderId = bid.getString("bidder");
        const bidAmount = bid.getFloat("bid_amount") || 0;
        
        if (!wasteListingId || !bidderId) {
            console.log("[WoodLoop] Hook 4 skipped: missing waste_listing or bidder");
            e.next();
            return;
        }
        
        // --- 4a. Create pickup ---
        const pickupsColl = $app.findCollectionByNameOrId("pickups");
        const pickup = new Record(pickupsColl);
        
        pickup.set("aggregator", bidderId);
        pickup.set("waste_listing", wasteListingId);
        pickup.set("status", "pending");
        
        // Set scheduled_date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        pickup.set("scheduled_date", tomorrow.toISOString().split("T")[0]);
        
        $app.dao().saveRecord(pickup);
        console.log(`[WoodLoop] pickup created for accepted bid ${bid.id}`);
        
        // --- 4b. Set waste_listing → "booked" ---
        // Note: the pickup create hook will also set this, but let's be explicit
        const wasteListing = $app.findRecordById("waste_listings", wasteListingId);
        wasteListing.set("status", "booked");
        $app.dao().saveRecord(wasteListing);
        
        // --- 4c. Reject all other pending bids on this listing ---
        const otherBids = $app.findRecordsByFilter(
            "bids",
            "waste_listing = {:wlid} && id != {:bidid} && status = 'pending'",
            "",
            100,
            0,
            { wlid: wasteListingId, bidid: bid.id }
        );
        
        for (const otherBid of otherBids) {
            otherBid.set("status", "rejected");
            $app.dao().saveRecord(otherBid);
            console.log(`[WoodLoop] bid ${otherBid.id} → rejected`);
        }
        
    } catch (err) {
        console.error("[WoodLoop] Hook 4 error:", err);
    }
    e.next();
}, "bids");

// ══════════════════════════════════════════════════════════════
// HOOK 5: After Order Paid (Buyer checkout)
//         → decrease product stock
//         → create wallet_transaction untuk buyer
// ══════════════════════════════════════════════════════════════
onRecordAfterUpdateSuccess((e) => {
    try {
        const order = e.record;
        const newStatus = order.getString("status");
        
        if (newStatus !== "paid") {
            e.next();
            return;
        }
        
        const productId = order.getString("product");
        const buyerId = order.getString("buyer");
        const quantity = order.getInt("quantity") || 1;
        const totalPrice = order.getFloat("total_price") || 0;
        
        // --- 5a. Decrease product stock ---
        if (productId) {
            try {
                const product = $app.findRecordById("products", productId);
                const currentStock = product.getInt("stock") || 0;
                const newStock = Math.max(0, currentStock - quantity);
                product.set("stock", newStock);
                if (newStock <= 0) {
                    product.set("status", "sold_out");
                }
                $app.dao().saveRecord(product);
                console.log(`[WoodLoop] product ${productId} stock: ${currentStock} → ${newStock}`);
            } catch (err) {
                console.error("[WoodLoop] Hook 5a error:", err);
            }
        }
        
        // --- 5b. Wallet: debit buyer ---
        if (buyerId && totalPrice > 0) {
            const walletColl = $app.findCollectionByNameOrId("wallet_transactions");
            
            const buyerTx = new Record(walletColl);
            let balanceAfter = -totalPrice;
            try {
                const lastTx = $app.findFirstRecordByFilter(
                    "wallet_transactions", "user = {:userId}", "-created",
                    { userId: buyerId }
                );
                balanceAfter = (lastTx.getFloat("balance_after") || 0) - totalPrice;
            } catch (_) {}
            
            buyerTx.set("user", buyerId);
            buyerTx.set("type", "debit");
            buyerTx.set("amount", totalPrice);
            buyerTx.set("balance_after", balanceAfter);
            buyerTx.set("description", "Pembelian produk (order #" + order.id.slice(0, 8) + ")");
            buyerTx.set("reference_type", "order");
            buyerTx.set("reference_id", order.id);
            $app.dao().saveRecord(buyerTx);
            console.log(`[WoodLoop] wallet: debit ${totalPrice} from buyer ${buyerId}`);
        }
        
    } catch (err) {
        console.error("[WoodLoop] Hook 5 error:", err);
    }
    e.next();
}, "orders");

console.log("[WoodLoop] All hooks registered successfully!");
