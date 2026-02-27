import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/waste_listing.dart';
import '../../domain/repositories/waste_listing_repository.dart';

part 'waste_listing_event.dart';
part 'waste_listing_state.dart';

@injectable
class WasteListingBloc extends Bloc<WasteListingEvent, WasteListingState> {
  final WasteListingRepository _repository;

  WasteListingBloc(this._repository) : super(WasteListingInitial()) {
    on<LoadWasteListings>(_onLoadWasteListings);
    on<LoadWasteListingDetail>(_onLoadWasteListingDetail);
    on<CreateWasteListing>(_onCreateWasteListing);
    on<UpdateWasteListing>(_onUpdateWasteListing);
    on<DeleteWasteListing>(_onDeleteWasteListing);
  }

  Future<void> _onLoadWasteListings(
    LoadWasteListings event,
    Emitter<WasteListingState> emit,
  ) async {
    emit(WasteListingLoading());
    try {
      final listings = await _repository.getWasteListings(
        generatorId: event.generatorId,
        status: event.status,
      );
      emit(WasteListingsLoaded(listings));
    } catch (e) {
      emit(WasteListingError(e.toString()));
    }
  }

  Future<void> _onLoadWasteListingDetail(
    LoadWasteListingDetail event,
    Emitter<WasteListingState> emit,
  ) async {
    emit(WasteListingLoading());
    try {
      final listing = await _repository.getWasteListingById(event.id);
      emit(WasteListingDetailLoaded(listing));
    } catch (e) {
      emit(WasteListingError(e.toString()));
    }
  }

  Future<void> _onCreateWasteListing(
    CreateWasteListing event,
    Emitter<WasteListingState> emit,
  ) async {
    emit(WasteListingLoading());
    try {
      final listing = await _repository.createWasteListing(event.body);
      emit(WasteListingCreated(listing));
    } catch (e) {
      emit(WasteListingError(e.toString()));
    }
  }

  Future<void> _onUpdateWasteListing(
    UpdateWasteListing event,
    Emitter<WasteListingState> emit,
  ) async {
    emit(WasteListingLoading());
    try {
      final listing = await _repository.updateWasteListing(
        event.id,
        event.body,
      );
      emit(WasteListingUpdated(listing));
    } catch (e) {
      emit(WasteListingError(e.toString()));
    }
  }

  Future<void> _onDeleteWasteListing(
    DeleteWasteListing event,
    Emitter<WasteListingState> emit,
  ) async {
    emit(WasteListingLoading());
    try {
      await _repository.deleteWasteListing(event.id);
      emit(WasteListingDeleted());
    } catch (e) {
      emit(WasteListingError(e.toString()));
    }
  }
}
