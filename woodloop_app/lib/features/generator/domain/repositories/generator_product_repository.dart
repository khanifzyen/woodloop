import '../entities/generator_product.dart';

abstract class GeneratorProductRepository {
  Future<List<GeneratorProduct>> getGeneratorProducts({
    String? generatorId,
    String? status,
    String? category,
    int page = 1,
    int perPage = 30,
  });

  Future<GeneratorProduct> getGeneratorProductById(String id);

  Future<GeneratorProduct> createGeneratorProduct(Map<String, dynamic> body);

  Future<GeneratorProduct> updateGeneratorProduct(
    String id,
    Map<String, dynamic> body,
  );

  Future<void> deleteGeneratorProduct(String id);
}
