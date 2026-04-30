import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/bid_model.dart';

abstract class BidRemoteDataSource {
  Future<List<BidModel>> getBids({
    String? bidderId,
    String? wasteListingId,
    String? status,
    int page = 1,
    int perPage = 30,
  });

  Future<BidModel> getBidById(String id);
  Future<BidModel> createBid(Map<String, dynamic> body);
  Future<BidModel> updateBid(String id, Map<String, dynamic> body);
  Future<void> deleteBid(String id);
}

@LazySingleton(as: BidRemoteDataSource)
class BidRemoteDataSourceImpl implements BidRemoteDataSource {
  final PocketBase pb;

  BidRemoteDataSourceImpl(this.pb);

  @override
  Future<List<BidModel>> getBids({
    String? bidderId,
    String? wasteListingId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    final filters = <String>[];
    if (bidderId != null && bidderId.isNotEmpty) {
      filters.add('bidder = "$bidderId"');
    }
    if (wasteListingId != null && wasteListingId.isNotEmpty) {
      filters.add('waste_listing = "$wasteListingId"');
    }
    if (status != null && status.isNotEmpty) {
      filters.add('status = "$status"');
    }

    final result = await pb.collection('bids').getList(
          page: page,
          perPage: perPage,
          filter: filters.isNotEmpty ? filters.join(' && ') : '',
          sort: '-created',
        );

    return result.items
        .map((record) => BidModel.fromRecord(record))
        .toList();
  }

  @override
  Future<BidModel> getBidById(String id) async {
    final record = await pb.collection('bids').getOne(id);
    return BidModel.fromRecord(record);
  }

  @override
  Future<BidModel> createBid(Map<String, dynamic> body) async {
    final record = await pb.collection('bids').create(body: body);
    return BidModel.fromRecord(record);
  }

  @override
  Future<BidModel> updateBid(String id, Map<String, dynamic> body) async {
    final record = await pb.collection('bids').update(id, body: body);
    return BidModel.fromRecord(record);
  }

  @override
  Future<void> deleteBid(String id) async {
    await pb.collection('bids').delete(id);
  }
}
