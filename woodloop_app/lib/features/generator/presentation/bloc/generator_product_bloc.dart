import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/generator_product.dart';
import '../../domain/repositories/generator_product_repository.dart';

part 'generator_product_event.dart';
part 'generator_product_state.dart';

@injectable
class GeneratorProductBloc
    extends Bloc<GeneratorProductEvent, GeneratorProductState> {
  final GeneratorProductRepository _repository;

  GeneratorProductBloc(this._repository) : super(GeneratorProductInitial()) {
    on<LoadGeneratorProducts>(_onLoadGeneratorProducts);
    on<LoadGeneratorProductDetail>(_onLoadGeneratorProductDetail);
    on<CreateGeneratorProduct>(_onCreateGeneratorProduct);
    on<UpdateGeneratorProduct>(_onUpdateGeneratorProduct);
    on<DeleteGeneratorProduct>(_onDeleteGeneratorProduct);
  }

  Future<void> _onLoadGeneratorProducts(
    LoadGeneratorProducts event,
    Emitter<GeneratorProductState> emit,
  ) async {
    emit(GeneratorProductLoading());
    try {
      final products = await _repository.getGeneratorProducts(
        generatorId: event.generatorId,
        status: event.status,
        category: event.category,
      );
      emit(GeneratorProductsLoaded(products));
    } catch (e) {
      emit(GeneratorProductError(e.toString()));
    }
  }

  Future<void> _onLoadGeneratorProductDetail(
    LoadGeneratorProductDetail event,
    Emitter<GeneratorProductState> emit,
  ) async {
    emit(GeneratorProductLoading());
    try {
      final product =
          await _repository.getGeneratorProductById(event.id);
      emit(GeneratorProductDetailLoaded(product));
    } catch (e) {
      emit(GeneratorProductError(e.toString()));
    }
  }

  Future<void> _onCreateGeneratorProduct(
    CreateGeneratorProduct event,
    Emitter<GeneratorProductState> emit,
  ) async {
    emit(GeneratorProductLoading());
    try {
      final product =
          await _repository.createGeneratorProduct(event.body);
      emit(GeneratorProductCreated(product));
    } catch (e) {
      emit(GeneratorProductError(e.toString()));
    }
  }

  Future<void> _onUpdateGeneratorProduct(
    UpdateGeneratorProduct event,
    Emitter<GeneratorProductState> emit,
  ) async {
    emit(GeneratorProductLoading());
    try {
      final product = await _repository.updateGeneratorProduct(
        event.id,
        event.body,
      );
      emit(GeneratorProductUpdated(product));
    } catch (e) {
      emit(GeneratorProductError(e.toString()));
    }
  }

  Future<void> _onDeleteGeneratorProduct(
    DeleteGeneratorProduct event,
    Emitter<GeneratorProductState> emit,
  ) async {
    emit(GeneratorProductLoading());
    try {
      await _repository.deleteGeneratorProduct(event.id);
      emit(GeneratorProductDeleted());
    } catch (e) {
      emit(GeneratorProductError(e.toString()));
    }
  }
}
