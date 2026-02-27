import '../entities/pickup.dart';

abstract class PickupRepository {
  Future<List<Pickup>> getPickups({
    String? aggregatorId,
    String? status,
    int page,
    int perPage,
  });

  Future<Pickup> getPickupById(String id);
  Future<Pickup> createPickup(Map<String, dynamic> body);
  Future<Pickup> updatePickup(String id, Map<String, dynamic> body);
  Future<void> deletePickup(String id);
}
