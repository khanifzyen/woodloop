import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/wallet_transaction.dart';
import '../../domain/repositories/wallet_repository.dart';

part 'wallet_event.dart';
part 'wallet_state.dart';

@injectable
class WalletBloc extends Bloc<WalletEvent, WalletState> {
  final WalletRepository _repository;

  WalletBloc(this._repository) : super(WalletInitial()) {
    on<LoadWallet>(_onLoadWallet);
    on<RefreshWalletBalance>(_onRefreshBalance);
  }

  Future<void> _onLoadWallet(
    LoadWallet event,
    Emitter<WalletState> emit,
  ) async {
    emit(WalletLoading());
    try {
      final results = await Future.wait([
        _repository.getBalance(event.userId),
        _repository.getTransactions(userId: event.userId),
      ]);

      final balance = results[0] as double;
      final transactions = results[1] as List<WalletTransaction>;

      emit(WalletLoaded(balance: balance, transactions: transactions));
    } catch (e) {
      emit(WalletError(e.toString()));
    }
  }

  Future<void> _onRefreshBalance(
    RefreshWalletBalance event,
    Emitter<WalletState> emit,
  ) async {
    // Keep existing transactions if available, just refresh balance
    final currentState = state;
    try {
      final balance = await _repository.getBalance(event.userId);
      if (currentState is WalletLoaded) {
        emit(
          WalletLoaded(
            balance: balance,
            transactions: currentState.transactions,
          ),
        );
      } else {
        final transactions = await _repository.getTransactions(
          userId: event.userId,
        );
        emit(WalletLoaded(balance: balance, transactions: transactions));
      }
    } catch (e) {
      emit(WalletError(e.toString()));
    }
  }
}
