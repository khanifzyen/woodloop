part of 'warehouse_bloc.dart';

abstract class WarehouseState extends Equatable {
  const WarehouseState();

  @override
  List<Object?> get props => [];
}

class WarehouseInitial extends WarehouseState {}

class WarehouseLoading extends WarehouseState {}

class WarehouseItemsLoaded extends WarehouseState {
  final List<WarehouseItem> items;

  const WarehouseItemsLoaded(this.items);

  @override
  List<Object?> get props => [items];
}

class WarehouseItemDetailLoaded extends WarehouseState {
  final WarehouseItem item;

  const WarehouseItemDetailLoaded(this.item);

  @override
  List<Object?> get props => [item];
}

class WarehouseItemUpdated extends WarehouseState {
  final WarehouseItem item;

  const WarehouseItemUpdated(this.item);

  @override
  List<Object?> get props => [item];
}

class WarehouseError extends WarehouseState {
  final String message;

  const WarehouseError(this.message);

  @override
  List<Object?> get props => [message];
}
