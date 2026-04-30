part of 'generator_product_bloc.dart';

abstract class GeneratorProductEvent extends Equatable {
  const GeneratorProductEvent();

  @override
  List<Object?> get props => [];
}

class LoadGeneratorProducts extends GeneratorProductEvent {
  final String? generatorId;
  final String? status;
  final String? category;

  const LoadGeneratorProducts({this.generatorId, this.status, this.category});

  @override
  List<Object?> get props => [generatorId, status, category];
}

class LoadGeneratorProductDetail extends GeneratorProductEvent {
  final String id;

  const LoadGeneratorProductDetail(this.id);

  @override
  List<Object?> get props => [id];
}

class CreateGeneratorProduct extends GeneratorProductEvent {
  final Map<String, dynamic> body;

  const CreateGeneratorProduct(this.body);

  @override
  List<Object?> get props => [body];
}

class UpdateGeneratorProduct extends GeneratorProductEvent {
  final String id;
  final Map<String, dynamic> body;

  const UpdateGeneratorProduct({required this.id, required this.body});

  @override
  List<Object?> get props => [id, body];
}

class DeleteGeneratorProduct extends GeneratorProductEvent {
  final String id;

  const DeleteGeneratorProduct(this.id);

  @override
  List<Object?> get props => [id];
}
