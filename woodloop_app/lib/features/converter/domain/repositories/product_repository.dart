import '../entities/product.dart';

abstract class ProductRepository {
  Future<List<Product>> getProducts({
    String? converterId,
    String? category,
    int page,
    int perPage,
  });

  Future<Product> getProductById(String id);
  Future<Product> createProduct(Map<String, dynamic> body);
  Future<Product> updateProduct(String id, Map<String, dynamic> body);
  Future<void> deleteProduct(String id);
}
