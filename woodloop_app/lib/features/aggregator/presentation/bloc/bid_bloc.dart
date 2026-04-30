import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/bid.dart';
import '../../domain/repositories/bid_repository.dart';

part 'bid_event.dart';
part 'bid_state.dart';

@injectable
class BidBloc extends Bloc<BidEvent, BidState> {
  final BidRepository _repository;

  BidBloc(this._repository) : super(BidInitial()) {
    on<LoadBids>(_onLoadBids);
    on<LoadBidDetail>(_onLoadBidDetail);
    on<CreateBid>(_onCreateBid);
    on<UpdateBidStatus>(_onUpdateBidStatus);
    on<DeleteBid>(_onDeleteBid);
  }

  Future<void> _onLoadBids(
    LoadBids event,
    Emitter<BidState> emit,
  ) async {
    emit(BidLoading());
    try {
      final bids = await _repository.getBids(
        bidderId: event.bidderId,
        wasteListingId: event.wasteListingId,
        status: event.status,
      );
      emit(BidsLoaded(bids));
    } catch (e) {
      emit(BidError(e.toString()));
    }
  }

  Future<void> _onLoadBidDetail(
    LoadBidDetail event,
    Emitter<BidState> emit,
  ) async {
    emit(BidLoading());
    try {
      final bid = await _repository.getBidById(event.id);
      emit(BidDetailLoaded(bid));
    } catch (e) {
      emit(BidError(e.toString()));
    }
  }

  Future<void> _onCreateBid(
    CreateBid event,
    Emitter<BidState> emit,
  ) async {
    emit(BidLoading());
    try {
      final bid = await _repository.createBid(event.body);
      emit(BidCreated(bid));
    } catch (e) {
      emit(BidError(e.toString()));
    }
  }

  Future<void> _onUpdateBidStatus(
    UpdateBidStatus event,
    Emitter<BidState> emit,
  ) async {
    emit(BidLoading());
    try {
      final bid = await _repository.updateBid(event.id, event.body);
      emit(BidUpdated(bid));
    } catch (e) {
      emit(BidError(e.toString()));
    }
  }

  Future<void> _onDeleteBid(
    DeleteBid event,
    Emitter<BidState> emit,
  ) async {
    emit(BidLoading());
    try {
      await _repository.deleteBid(event.id);
      emit(BidDeleted());
    } catch (e) {
      emit(BidError(e.toString()));
    }
  }
}
