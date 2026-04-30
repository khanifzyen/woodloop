import 'package:injectable/injectable.dart';

import '../../domain/entities/generator_product.dart';
import '../../domain/repositories/generator_product_repository.dart';
import '../datasources/generator_product_remote_data_source.dart';

@LazySingleton(as: GeneratorProductRepository)
class GeneratorProductRepositoryImpl implements GeneratorProductRepository {
  final GeneratorProductRemoteDataSource remoteDataSource;

  GeneratorProductRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<GeneratorProduct>> getGeneratorProducts({
    String? generatorId,
    String? status,
    String? category,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getGeneratorProducts(
      generatorId: generatorId,
      status: status,
      category: category,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<GeneratorProduct> getGeneratorProductById(String id) async {
    return await remoteDataSource.getGeneratorProductById(id);
  }

  @override
  Future<GeneratorProduct> createGeneratorProduct(
    Map<String, dynamic> body,
  ) async {
    return await remoteDataSource.createGeneratorProduct(body);
  }

  @override
  Future<GeneratorProduct> updateGeneratorProduct(
    String id,
    Map<String, dynamic> body,
  ) async {
    return await remoteDataSource.updateGeneratorProduct(id, body);
  }

  @override
  Future<void> deleteGeneratorProduct(String id) async {
    await remoteDataSource.deleteGeneratorProduct(id);
  }
}
