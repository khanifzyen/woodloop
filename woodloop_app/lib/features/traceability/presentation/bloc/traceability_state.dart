part of 'traceability_bloc.dart';

abstract class TraceabilityState extends Equatable {
  const TraceabilityState();

  @override
  List<Object?> get props => [];
}

class TraceabilityInitial extends TraceabilityState {}

class TraceabilityLoading extends TraceabilityState {}

class TraceabilityLoaded extends TraceabilityState {
  final TraceabilityData data;

  const TraceabilityLoaded(this.data);

  @override
  List<Object?> get props => [data];
}

class TraceabilityError extends TraceabilityState {
  final String message;

  const TraceabilityError(this.message);

  @override
  List<Object?> get props => [message];
}
