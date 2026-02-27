import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/traceability_step.dart';
import '../../domain/repositories/traceability_repository.dart';

part 'traceability_event.dart';
part 'traceability_state.dart';

@injectable
class TraceabilityBloc extends Bloc<TraceabilityEvent, TraceabilityState> {
  final TraceabilityRepository _repository;

  TraceabilityBloc(this._repository) : super(TraceabilityInitial()) {
    on<LoadTraceability>(_onLoadTraceability);
  }

  Future<void> _onLoadTraceability(
    LoadTraceability event,
    Emitter<TraceabilityState> emit,
  ) async {
    emit(TraceabilityLoading());
    try {
      final data = await _repository.getTraceability(event.productId);
      emit(TraceabilityLoaded(data));
    } catch (e) {
      emit(TraceabilityError(e.toString()));
    }
  }
}
