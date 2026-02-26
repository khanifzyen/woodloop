/// <reference path="../pb_data/types.d.ts" />

/**
 * WOODLOOP MVP 1 - POCKETBASE HOOKS
 * 
 * Documentation Reference: docs/07-skema.md
 * This file contains business logic for automated operations across collections.
 */

// ==========================================
// 1. PICKUPS HOOKS
// ==========================================

onRecordAfterCreateRequest((e) => {
    // Hook: When a pickup is created, set the waste_listing status to 'booked'
    const wasteListingId = e.record.get("waste_listing");
    if (wasteListingId) {
        try {
            const wasteListing = $app.findRecordById("waste_listings", wasteListingId);
            wasteListing.set("status", "booked");
            $app.save(wasteListing);
        } catch (err) {
            console.error("Error updating waste_listing status to booked:", err);
        }
    }
}, "pickups");


onRecordAfterUpdateRequest((e) => {
    // Hook: When a pickup is updated to 'completed'
    const status = e.record.get("status");
    // Check if status changed to 'completed' vs just an unrelated update

    // We can't easily access the "old" state in AfterUpdate without keeping track,
    // so we'll just check if it's completed and the related waste_listing is not yet 'collected'.
    if (status === "completed") {
        const wasteListingId = e.record.get("waste_listing");

        if (wasteListingId) {
            try {
                const wasteListing = $app.findRecordById("waste_listings", wasteListingId);

                // Only process if it hasn't been collected yet to prevent duplicate inventory
                if (wasteListing.get("status") !== "collected") {

                    // 1. Set waste_listing.status -> 'collected'
                    wasteListing.set("status", "collected");
                    $app.save(wasteListing);

                    // 2. Buat record warehouse_inventory otomatis
                    const inventoryCollection = $app.findCollectionByNameOrId("warehouse_inventory");
                    const inventoryRecord = new Record(inventoryCollection);

                    inventoryRecord.set("aggregator", e.record.get("aggregator"));
                    inventoryRecord.set("pickup", e.record.getId());
                    inventoryRecord.set("wood_type", wasteListing.get("wood_type"));
                    inventoryRecord.set("form", wasteListing.get("form"));
                    inventoryRecord.set("weight", e.record.get("weight_verified") || wasteListing.get("volume"));
                    inventoryRecord.set("status", "in_stock");
                    inventoryRecord.set("price_per_kg", 0); // Need manual update later or inherited

                    $app.save(inventoryRecord);

                    // 3. Auto-calculate impact_metrics
                    const woodType = $app.findRecordById("wood_types", wasteListing.get("wood_type"));
                    const carbonFactor = woodType.get("carbon_factor") || 1.5;
                    const verifiedWeight = e.record.get("weight_verified") || wasteListing.get("volume");

                    const co2Saved = verifiedWeight * carbonFactor;
                    const date = new Date();
                    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                    const metricsCollection = $app.findCollectionByNameOrId("impact_metrics");
                    const metricsRecord = new Record(metricsCollection);

                    metricsRecord.set("waste_listing", wasteListingId);
                    metricsRecord.set("pickup", e.record.getId());
                    metricsRecord.set("co2_saved", co2Saved);
                    metricsRecord.set("waste_diverted", verifiedWeight);
                    metricsRecord.set("period", period);
                    // economic_value can be set later when sold, or estimated

                    $app.save(metricsRecord);

                    // 4. Create Notification for Generator
                    const notifCollection = $app.findCollectionByNameOrId("notifications");
                    const notifRecord = new Record(notifCollection);
                    notifRecord.set("user", wasteListing.get("generator"));
                    notifRecord.set("title", "Limbah Berhasil Dijemput!");
                    notifRecord.set("body", `Limbah Anda seberat ${verifiedWeight}kg telah berhasil dijemput dan divalidasi oleh Aggregator.`);
                    notifRecord.set("type", "pickup");
                    notifRecord.set("reference_type", "pickups");
                    notifRecord.set("reference_id", e.record.getId());
                    $app.save(notifRecord);

                }
            } catch (err) {
                console.error("Error processing completed pickup hook:", err);
            }
        }
    }
}, "pickups");


// ==========================================
// 2. MARKETPLACE TRANSACTIONS HOOKS
// ==========================================

