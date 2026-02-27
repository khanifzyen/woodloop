import 'package:injectable/injectable.dart';

import '../../domain/entities/marketplace_transaction.dart';
import '../../domain/repositories/marketplace_repository.dart';
import '../datasources/marketplace_remote_data_source.dart';

@LazySingleton(as: MarketplaceRepository)
class MarketplaceRepositoryImpl implements MarketplaceRepository {
  final MarketplaceRemoteDataSource remoteDataSource;

  MarketplaceRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<MarketplaceTransaction>> getTransactions({
    String? buyerId,
    String? sellerId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getTransactions(
      buyerId: buyerId,
      sellerId: sellerId,
      status: status,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<MarketplaceTransaction> getTransactionById(String id) async {
    return await remoteDataSource.getTransactionById(id);
  }

  @override
  Future<MarketplaceTransaction> createTransaction(
    Map<String, dynamic> body,
  ) async {
    return await remoteDataSource.createTransaction(body);
  }

  @override
  Future<MarketplaceTransaction> updateTransaction(
    String id,
    Map<String, dynamic> body,
  ) async {
    return await remoteDataSource.updateTransaction(id, body);
  }
}
