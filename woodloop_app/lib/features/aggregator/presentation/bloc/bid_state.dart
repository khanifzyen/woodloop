part of 'bid_bloc.dart';

abstract class BidState extends Equatable {
  const BidState();

  @override
  List<Object?> get props => [];
}

class BidInitial extends BidState {}

class BidLoading extends BidState {}

class BidsLoaded extends BidState {
  final List<Bid> bids;

  const BidsLoaded(this.bids);

  @override
  List<Object?> get props => [bids];
}

class BidDetailLoaded extends BidState {
  final Bid bid;

  const BidDetailLoaded(this.bid);

  @override
  List<Object?> get props => [bid];
}

class BidCreated extends BidState {
  final Bid bid;

  const BidCreated(this.bid);

  @override
  List<Object?> get props => [bid];
}

class BidUpdated extends BidState {
  final Bid bid;

  const BidUpdated(this.bid);

  @override
  List<Object?> get props => [bid];
}

class BidDeleted extends BidState {}

class BidError extends BidState {
  final String message;

  const BidError(this.message);

  @override
  List<Object?> get props => [message];
}
