part of 'generator_product_bloc.dart';

abstract class GeneratorProductState extends Equatable {
  const GeneratorProductState();

  @override
  List<Object?> get props => [];
}

class GeneratorProductInitial extends GeneratorProductState {}

class GeneratorProductLoading extends GeneratorProductState {}

class GeneratorProductsLoaded extends GeneratorProductState {
  final List<GeneratorProduct> products;

  const GeneratorProductsLoaded(this.products);

  @override
  List<Object?> get props => [products];
}

class GeneratorProductDetailLoaded extends GeneratorProductState {
  final GeneratorProduct product;

  const GeneratorProductDetailLoaded(this.product);

  @override
  List<Object?> get props => [product];
}

class GeneratorProductCreated extends GeneratorProductState {
  final GeneratorProduct product;

  const GeneratorProductCreated(this.product);

  @override
  List<Object?> get props => [product];
}

class GeneratorProductUpdated extends GeneratorProductState {
  final GeneratorProduct product;

  const GeneratorProductUpdated(this.product);

  @override
  List<Object?> get props => [product];
}

class GeneratorProductDeleted extends GeneratorProductState {}

class GeneratorProductError extends GeneratorProductState {
  final String message;

  const GeneratorProductError(this.message);

  @override
  List<Object?> get props => [message];
}
