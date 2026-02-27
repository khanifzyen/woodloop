import 'package:injectable/injectable.dart';

import '../../domain/entities/product.dart';
import '../../domain/repositories/product_repository.dart';
import '../datasources/product_remote_data_source.dart';

@LazySingleton(as: ProductRepository)
class ProductRepositoryImpl implements ProductRepository {
  final ProductRemoteDataSource remoteDataSource;

  ProductRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<Product>> getProducts({
    String? converterId,
    String? category,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getProducts(
      converterId: converterId,
      category: category,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<Product> getProductById(String id) async {
    return await remoteDataSource.getProductById(id);
  }

  @override
  Future<Product> createProduct(Map<String, dynamic> body) async {
    return await remoteDataSource.createProduct(body);
  }

  @override
  Future<Product> updateProduct(String id, Map<String, dynamic> body) async {
    return await remoteDataSource.updateProduct(id, body);
  }

  @override
  Future<void> deleteProduct(String id) async {
    await remoteDataSource.deleteProduct(id);
  }
}
