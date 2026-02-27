import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/wallet_transaction_model.dart';

abstract class WalletRemoteDataSource {
  Future<List<WalletTransactionModel>> getTransactions({
    required String userId,
    int page = 1,
    int perPage = 30,
  });

  Future<double> getBalance(String userId);
}

@LazySingleton(as: WalletRemoteDataSource)
class WalletRemoteDataSourceImpl implements WalletRemoteDataSource {
  final PocketBase pb;

  WalletRemoteDataSourceImpl(this.pb);

  @override
  Future<List<WalletTransactionModel>> getTransactions({
    required String userId,
    int page = 1,
    int perPage = 30,
  }) async {
    final result = await pb
        .collection('wallet_transactions')
        .getList(
          page: page,
          perPage: perPage,
          filter: 'user = "$userId"',
          sort: '-created',
        );

    return result.items
        .map((record) => WalletTransactionModel.fromRecord(record))
        .toList();
  }

  @override
  Future<double> getBalance(String userId) async {
    // Get the latest transaction to read balance_after
    final result = await pb
        .collection('wallet_transactions')
        .getList(
          page: 1,
          perPage: 1,
          filter: 'user = "$userId"',
          sort: '-created',
        );

    if (result.items.isEmpty) {
      return 0.0;
    }

    return result.items.first.getDoubleValue('balance_after');
  }
}
