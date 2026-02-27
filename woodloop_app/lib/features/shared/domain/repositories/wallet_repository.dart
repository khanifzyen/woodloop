import '../entities/wallet_transaction.dart';

abstract class WalletRepository {
  Future<List<WalletTransaction>> getTransactions({
    required String userId,
    int page,
    int perPage,
  });

  Future<double> getBalance(String userId);
}
