# PocketBase Hooks untuk WoodLoop

## Cara Deploy

1. Upload file `woodloop.pb.js` ke folder `pb_hooks/` di server PocketBase
   - Biasanya path: `/opt/pocketbase/pb_hooks/woodloop.pb.js`
   - Atau di samping executable PocketBase

2. Restart PocketBase:
   ```bash
   sudo systemctl restart pocketbase
   # atau
   ./pocketbase serve
   ```

3. Cek log PocketBase untuk memastikan hooks terdaftar:
   ```
   [WoodLoop] All hooks registered successfully!
   ```

## Hooks yang Terdaftar

| # | Trigger | Collection | Aksi |
|---|---------|-----------|------|
| 1 | After Create | pickups | waste_listing.status → "booked" |
| 2 | After Update→completed | pickups | Buat warehouse_inventory + impact_metrics + wallet_tx |
| 3 | After Update→paid | marketplace_transactions | warehouse→sold + wallet buyer/seller |
| 4 | After Update→accepted | bids | Buat pickup + reject bid lain |
| 5 | After Update→paid | orders | Kurangi stok produk + wallet buyer |

## Testing

Setelah deploy, test dengan:
1. Login sebagai generator → buat waste_listing
2. Login sebagai aggregator → buat pickup untuk waste_listing tsb
3. Update pickup status ke "completed" → cek apakah warehouse_inventory & wallet_transactions terbuat otomatis
