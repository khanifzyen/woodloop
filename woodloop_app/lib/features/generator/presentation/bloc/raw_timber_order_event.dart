part of 'raw_timber_order_bloc.dart';

abstract class RawTimberOrderEvent extends Equatable {
  const RawTimberOrderEvent();
  @override List<Object?> get props => [];
}

class LoadRawTimberOrders extends RawTimberOrderEvent {
  final String? buyerId, sellerId, status;
  const LoadRawTimberOrders({this.buyerId, this.sellerId, this.status});
  @override List<Object?> get props => [buyerId, sellerId, status];
}

class CreateRawTimberOrder extends RawTimberOrderEvent {
  final Map<String, dynamic> body;
  const CreateRawTimberOrder(this.body);
  @override List<Object?> get props => [body];
}

class UpdateRawTimberOrderStatus extends RawTimberOrderEvent {
  final String id;
  final Map<String, dynamic> body;
  const UpdateRawTimberOrderStatus({required this.id, required this.body});
  @override List<Object?> get props => [id, body];
}
