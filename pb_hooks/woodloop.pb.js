/// <reference path="../pb_data/types.d.ts" />

/**
 * WoodLoop — PocketBase JS Hooks
 * 
 * Drop file ini ke folder `pb_hooks/` di server PocketBase kamu.
 * Nama file bebas, asal ekstensi .pb.js
 * 
 * Hooks yang dicover:
 *   1. Pickup created          → set waste_listing.status = "booked"
 *   2. Pickup completed        → create warehouse_inventory, impact_metrics, wallet_tx, notif → generator
 *   3. Marketplace tx paid     → update warehouse stock, create wallet_txs
 *   4. Bid accepted            → auto-create pickup, reject other bids, notif → aggregator
 *   5. Order (products) paid   → decrease product stock, create wallet_tx, notif → converter
 *   6. raw_timber_order create → notif → supplier (Generator beli kayu)
 *   7. raw_timber_order update → notif → generator (processing/shipped)
 */

// ─── Helper: create a notification record ─────────────────────────────────
function createNotification(userId, title, body, type, referenceType, referenceId) {
  try {
    const notifColl = $app.findCollectionByNameOrId("notifications");
    const notif = new Record(notifColl);
    notif.set("user", userId);
    notif.set("title", title);
    notif.set("body", body);
    notif.set("type", type);
    notif.set("reference_type", referenceType);
    notif.set("reference_id", referenceId);
    $app.dao().saveRecord(notif);
    console.log(`[WoodLoop] notif created for user ${userId}: "${title}"`);
  } catch (err) {
    console.error("[WoodLoop] Failed to create notification:", err);
  }
}

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
//         → create notification for generator
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
        
        // --- 2e. Create notification for generator ---
        if (generatorId) {
            createNotification(
                generatorId,
                "Limbah Berhasil Dijemput!",
                `Limbah Anda seberat ${weightVerified}kg telah berhasil dijemput dan divalidasi oleh Aggregator.`,
                "pickup",
                "pickups",
                pickup.id
            );
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
//         → create notification for aggregator
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
        
        // --- 4d. Create notification for aggregator ---
        createNotification(
            bidderId,
            "Tawaran Diterima!",
            "Tawaran Anda untuk limbah kayu telah diterima. Silakan cek jadwal penjemputan.",
            "pickup",
            "pickups",
            pickup.id
        );
        
    } catch (err) {
        console.error("[WoodLoop] Hook 4 error:", err);
    }
    e.next();
}, "bids");

// ══════════════════════════════════════════════════════════════
// HOOK 5: After Order Paid (Buyer checkout → Converter products)
//         → decrease product stock
//         → create wallet_transaction untuk buyer
//         → create notification for converter
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
                
                // Notify the converter who owns this product
                const converterId = product.getString("converter");
                const productName = product.getString("name");
                if (converterId) {
                    createNotification(
                        converterId,
                        "Pesanan Baru Dibayar!",
                        `Produk "${productName}" Anda telah dibayar. Segera proses pengiriman.`,
                        "order",
                        "orders",
                        order.id
                    );
                }
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

