part of 'raw_timber_order_bloc.dart';

abstract class RawTimberOrderState extends Equatable {
  const RawTimberOrderState();
  @override List<Object?> get props => [];
}

class RawTimberOrderInitial extends RawTimberOrderState {}
class RawTimberOrderLoading extends RawTimberOrderState {}
class RawTimberOrdersLoaded extends RawTimberOrderState {
  final List<RawTimberOrder> orders;
  const RawTimberOrdersLoaded(this.orders);
  @override List<Object?> get props => [orders];
}
class RawTimberOrderCreated extends RawTimberOrderState {
  final RawTimberOrder order;
  const RawTimberOrderCreated(this.order);
  @override List<Object?> get props => [order];
}
class RawTimberOrderUpdated extends RawTimberOrderState {
  final RawTimberOrder order;
  const RawTimberOrderUpdated(this.order);
  @override List<Object?> get props => [order];
}
class RawTimberOrderError extends RawTimberOrderState {
  final String message;
  const RawTimberOrderError(this.message);
  @override List<Object?> get props => [message];
}
