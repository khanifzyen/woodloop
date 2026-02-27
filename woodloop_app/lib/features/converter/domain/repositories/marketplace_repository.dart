import '../entities/marketplace_transaction.dart';

abstract class MarketplaceRepository {
  Future<List<MarketplaceTransaction>> getTransactions({
    String? buyerId,
    String? sellerId,
    String? status,
    int page,
    int perPage,
  });

  Future<MarketplaceTransaction> getTransactionById(String id);
  Future<MarketplaceTransaction> createTransaction(Map<String, dynamic> body);
  Future<MarketplaceTransaction> updateTransaction(
    String id,
    Map<String, dynamic> body,
  );
}
