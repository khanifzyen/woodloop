part of 'warehouse_bloc.dart';

abstract class WarehouseEvent extends Equatable {
  const WarehouseEvent();

  @override
  List<Object?> get props => [];
}

class LoadWarehouseItems extends WarehouseEvent {
  final String? aggregatorId;
  final String? status;

  const LoadWarehouseItems({this.aggregatorId, this.status});

  @override
  List<Object?> get props => [aggregatorId, status];
}

class LoadWarehouseItemDetail extends WarehouseEvent {
  final String id;

  const LoadWarehouseItemDetail(this.id);

  @override
  List<Object?> get props => [id];
}

class UpdateWarehouseItem extends WarehouseEvent {
  final String id;
  final Map<String, dynamic> body;

  const UpdateWarehouseItem({required this.id, required this.body});

  @override
  List<Object?> get props => [id, body];
}
