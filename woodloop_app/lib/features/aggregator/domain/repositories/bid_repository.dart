import '../entities/bid.dart';

abstract class BidRepository {
  Future<List<Bid>> getBids({
    String? bidderId,
    String? wasteListingId,
    String? status,
    int page = 1,
    int perPage = 30,
  });

  Future<Bid> getBidById(String id);
  Future<Bid> createBid(Map<String, dynamic> body);
  Future<Bid> updateBid(String id, Map<String, dynamic> body);
  Future<void> deleteBid(String id);
}
