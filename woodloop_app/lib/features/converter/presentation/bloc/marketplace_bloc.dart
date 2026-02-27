import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/marketplace_transaction.dart';
import '../../domain/repositories/marketplace_repository.dart';

part 'marketplace_event.dart';
part 'marketplace_state.dart';

@injectable
class MarketplaceBloc extends Bloc<MarketplaceEvent, MarketplaceState> {
  final MarketplaceRepository _repository;

  MarketplaceBloc(this._repository) : super(MarketplaceInitial()) {
    on<LoadMarketplaceTransactions>(_onLoadTransactions);
    on<LoadMarketplaceTransactionDetail>(_onLoadTransactionDetail);
    on<CreateMarketplaceTransaction>(_onCreateTransaction);
    on<UpdateMarketplaceTransaction>(_onUpdateTransaction);
  }

  Future<void> _onLoadTransactions(
    LoadMarketplaceTransactions event,
    Emitter<MarketplaceState> emit,
  ) async {
    emit(MarketplaceLoading());
    try {
      final transactions = await _repository.getTransactions(
        buyerId: event.buyerId,
        sellerId: event.sellerId,
        status: event.status,
      );
      emit(MarketplaceTransactionsLoaded(transactions));
    } catch (e) {
      emit(MarketplaceError(e.toString()));
    }
  }

  Future<void> _onLoadTransactionDetail(
    LoadMarketplaceTransactionDetail event,
    Emitter<MarketplaceState> emit,
  ) async {
    emit(MarketplaceLoading());
    try {
      final transaction = await _repository.getTransactionById(event.id);
      emit(MarketplaceTransactionDetailLoaded(transaction));
    } catch (e) {
      emit(MarketplaceError(e.toString()));
    }
  }

  Future<void> _onCreateTransaction(
    CreateMarketplaceTransaction event,
    Emitter<MarketplaceState> emit,
  ) async {
    emit(MarketplaceLoading());
    try {
      final transaction = await _repository.createTransaction(event.body);
      emit(MarketplaceTransactionCreated(transaction));
    } catch (e) {
      emit(MarketplaceError(e.toString()));
    }
  }

  Future<void> _onUpdateTransaction(
    UpdateMarketplaceTransaction event,
    Emitter<MarketplaceState> emit,
  ) async {
    emit(MarketplaceLoading());
    try {
      final transaction = await _repository.updateTransaction(
        event.id,
        event.body,
      );
      emit(MarketplaceTransactionUpdated(transaction));
    } catch (e) {
      emit(MarketplaceError(e.toString()));
    }
  }
}
