import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/generator_product_model.dart';

abstract class GeneratorProductRemoteDataSource {
  Future<List<GeneratorProductModel>> getGeneratorProducts({
    String? generatorId,
    String? status,
    String? category,
    int page = 1,
    int perPage = 30,
  });

  Future<GeneratorProductModel> getGeneratorProductById(String id);

  Future<GeneratorProductModel> createGeneratorProduct(
    Map<String, dynamic> body,
  );

  Future<GeneratorProductModel> updateGeneratorProduct(
    String id,
    Map<String, dynamic> body,
  );

  Future<void> deleteGeneratorProduct(String id);
}

@LazySingleton(as: GeneratorProductRemoteDataSource)
class GeneratorProductRemoteDataSourceImpl
    implements GeneratorProductRemoteDataSource {
  final PocketBase pb;

  GeneratorProductRemoteDataSourceImpl(this.pb);

  @override
  Future<List<GeneratorProductModel>> getGeneratorProducts({
    String? generatorId,
    String? status,
    String? category,
    int page = 1,
    int perPage = 30,
  }) async {
    final filters = <String>[];
    if (generatorId != null && generatorId.isNotEmpty) {
      filters.add('generator = "$generatorId"');
    }
    if (status != null && status.isNotEmpty) {
      filters.add('status = "$status"');
    }
    if (category != null && category.isNotEmpty) {
      filters.add('category = "$category"');
    }

    final result = await pb.collection('generator_products').getList(
          page: page,
          perPage: perPage,
          filter: filters.isNotEmpty ? filters.join(' && ') : '',
          sort: '-created',
        );

    return result.items
        .map((record) => GeneratorProductModel.fromRecord(record))
        .toList();
  }

  @override
  Future<GeneratorProductModel> getGeneratorProductById(String id) async {
    final record =
        await pb.collection('generator_products').getOne(id);
    return GeneratorProductModel.fromRecord(record);
  }

  @override
  Future<GeneratorProductModel> createGeneratorProduct(
    Map<String, dynamic> body,
  ) async {
    final record =
        await pb.collection('generator_products').create(body: body);
    return GeneratorProductModel.fromRecord(record);
  }

  @override
  Future<GeneratorProductModel> updateGeneratorProduct(
    String id,
    Map<String, dynamic> body,
  ) async {
    final record =
        await pb.collection('generator_products').update(id, body: body);
    return GeneratorProductModel.fromRecord(record);
  }

  @override
  Future<void> deleteGeneratorProduct(String id) async {
    await pb.collection('generator_products').delete(id);
  }
}
