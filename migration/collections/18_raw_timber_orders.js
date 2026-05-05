/// <reference path="../pb_data/types.d.ts" />

/**
 * WoodLoop — PocketBase Migration: raw_timber_orders
 * 
 * Koleksi untuk mencatat pesanan kayu mentah dari Generator ke Supplier.
 * Menjembatani flow Supplier ↔ Generator.
 */

onBootstrap((e) => {
    e.next();
    console.log("[WoodLoop] raw_timber_orders migration check...");
});

// Create collection via migration pattern
// Fields: buyer(generator), seller(supplier), listing(raw_timber_listings), quantity, total_price, status
// Status: pending, accepted, rejected, completed
