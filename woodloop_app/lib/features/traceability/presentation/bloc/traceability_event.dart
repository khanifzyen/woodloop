part of 'traceability_bloc.dart';

abstract class TraceabilityEvent extends Equatable {
  const TraceabilityEvent();

  @override
  List<Object?> get props => [];
}

class LoadTraceability extends TraceabilityEvent {
  final String productId;

  const LoadTraceability(this.productId);

  @override
  List<Object?> get props => [productId];
}
