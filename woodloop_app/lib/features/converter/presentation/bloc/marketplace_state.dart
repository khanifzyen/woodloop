part of 'marketplace_bloc.dart';

abstract class MarketplaceState extends Equatable {
  const MarketplaceState();

  @override
  List<Object?> get props => [];
}

class MarketplaceInitial extends MarketplaceState {}

class MarketplaceLoading extends MarketplaceState {}

class MarketplaceTransactionsLoaded extends MarketplaceState {
  final List<MarketplaceTransaction> transactions;

  const MarketplaceTransactionsLoaded(this.transactions);

  @override
  List<Object?> get props => [transactions];
}

class MarketplaceTransactionDetailLoaded extends MarketplaceState {
  final MarketplaceTransaction transaction;

  const MarketplaceTransactionDetailLoaded(this.transaction);

  @override
  List<Object?> get props => [transaction];
}

class MarketplaceTransactionCreated extends MarketplaceState {
  final MarketplaceTransaction transaction;

  const MarketplaceTransactionCreated(this.transaction);

  @override
  List<Object?> get props => [transaction];
}

class MarketplaceTransactionUpdated extends MarketplaceState {
  final MarketplaceTransaction transaction;

  const MarketplaceTransactionUpdated(this.transaction);

  @override
  List<Object?> get props => [transaction];
}

class MarketplaceError extends MarketplaceState {
  final String message;

  const MarketplaceError(this.message);

  @override
  List<Object?> get props => [message];
}
