import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/traceability_step.dart';

abstract class TraceabilityRemoteDataSource {
  Future<TraceabilityData> getTraceability(String productId);
}

@LazySingleton(as: TraceabilityRemoteDataSource)
class TraceabilityRemoteDataSourceImpl implements TraceabilityRemoteDataSource {
  final PocketBase _pb;

  TraceabilityRemoteDataSourceImpl(this._pb);

  @override
  Future<TraceabilityData> getTraceability(String productId) async {
    // Fetch the product with expanded source_transactions
    final product = await _pb
        .collection('products')
        .getOne(productId, expand: 'source_transactions');

    final productName = product.getStringValue('name');
    final productCategory = product.getStringValue('category');

    final List<TraceabilityStep> steps = [];

    // Step 4: Converter creates the product (most recent)
    final converterId = product.getStringValue('converter');
    String converterName = 'Converter Studio';
    try {
      final converter = await _pb.collection('users').getOne(converterId);
      converterName = converter.getStringValue('name');
    } catch (_) {}

    steps.add(
      TraceabilityStep(
        role: 'converter',
        entityName: converterName,
        title: 'Produk Upcycle Dibuat',
        description: 'Limbah kayu ditransformasi menjadi produk bernilai oleh ',
        date:
            DateTime.tryParse(product.getStringValue('created')) ??
            DateTime.now(),
        isVerified: true,
      ),
    );

    // Try to build upstream steps from source_transactions
    final sourceTransactionIds = product.getListValue<String>(
      'source_transactions',
    );

    // Calculate impact metrics
    double co2Saved = 0;
    double wasteDiverted = 0;

    if (sourceTransactionIds.isNotEmpty) {
      try {
        final transaction = await _pb
            .collection('marketplace_transactions')
            .getOne(sourceTransactionIds.first, expand: 'inventory_item');

        // Step 3: Aggregator stored in warehouse
        final warehouseItem = transaction.get<RecordModel?>(
          'expand.inventory_item',
        );
        if (warehouseItem != null) {
          final aggregatorId = warehouseItem.getStringValue('aggregator');
          String aggregatorName = 'Aggregator';
          try {
            final agg = await _pb.collection('users').getOne(aggregatorId);
            aggregatorName = agg.getStringValue('name');
          } catch (_) {}

          steps.add(
            TraceabilityStep(
              role: 'aggregator',
              entityName: aggregatorName,
              title: 'Disortir & Disimpan di Gudang',
              description: 'Limbah diverifikasi, disortir, dan disimpan oleh ',
              date:
                  DateTime.tryParse(warehouseItem.getStringValue('created')) ??
                  DateTime.now(),
              isVerified: true,
            ),
          );

          // Get pickup from warehouse_inventory to trace further
          final pickupId = warehouseItem.getStringValue('pickup');
          if (pickupId.isNotEmpty) {
            try {
              final pickup = await _pb.collection('pickups').getOne(pickupId);
              final wasteListingId = pickup.getStringValue('waste_listing');

              // Step 2: Pickup was completed (from waste_listing)
              if (wasteListingId.isNotEmpty) {
                try {
                  final wasteListing = await _pb
                      .collection('waste_listings')
                      .getOne(wasteListingId);
                  final generatorId = wasteListing.getStringValue('generator');
                  String generatorName = 'Generator';
                  try {
                    final gen = await _pb.collection('users').getOne(generatorId);
                    generatorName = gen.getStringValue('name');
                  } catch (_) {}

                  steps.add(
                    TraceabilityStep(
                      role: 'generator',
                      entityName: generatorName,
                      title: 'Limbah Kayu Dilaporkan',
                      description:
                          'Limbah ${wasteListing.getStringValue('form')} dilaporkan oleh ',
                      date:
                          DateTime.tryParse(
                            wasteListing.getStringValue('created'),
                          ) ??
                          DateTime.now(),
                      isVerified: true,
                    ),
                  );
                } catch (_) {}
              }
            } catch (_) {}
          }

          // Query impact_metrics by pickup (traces through product -> marketplace_transactions -> warehouse_inventory -> pickups -> impact_metrics)
          if (pickupId.isNotEmpty) {
            try {
              final impactRecords = await _pb
                  .collection('impact_metrics')
                  .getList(filter: 'pickup = "$pickupId"', perPage: 1);
              if (impactRecords.items.isNotEmpty) {
                final impact = impactRecords.items.first;
                co2Saved = (impact.data['co2_saved'] as num?)?.toDouble() ?? 0;
                wasteDiverted =
                    (impact.data['waste_diverted'] as num?)?.toDouble() ?? 0;
              }
            } catch (_) {}
          }
        }
      } catch (_) {}
    }

    // Sort steps by date (oldest first)
    steps.sort((a, b) => a.date.compareTo(b.date));

    return TraceabilityData(
      productId: productId,
      productName: productName,
      productCategory: productCategory,
      co2Saved: co2Saved,
      wasteDiverted: wasteDiverted,
      steps: steps,
    );
  }
}
