part of 'bid_bloc.dart';

abstract class BidEvent extends Equatable {
  const BidEvent();

  @override
  List<Object?> get props => [];
}

class LoadBids extends BidEvent {
  final String? bidderId;
  final String? wasteListingId;
  final String? status;

  const LoadBids({this.bidderId, this.wasteListingId, this.status});

  @override
  List<Object?> get props => [bidderId, wasteListingId, status];
}

class LoadBidDetail extends BidEvent {
  final String id;

  const LoadBidDetail(this.id);

  @override
  List<Object?> get props => [id];
}

class CreateBid extends BidEvent {
  final Map<String, dynamic> body;

  const CreateBid(this.body);

  @override
  List<Object?> get props => [body];
}

class UpdateBidStatus extends BidEvent {
  final String id;
  final Map<String, dynamic> body;

  const UpdateBidStatus({required this.id, required this.body});

  @override
  List<Object?> get props => [id, body];
}

class DeleteBid extends BidEvent {
  final String id;

  const DeleteBid(this.id);

  @override
  List<Object?> get props => [id];
}
