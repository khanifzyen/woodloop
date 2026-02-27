import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/warehouse_item.dart';
import '../../domain/repositories/warehouse_repository.dart';

part 'warehouse_event.dart';
part 'warehouse_state.dart';

@injectable
class WarehouseBloc extends Bloc<WarehouseEvent, WarehouseState> {
  final WarehouseRepository _repository;

  WarehouseBloc(this._repository) : super(WarehouseInitial()) {
    on<LoadWarehouseItems>(_onLoadWarehouseItems);
    on<LoadWarehouseItemDetail>(_onLoadWarehouseItemDetail);
    on<UpdateWarehouseItem>(_onUpdateWarehouseItem);
  }

  Future<void> _onLoadWarehouseItems(
    LoadWarehouseItems event,
    Emitter<WarehouseState> emit,
  ) async {
    emit(WarehouseLoading());
    try {
      final items = await _repository.getWarehouseItems(
        aggregatorId: event.aggregatorId,
        status: event.status,
      );
      emit(WarehouseItemsLoaded(items));
    } catch (e) {
      emit(WarehouseError(e.toString()));
    }
  }

  Future<void> _onLoadWarehouseItemDetail(
    LoadWarehouseItemDetail event,
    Emitter<WarehouseState> emit,
  ) async {
    emit(WarehouseLoading());
    try {
      final item = await _repository.getWarehouseItemById(event.id);
      emit(WarehouseItemDetailLoaded(item));
    } catch (e) {
      emit(WarehouseError(e.toString()));
    }
  }

  Future<void> _onUpdateWarehouseItem(
    UpdateWarehouseItem event,
    Emitter<WarehouseState> emit,
  ) async {
    emit(WarehouseLoading());
    try {
      final item = await _repository.updateWarehouseItem(event.id, event.body);
      emit(WarehouseItemUpdated(item));
    } catch (e) {
      emit(WarehouseError(e.toString()));
    }
  }
}
