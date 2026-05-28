import '../entities/raw_timber_listing.dart';
import '../repositories/supplier_repository.dart';

class GetAllRawTimberListings {
  final SupplierRepository repository;

  GetAllRawTimberListings(this.repository);

  Future<List<RawTimberListing>> call() async {
    return await repository.getAllListings();
  }
}
