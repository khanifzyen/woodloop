part of 'pickup_bloc.dart';

abstract class PickupState extends Equatable {
  const PickupState();

  @override
  List<Object?> get props => [];
}

class PickupInitial extends PickupState {}

class PickupLoading extends PickupState {}

class PickupsLoaded extends PickupState {
  final List<Pickup> pickups;

  const PickupsLoaded(this.pickups);

  @override
  List<Object?> get props => [pickups];
}

class PickupDetailLoaded extends PickupState {
  final Pickup pickup;

  const PickupDetailLoaded(this.pickup);

  @override
  List<Object?> get props => [pickup];
}

class PickupCreated extends PickupState {
  final Pickup pickup;

  const PickupCreated(this.pickup);

  @override
  List<Object?> get props => [pickup];
}

class PickupUpdated extends PickupState {
  final Pickup pickup;

  const PickupUpdated(this.pickup);

  @override
  List<Object?> get props => [pickup];
}

class PickupDeleted extends PickupState {}

class PickupError extends PickupState {
  final String message;

  const PickupError(this.message);

  @override
  List<Object?> get props => [message];
}
