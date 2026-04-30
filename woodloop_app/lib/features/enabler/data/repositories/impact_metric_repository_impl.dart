import 'package:injectable/injectable.dart';

import '../../domain/entities/impact_metric.dart';
import '../../domain/repositories/impact_metric_repository.dart';
import '../datasources/impact_metric_remote_data_source.dart';

@LazySingleton(as: ImpactMetricRepository)
class ImpactMetricRepositoryImpl implements ImpactMetricRepository {
  final ImpactMetricRemoteDataSource remoteDataSource;

  ImpactMetricRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<ImpactMetric>> getImpactMetrics({
    String? period,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getImpactMetrics(
      period: period,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<ImpactMetric> getImpactMetricById(String id) async {
    return await remoteDataSource.getImpactMetricById(id);
  }
}
