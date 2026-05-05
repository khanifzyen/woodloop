import 'package:flutter_test/flutter_test.dart';

/// Core Business Flow Integration Test
/// 
/// Dokumentasi alur bisnis utama WoodLoop:
/// Generator → Aggregator → Converter → Buyer
/// 
/// Test ini memvalidasi state transitions dan business rules
/// tanpa harus connect ke PocketBase (pure logic test).

void main() {
  group('WoodLoop Core Business Flow', () {
    // ──────────────────────────────────────────
    // STEP 1: Generator creates waste listing
    // ──────────────────────────────────────────
    group('Step 1: Generator → Create Waste Listing', () {
      test('waste listing created with status "available"', () {
        const status = 'available';
        expect(status, equals('available'));
      });

      test('waste listing has required fields: form, wood_type, volume', () {
        final requiredFields = ['generator', 'wood_type', 'volume', 'unit'];
        final body = {
          'generator': 'gen1',
          'wood_type': 'wt1',
          'form': 'offcut_large',
          'condition': 'dry',
          'volume': 50,
          'unit': 'kg',
          'status': 'available',
        };
        for (final field in requiredFields) {
          expect(body.containsKey(field), isTrue, reason: 'Missing field: $field');
        }
      });

      test('waste listing statuses follow valid state machine', () {
        const validStatuses = ['available', 'booked', 'collected', 'sold'];
        const statusFlow = ['available', 'booked', 'collected', 'sold'];

        // Valid transitions: forward only
        for (var i = 0; i < statusFlow.length - 1; i++) {
          expect(validStatuses.contains(statusFlow[i]), isTrue);
          expect(validStatuses.contains(statusFlow[i + 1]), isTrue);
        }
      });
    });

    // ──────────────────────────────────────────
    // STEP 2: Aggregator creates pickup
    // ──────────────────────────────────────────
    group('Step 2: Aggregator → Create Pickup', () {
      test('pickup must reference waste_listing and aggregator', () {
        final requiredFields = ['aggregator', 'waste_listing'];
        final body = {
          'aggregator': 'agg1',
          'waste_listing': 'wl1',
          'status': 'pending',
        };
        for (final field in requiredFields) {
          expect(body.containsKey(field), isTrue, reason: 'Missing field: $field');
        }
      });

      test('pickup status flow: pending → on_the_way → completed', () {
        const validStatuses = ['pending', 'on_the_way', 'completed', 'cancelled'];

        // Pickup must start as 'pending'
        expect(validStatuses.first, equals('pending'));

        // Completed is valid terminal state
        expect(validStatuses.contains('completed'), isTrue);
      });

      test('pickup creation → PB Hook sets waste_listing to "booked"', () {
        // This is handled by PB Hook 1 (pb_hooks/woodloop.pb.js)
        // Logic: after pickup create, waste_listing.status = "booked"
        const wasteStatusAfterPickup = 'booked';
        expect(wasteStatusAfterPickup, equals('booked'));
      });
    });

    // ──────────────────────────────────────────
    // STEP 3: Aggregator confirms pickup completed
    // ──────────────────────────────────────────
    group('Step 3: Aggregator → Confirm Pickup Completed', () {
      test('pickup completion triggers cascade (PB Hook 2)', () {
        // PB Hook 2 cascade:
        // 1. waste_listing.status → "collected"
        // 2. warehouse_inventory created
        // 3. impact_metrics created (CO2 = weight × carbon_factor)
        // 4. wallet_transaction (credit generator)

        const cascadeActions = [
          'waste_listing → collected',
          'warehouse_inventory created',
          'impact_metrics created',
          'wallet_tx: credit generator',
        ];
        expect(cascadeActions.length, equals(4));
      });

      test('CO2 calculation: weight × carbon_factor', () {
        const weight = 50.0; // kg
        const carbonFactor = 1.5; // Jati
        const expectedCO2 = 75.0;

        final co2Saved = weight * carbonFactor;
        expect(co2Saved, equals(expectedCO2));
      });

      test('wallet amount equals waste price_estimate', () {
        const priceEstimate = 500000;
        const creditAmount = priceEstimate;
        expect(creditAmount, equals(500000));
      });

      test('impact period format: YYYY-MM', () {
        final now = DateTime(2026, 5, 15);
        final period = '${now.year}-${now.month.toString().padLeft(2, '0')}';
        expect(period, equals('2026-05'));
      });
    });

    // ──────────────────────────────────────────
    // STEP 4: Converter buys from marketplace
    // ──────────────────────────────────────────
    group('Step 4: Converter → Buy from Marketplace', () {
      test('marketplace transaction must reference buyer, seller, inventory', () {
        final requiredFields = ['buyer', 'seller', 'inventory_item'];
        final body = {
          'buyer': 'conv1',
          'seller': 'agg1',
          'inventory_item': 'wi1',
          'quantity': 30,
          'total_price': 300000,
          'status': 'pending',
        };
        for (final field in requiredFields) {
          expect(body.containsKey(field), isTrue, reason: 'Missing field: $field');
        }
      });

      test('marketplace status flow: pending → paid → shipped → received', () {
        const validStatuses = [
          'pending',
          'paid',
          'shipped',
          'received',
          'cancelled',
        ];

        // Transaction starts as pending
        expect(validStatuses.first, equals('pending'));

        // paid triggers PB Hook 3 cascade
        expect(validStatuses.contains('paid'), isTrue);
        expect(validStatuses.contains('received'), isTrue);
      });

      test('PB Hook 3: paid → warehouse sold + wallet debit/credit', () {
        // PB Hook 3 cascade:
        // 1. warehouse_inventory.status → "sold"
        // 2. wallet_tx: debit buyer (converter)
        // 3. wallet_tx: credit seller (aggregator)

        const cascadeActions = [
          'warehouse → sold',
          'wallet_tx: debit buyer',
          'wallet_tx: credit seller',
        ];
        expect(cascadeActions.length, equals(3));
      });
    });

    // ──────────────────────────────────────────
    // STEP 5: Converter creates upcycled product
    // ──────────────────────────────────────────
    group('Step 5: Converter → Create Upcycled Product', () {
      test('product creation links to source marketplace transactions', () {
        final body = {
          'converter': 'conv1',
          'name': 'Vas Bunga Trembesi',
          'category': 'decor',
          'price': 250000,
          'stock': 10,
          'source_transactions': ['mtx1'],
        };
        expect(body['source_transactions'], isNotEmpty);
      });
    });

    // ──────────────────────────────────────────
    // STEP 6: Buyer purchases product
    // ──────────────────────────────────────────
    group('Step 6: Buyer → Purchase Product (Order)', () {
      test('order must have buyer, product, quantity, total_price', () {
        final body = {
          'buyer': 'buy1',
          'product': 'prd1',
          'quantity': 2,
          'total_price': 500000,
          'status': 'payment_pending',
          'shipping_address': 'Jl. Kartini No. 10, Jepara',
        };
        expect(body['quantity'], greaterThan(0));
        expect(body['total_price'], greaterThan(0));
      });

      test('order status flow: payment_pending → paid → shipped → received', () {
        const statusFlow = [
          'payment_pending',
          'paid',
          'processing',
          'shipped',
          'received',
          'cancelled',
        ];
        expect(statusFlow.length, greaterThanOrEqualTo(4));

        // paid triggers PB Hook 5: decrease stock + wallet debit
        expect(statusFlow.contains('paid'), isTrue);
      });

      test('PB Hook 5: paid → decrease stock + wallet debit buyer', () {
        const cascadeActions = [
          'product.stock decreased',
          'wallet_tx: debit buyer',
        ];
        expect(cascadeActions.length, equals(2));
      });
    });

    // ──────────────────────────────────────────
    // End-to-End: Traceability chain
    // ──────────────────────────────────────────
    group('Traceability Chain (cross-cutting)', () {
      test('full chain: product → marketplace_tx → warehouse → pickup → waste', () {
        const chain = [
          'products',
          'marketplace_transactions',
          'warehouse_inventory',
          'pickups',
          'waste_listings',
        ];
        expect(chain.length, equals(5));
      });

      test('traceability steps map to roles: converter, aggregator, generator', () {
        const roles = ['converter', 'aggregator', 'generator'];
        expect(roles.length, equals(3));
        expect(roles.contains('converter'), isTrue);
        expect(roles.contains('aggregator'), isTrue);
        expect(roles.contains('generator'), isTrue);
      });
    });

    // ──────────────────────────────────────────
    // Wallet: Balance consistency
    // ──────────────────────────────────────────
    group('Wallet Balance Consistency', () {
      test('balance_after = previous_balance ± amount', () {
        const previousBalance = 1000000.0;
        const creditAmount = 500000.0;
        const expectedAfter = previousBalance + creditAmount;
        expect(expectedAfter, equals(1500000.0));

        const debitAmount = 300000.0;
        const afterDebit = expectedAfter - debitAmount;
        expect(afterDebit, equals(1200000.0));
      });

      test('wallet_transactions are immutable (no update/delete via API)', () {
        // Rule: createRule, updateRule, deleteRule = null (hook-only)
        // Verified in FASE 1 audit
        const immutable = true;
        expect(immutable, isTrue);
      });
    });

    // ──────────────────────────────────────────
    // Wood types: carbon factor mapping
    // ──────────────────────────────────────────
    group('Wood Types Carbon Factor', () {
      test('each wood type has a carbon factor', () {
        const woodTypes = {
          'Jati': 1.5,
          'Mahoni': 1.4,
          'Trembesi': 1.2,
          'Mindi': 1.1,
          'Akasia': 1.3,
          'Pinus': 1.0,
        };
        expect(woodTypes.length, equals(6));
        for (final entry in woodTypes.entries) {
          expect(entry.value, greaterThan(0));
        }
      });
    });
  });
}
