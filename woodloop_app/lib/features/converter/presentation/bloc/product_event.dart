part of 'product_bloc.dart';

abstract class ProductEvent extends Equatable {
  const ProductEvent();

  @override
  List<Object?> get props => [];
}

class LoadProducts extends ProductEvent {
  final String? converterId;
  final String? category;

  const LoadProducts({this.converterId, this.category});

  @override
  List<Object?> get props => [converterId, category];
}

class LoadProductDetail extends ProductEvent {
  final String id;

  const LoadProductDetail(this.id);

  @override
  List<Object?> get props => [id];
}

class CreateProduct extends ProductEvent {
  final Map<String, dynamic> body;

  const CreateProduct(this.body);

  @override
  List<Object?> get props => [body];
}

class UpdateProduct extends ProductEvent {
  final String id;
  final Map<String, dynamic> body;

  const UpdateProduct({required this.id, required this.body});

  @override
  List<Object?> get props => [id, body];
}

class DeleteProduct extends ProductEvent {
  final String id;

  const DeleteProduct(this.id);

  @override
  List<Object?> get props => [id];
}