onRecordAfterUpdateRequest((e) => {
    // Hook: When a marketplace transaction is paid -> update inventory & wallets
    const status = e.record.get("status");

    if (status === "paid") {
        try {
            // Update warehouse_inventory status -> 'sold'
            const inventoryId = e.record.get("inventory_item");
            if (inventoryId) {
                const inventory = $app.findRecordById("warehouse_inventory", inventoryId);
                if (inventory.get("status") !== "sold") {
                    inventory.set("status", "sold");
                    $app.save(inventory);
                }
            }

            // Optional: Update wallets here if implementing wallet balances directly inside users
            // Currently 07-skema.md only specifies creating wallet_transactions logs.
            const walletCol = $app.findCollectionByNameOrId("wallet_transactions");

            // Credit to Seller (Aggregator)
            const creditLog = new Record(walletCol);
            creditLog.set("user", e.record.get("seller"));
            creditLog.set("type", "credit");
            creditLog.set("amount", e.record.get("total_price"));
            creditLog.set("description", `Penjualan limbah (Transaksi: ${e.record.getId()})`);
            creditLog.set("reference_type", "marketplace_transaction");
            creditLog.set("reference_id", e.record.getId());
            $app.save(creditLog);

            // Debit from Buyer (Converter) - assuming they pay by wallet
            if (e.record.get("payment_method") === "wallet") {
                const debitLog = new Record(walletCol);
                debitLog.set("user", e.record.get("buyer"));
                debitLog.set("type", "debit");
                debitLog.set("amount", e.record.get("total_price"));
                debitLog.set("description", `Pembelian limbah (Transaksi: ${e.record.getId()})`);
                debitLog.set("reference_type", "marketplace_transaction");
                debitLog.set("reference_id", e.record.getId());
                $app.save(debitLog);
            }

        } catch (err) {
            console.error("Error processing paid marketplace transaction:", err);
        }
    }
}, "marketplace_transactions");


// ==========================================
// 3. ORDERS HOOKS
// ==========================================

onRecordAfterUpdateRequest((e) => {
    // Hook: When an order is paid -> update product stock & notify converter
    const status = e.record.get("status");

    if (status === "paid") {
        try {
            const productId = e.record.get("product");
            if (productId) {
                const product = $app.findRecordById("products", productId);

                // Reduce stock by quantity (ensure it doesn't drop below 0 contextually)
                let currentStock = product.get("stock") || 0;
                let orderedQty = e.record.get("quantity") || 1;

                // Only reduce stock if we haven't already processed this (simplified idempotency)
                // Ideally we'd check previous status, but in v0.23 we'd need to compare cached vs new.
                // For MVP, we assume status update happens once to 'paid'.

                let newStock = currentStock - orderedQty;
                product.set("stock", newStock < 0 ? 0 : newStock);
                $app.save(product);

                // Notify Converter
                const notifCollection = $app.findCollectionByNameOrId("notifications");
                const notifRecord = new Record(notifCollection);
                notifRecord.set("user", product.get("converter"));
                notifRecord.set("title", "Pesanan Baru Dibayar!");
                notifRecord.set("body", `Produk ${product.get("name")} Anda telah dibayar. Segera proses pengiriman.`);
                notifRecord.set("type", "order");
                notifRecord.set("reference_type", "orders");
                notifRecord.set("reference_id", e.record.getId());
                $app.save(notifRecord);
            }
        } catch (err) {
            console.error("Error processing paid order:", err);
        }
    }
}, "orders");


// ==========================================
// 4. BIDS HOOKS
// ==========================================

onRecordAfterUpdateRequest((e) => {
    // Hook: When a bid is accepted -> auto-create pickup, set waste booked, reject other bids
    const status = e.record.get("status");

    if (status === "accepted") {
        try {
            const wasteListingId = e.record.get("waste_listing");

            if (wasteListingId) {
                const wasteListing = $app.findRecordById("waste_listings", wasteListingId);

                // Ensure it's not already booked/collected
                if (wasteListing.get("status") === "available") {

                    // 1. Auto-create pickups record
                    const pickupCol = $app.findCollectionByNameOrId("pickups");
                    const pickupRec = new Record(pickupCol);
                    pickupRec.set("aggregator", e.record.get("bidder"));
                    pickupRec.set("waste_listing", wasteListingId);
                    pickupRec.set("status", "pending");
                    // Set scheduled date to tomorrow
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    pickupRec.set("scheduled_date", tomorrow);
                    $app.save(pickupRec);

                    // 2. Set waste_listing.status -> 'booked'
                    // This will also trigger the pickups AfterCreate hook theoretically, 
                    // but we do it manually here to be safe and avoid race conditions.
                    wasteListing.set("status", "booked");
                    $app.save(wasteListing);

                    // 3. Reject semua bid lain pada listing yang sama
                    // Find all bids for this waste_listing that are 'pending' AND not this bid
                    const otherBids = $app.findRecordsByFilter(
                        "bids",
                        `waste_listing = '${wasteListingId}' && status = 'pending' && id != '${e.record.getId()}'`
                    );

                    for (let ob of otherBids) {
                        ob.set("status", "rejected");
                        $app.save(ob);
                    }

                    // 4. Send Notification to Aggregator
                    const notifCol = $app.findCollectionByNameOrId("notifications");
                    const notifRec = new Record(notifCol);
                    notifRec.set("user", e.record.get("bidder"));
                    notifRec.set("title", "Tawaran Diterima!");
                    notifRec.set("body", `Tawaran Anda untuk limbah kayu diterima. Silakan cek jadwal penjemputan.`);
                    notifRec.set("type", "system");
                    notifRec.set("reference_type", "pickups");
                    notifRec.set("reference_id", pickupRec.getId());
                    $app.save(notifRec);
                }
            }
        } catch (err) {
            console.error("Error processing accepted bid:", err);
        }
    }
}, "bids");