// ══════════════════════════════════════════════════════════════
// HOOK 6: After raw_timber_order Created (Generator beli kayu)
//         → iterate details, validate price server-side, decrease stock
//         → create notification for supplier
//
// 🛡️ SECURITY: Server re-fetches listing.price and overrides any
//    client-supplied unit_price to prevent price manipulation.
// ══════════════════════════════════════════════════════════════
onRecordAfterCreateSuccess((e) => {
    try {
        const order = e.record;
        const sellerId = order.getString("seller");
        const buyerId = order.getString("buyer");
        
        if (!sellerId || !buyerId) {
            e.next();
            return;
        }
        
        // --- 6a. Fetch all details for this order ---
        let details = [];
        try {
            details = $app.findRecordsByFilter(
                "raw_timber_order_details",
                `order = "${order.id}"`,
                "",
                100,
                0
            );
        } catch (err) {
            console.error("[WoodLoop] Hook 6: failed to fetch details:", err);
            e.next(); return;
        }
        
        if (details.length === 0) {
            console.error("[WoodLoop] Hook 6: Order has no details, cancelling");
            order.set("status", "cancelled");
            $app.dao().saveRecord(order);
            e.next(); return;
        }
        
        let serverComputedTotal = 0;
        let allProducts = [];
        let cancelled = false;
        
        // --- 6b. Validate each detail server-side ---
        for (const detail of details) {
            const listingId = detail.getString("listing");
            const clientQty = detail.getInt("quantity") || 1;
            
            if (!listingId) { continue; }
            
            try {
                const listing = $app.findRecordById("raw_timber_listings", listingId);
                const serverPrice = listing.getFloat("price");
                const serverStock = listing.getInt("stock") || 0;
                
                // 🛡️ Override unit_price with server price (client can't manipulate)
                const correctUnitPrice = serverPrice;
                const correctSubtotal = correctUnitPrice * clientQty;
                
                detail.set("unit_price", correctUnitPrice);
                detail.set("subtotal", correctSubtotal);
                $app.dao().saveRecord(detail);
                
                // 🛡️ Stock validation
                if (serverStock < clientQty) {
                    console.error(`[WoodLoop] Hook 6: INSUFFICIENT STOCK for ${listingId}: stock=${serverStock}, requested=${clientQty}`);
                    order.set("status", "cancelled");
                    $app.dao().saveRecord(order);
                    
                    createNotification(
                        buyerId,
                        "Pesanan Dibatalkan — Stok Habis",
                        `Pesanan #${order.id.slice(0, 8)} dibatalkan karena stok kayu tidak mencukupi.`,
                        "order",
                        "raw_timber_orders",
                        order.id
                    );
                    cancelled = true;
                    break;
                }
                
                // Decrease stock
                const newStock = Math.max(0, serverStock - clientQty);
                listing.set("stock", newStock);
                if (newStock <= 0) {
                    listing.set("status", "sold");
                }
                $app.dao().saveRecord(listing);
                console.log(`[WoodLoop] raw_timber_listing ${listingId} stock: ${serverStock} → ${newStock}`);
                
                // Collect product name for notification
                let timberName = "Kayu";
                try {
                    const wtId = listing.getString("wood_type");
                    if (wtId) {
                        const wt = $app.findRecordById("wood_types", wtId);
                        timberName = wt.getString("name") || "Kayu";
                    }
                } catch (_) {}
                allProducts.push(timberName);
                
                serverComputedTotal += correctSubtotal;
                
            } catch (err) {
                console.error(`[WoodLoop] Hook 6: error processing detail ${detail.id}:`, err);
                cancelled = true;
                break;
            }
        }
        
        if (cancelled) { e.next(); return; }
        
        // --- 6c. Update master order with server-computed total ---
        order.set("total_price", serverComputedTotal);
        $app.dao().saveRecord(order);
        
        // --- 6d. Notify supplier ---
        let buyerName = "Generator";
        try {
            const buyer = $app.findRecordById("users", buyerId);
            buyerName = buyer.getString("name") || buyer.getString("email") || "Generator";
        } catch (_) {}
        
        const productList = allProducts.length > 0 ? allProducts.join(", ") : "Kayu";
        
        createNotification(
            sellerId,
            "Pesanan Baru!",
            `${buyerName} memesan ${productList} dari Anda. Segera proses pesanan.`,
            "order",
            "raw_timber_orders",
            order.id
        );
        
    } catch (err) {
        console.error("[WoodLoop] Hook 6 error:", err);
    }
    e.next();
}, "raw_timber_orders");

// ══════════════════════════════════════════════════════════════
// HOOK 7: After raw_timber_order Status Updated
//         → create notification for the buyer (Generator)
// ══════════════════════════════════════════════════════════════
onRecordAfterUpdateSuccess((e) => {
    try {
        const order = e.record;
        const newStatus = order.getString("status");
        const buyerId = order.getString("buyer");
        
        if (!buyerId) {
            e.next();
            return;
        }
        
        if (newStatus === "processing") {
            createNotification(
                buyerId,
                "Pesanan Sedang Diproses",
                `Pesanan kayu #${order.id.slice(0, 8)} sedang diproses oleh Supplier.`,
                "order",
                "raw_timber_orders",
                order.id
            );
        } else if (newStatus === "shipped") {
            createNotification(
                buyerId,
                "Pesanan Telah Dikirim!",
                `Pesanan kayu #${order.id.slice(0, 8)} telah dikirim oleh Supplier.`,
                "order",
                "raw_timber_orders",
                order.id
            );
        } else if (newStatus === "cancelled") {
            createNotification(
                buyerId,
                "Pesanan Dibatalkan",
                `Pesanan kayu #${order.id.slice(0, 8)} telah dibatalkan.`,
                "order",
                "raw_timber_orders",
                order.id
            );
        }
        
    } catch (err) {
        console.error("[WoodLoop] Hook 7 error:", err);
    }
    e.next();
}, "raw_timber_orders");

console.log("[WoodLoop] All hooks registered successfully!");
