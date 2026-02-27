part of 'wallet_bloc.dart';

abstract class WalletEvent extends Equatable {
  const WalletEvent();

  @override
  List<Object?> get props => [];
}

class LoadWallet extends WalletEvent {
  final String userId;

  const LoadWallet(this.userId);

  @override
  List<Object?> get props => [userId];
}

class RefreshWalletBalance extends WalletEvent {
  final String userId;

  const RefreshWalletBalance(this.userId);

  @override
  List<Object?> get props => [userId];
}
