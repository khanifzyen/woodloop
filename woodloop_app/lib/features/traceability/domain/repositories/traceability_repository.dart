import '../entities/traceability_step.dart';

abstract class TraceabilityRepository {
  Future<TraceabilityData> getTraceability(String productId);
}
