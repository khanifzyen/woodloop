import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/pickup.dart';
import '../../domain/repositories/pickup_repository.dart';

part 'pickup_event.dart';
part 'pickup_state.dart';

@injectable
class PickupBloc extends Bloc<PickupEvent, PickupState> {
  final PickupRepository _repository;

  PickupBloc(this._repository) : super(PickupInitial()) {
    on<LoadPickups>(_onLoadPickups);
    on<LoadPickupDetail>(_onLoadPickupDetail);
    on<CreatePickup>(_onCreatePickup);
    on<UpdatePickupStatus>(_onUpdatePickupStatus);
    on<DeletePickup>(_onDeletePickup);
  }

  Future<void> _onLoadPickups(
    LoadPickups event,
    Emitter<PickupState> emit,
  ) async {
    emit(PickupLoading());
    try {
      final pickups = await _repository.getPickups(
        aggregatorId: event.aggregatorId,
        status: event.status,
      );
      emit(PickupsLoaded(pickups));
    } catch (e) {
      emit(PickupError(e.toString()));
    }
  }

  Future<void> _onLoadPickupDetail(
    LoadPickupDetail event,
    Emitter<PickupState> emit,
  ) async {
    emit(PickupLoading());
    try {
      final pickup = await _repository.getPickupById(event.id);
      emit(PickupDetailLoaded(pickup));
    } catch (e) {
      emit(PickupError(e.toString()));
    }
  }

  Future<void> _onCreatePickup(
    CreatePickup event,
    Emitter<PickupState> emit,
  ) async {
    emit(PickupLoading());
    try {
      final pickup = await _repository.createPickup(event.body);
      emit(PickupCreated(pickup));
    } catch (e) {
      emit(PickupError(e.toString()));
    }
  }

  Future<void> _onUpdatePickupStatus(
    UpdatePickupStatus event,
    Emitter<PickupState> emit,
  ) async {
    emit(PickupLoading());
    try {
      final pickup = await _repository.updatePickup(event.id, event.body);
      emit(PickupUpdated(pickup));
    } catch (e) {
      emit(PickupError(e.toString()));
    }
  }

  Future<void> _onDeletePickup(
    DeletePickup event,
    Emitter<PickupState> emit,
  ) async {
    emit(PickupLoading());
    try {
      await _repository.deletePickup(event.id);
      emit(PickupDeleted());
    } catch (e) {
      emit(PickupError(e.toString()));
    }
  }
}
