import '../entities/impact_metric.dart';

abstract class ImpactMetricRepository {
  Future<List<ImpactMetric>> getImpactMetrics({
    String? period,
    int page = 1,
    int perPage = 30,
  });

  Future<ImpactMetric> getImpactMetricById(String id);
}
