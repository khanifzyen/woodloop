import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/marketplace_transaction_model.dart';

abstract class MarketplaceRemoteDataSource {
  Future<List<MarketplaceTransactionModel>> getTransactions({
    String? buyerId,
    String? sellerId,
    String? status,
    int page = 1,
    int perPage = 30,
  });

  Future<MarketplaceTransactionModel> getTransactionById(String id);
  Future<MarketplaceTransactionModel> createTransaction(
    Map<String, dynamic> body,
  );
  Future<MarketplaceTransactionModel> updateTransaction(
    String id,
    Map<String, dynamic> body,
  );
}

@LazySingleton(as: MarketplaceRemoteDataSource)
class MarketplaceRemoteDataSourceImpl implements MarketplaceRemoteDataSource {
  final PocketBase pb;

  MarketplaceRemoteDataSourceImpl(this.pb);

  @override
  Future<List<MarketplaceTransactionModel>> getTransactions({
    String? buyerId,
    String? sellerId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    final filters = <String>[];
    if (buyerId != null && buyerId.isNotEmpty) {
      filters.add('buyer = "$buyerId"');
    }
    if (sellerId != null && sellerId.isNotEmpty) {
      filters.add('seller = "$sellerId"');
    }
    if (status != null && status.isNotEmpty) {
      filters.add('status = "$status"');
    }

    final result = await pb
        .collection('marketplace_transactions')
        .getList(
          page: page,
          perPage: perPage,
          filter: filters.isNotEmpty ? filters.join(' && ') : '',
          sort: '-created',
          expand: 'inventory_item',
        );

    return result.items
        .map((record) => MarketplaceTransactionModel.fromRecord(record))
        .toList();
  }

  @override
  Future<MarketplaceTransactionModel> getTransactionById(String id) async {
    final record = await pb
        .collection('marketplace_transactions')
        .getOne(id, expand: 'inventory_item,buyer,seller');
    return MarketplaceTransactionModel.fromRecord(record);
  }

  @override
  Future<MarketplaceTransactionModel> createTransaction(
    Map<String, dynamic> body,
  ) async {
    final record = await pb
        .collection('marketplace_transactions')
        .create(body: body);
    return MarketplaceTransactionModel.fromRecord(record);
  }

  @override
  Future<MarketplaceTransactionModel> updateTransaction(
    String id,
    Map<String, dynamic> body,
  ) async {
    final record = await pb
        .collection('marketplace_transactions')
        .update(id, body: body);
    return MarketplaceTransactionModel.fromRecord(record);
  }
}
