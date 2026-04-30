import 'package:injectable/injectable.dart';

import '../../domain/entities/bid.dart';
import '../../domain/repositories/bid_repository.dart';
import '../datasources/bid_remote_data_source.dart';

@LazySingleton(as: BidRepository)
class BidRepositoryImpl implements BidRepository {
  final BidRemoteDataSource remoteDataSource;

  BidRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<Bid>> getBids({
    String? bidderId,
    String? wasteListingId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getBids(
      bidderId: bidderId,
      wasteListingId: wasteListingId,
      status: status,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<Bid> getBidById(String id) async {
    return await remoteDataSource.getBidById(id);
  }

  @override
  Future<Bid> createBid(Map<String, dynamic> body) async {
    return await remoteDataSource.createBid(body);
  }

  @override
  Future<Bid> updateBid(String id, Map<String, dynamic> body) async {
    return await remoteDataSource.updateBid(id, body);
  }

  @override
  Future<void> deleteBid(String id) async {
    await remoteDataSource.deleteBid(id);
  }
}
