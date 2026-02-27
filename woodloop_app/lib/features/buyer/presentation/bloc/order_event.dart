part of 'order_bloc.dart';

abstract class OrderEvent extends Equatable {
  const OrderEvent();

  @override
  List<Object?> get props => [];
}

class LoadOrders extends OrderEvent {
  final String? buyerId;
  final String? status;

  const LoadOrders({this.buyerId, this.status});

  @override
  List<Object?> get props => [buyerId, status];
}

class LoadOrderDetail extends OrderEvent {
  final String id;

  const LoadOrderDetail(this.id);

  @override
  List<Object?> get props => [id];
}

class CreateOrder extends OrderEvent {
  final Map<String, dynamic> body;

  const CreateOrder(this.body);

  @override
  List<Object?> get props => [body];
}

class UpdateOrderStatus extends OrderEvent {
  final String id;
  final Map<String, dynamic> body;

  const UpdateOrderStatus({required this.id, required this.body});

  @override
  List<Object?> get props => [id, body];
}
