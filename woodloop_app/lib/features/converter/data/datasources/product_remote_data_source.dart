import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/product_model.dart';

abstract class ProductRemoteDataSource {
  Future<List<ProductModel>> getProducts({
    String? converterId,
    String? category,
    int page = 1,
    int perPage = 30,
  });

  Future<ProductModel> getProductById(String id);
  Future<ProductModel> createProduct(Map<String, dynamic> body);
  Future<ProductModel> updateProduct(String id, Map<String, dynamic> body);
  Future<void> deleteProduct(String id);
}

@LazySingleton(as: ProductRemoteDataSource)
class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  final PocketBase pb;

  ProductRemoteDataSourceImpl(this.pb);

  @override
  Future<List<ProductModel>> getProducts({
    String? converterId,
    String? category,
    int page = 1,
    int perPage = 30,
  }) async {
    final filters = <String>[];
    if (converterId != null && converterId.isNotEmpty) {
      filters.add('converter = "$converterId"');
    }
    if (category != null && category.isNotEmpty) {
      filters.add('category = "$category"');
    }

    final result = await pb
        .collection('products')
        .getList(
          page: page,
          perPage: perPage,
          filter: filters.isNotEmpty ? filters.join(' && ') : '',
          sort: '-created',
        );

    return result.items
        .map((record) => ProductModel.fromRecord(record))
        .toList();
  }

  @override
  Future<ProductModel> getProductById(String id) async {
    final record = await pb
        .collection('products')
        .getOne(id, expand: 'converter,source_transactions');
    return ProductModel.fromRecord(record);
  }

  @override
  Future<ProductModel> createProduct(Map<String, dynamic> body) async {
    final record = await pb.collection('products').create(body: body);
    return ProductModel.fromRecord(record);
  }

  @override
  Future<ProductModel> updateProduct(
    String id,
    Map<String, dynamic> body,
  ) async {
    final record = await pb.collection('products').update(id, body: body);
    return ProductModel.fromRecord(record);
  }

  @override
  Future<void> deleteProduct(String id) async {
    await pb.collection('products').delete(id);
  }
}
