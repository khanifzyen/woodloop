part of 'marketplace_bloc.dart';

abstract class MarketplaceEvent extends Equatable {
  const MarketplaceEvent();

  @override
  List<Object?> get props => [];
}

class LoadMarketplaceTransactions extends MarketplaceEvent {
  final String? buyerId;
  final String? sellerId;
  final String? status;

  const LoadMarketplaceTransactions({this.buyerId, this.sellerId, this.status});

  @override
  List<Object?> get props => [buyerId, sellerId, status];
}

class LoadMarketplaceTransactionDetail extends MarketplaceEvent {
  final String id;

  const LoadMarketplaceTransactionDetail(this.id);

  @override
  List<Object?> get props => [id];
}

class CreateMarketplaceTransaction extends MarketplaceEvent {
  final Map<String, dynamic> body;

  const CreateMarketplaceTransaction(this.body);

  @override
  List<Object?> get props => [body];
}

class UpdateMarketplaceTransaction extends MarketplaceEvent {
  final String id;
  final Map<String, dynamic> body;

  const UpdateMarketplaceTransaction({required this.id, required this.body});

  @override
  List<Object?> get props => [id, body];
}
