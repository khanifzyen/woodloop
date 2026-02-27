part of 'pickup_bloc.dart';

abstract class PickupEvent extends Equatable {
  const PickupEvent();

  @override
  List<Object?> get props => [];
}

class LoadPickups extends PickupEvent {
  final String? aggregatorId;
  final String? status;

  const LoadPickups({this.aggregatorId, this.status});

  @override
  List<Object?> get props => [aggregatorId, status];
}

class LoadPickupDetail extends PickupEvent {
  final String id;

  const LoadPickupDetail(this.id);

  @override
  List<Object?> get props => [id];
}

class CreatePickup extends PickupEvent {
  final Map<String, dynamic> body;

  const CreatePickup(this.body);

  @override
  List<Object?> get props => [body];
}

class UpdatePickupStatus extends PickupEvent {
  final String id;
  final Map<String, dynamic> body;

  const UpdatePickupStatus({required this.id, required this.body});

  @override
  List<Object?> get props => [id, body];
}

class DeletePickup extends PickupEvent {
  final String id;

  const DeletePickup(this.id);

  @override
  List<Object?> get props => [id];
}
