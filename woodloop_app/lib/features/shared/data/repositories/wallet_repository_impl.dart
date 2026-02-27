import 'package:injectable/injectable.dart';

import '../../domain/entities/wallet_transaction.dart';
import '../../domain/repositories/wallet_repository.dart';
import '../datasources/wallet_remote_data_source.dart';

@LazySingleton(as: WalletRepository)
class WalletRepositoryImpl implements WalletRepository {
  final WalletRemoteDataSource remoteDataSource;

  WalletRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<WalletTransaction>> getTransactions({
    required String userId,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getTransactions(
      userId: userId,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<double> getBalance(String userId) async {
    return await remoteDataSource.getBalance(userId);
  }
}
