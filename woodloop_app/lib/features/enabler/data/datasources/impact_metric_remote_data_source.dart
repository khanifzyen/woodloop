import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/impact_metric_model.dart';

abstract class ImpactMetricRemoteDataSource {
  Future<List<ImpactMetricModel>> getImpactMetrics({
    String? period,
    int page = 1,
    int perPage = 30,
  });

  Future<ImpactMetricModel> getImpactMetricById(String id);
}

@LazySingleton(as: ImpactMetricRemoteDataSource)
class ImpactMetricRemoteDataSourceImpl implements ImpactMetricRemoteDataSource {
  final PocketBase pb;

  ImpactMetricRemoteDataSourceImpl(this.pb);

  @override
  Future<List<ImpactMetricModel>> getImpactMetrics({
    String? period,
    int page = 1,
    int perPage = 30,
  }) async {
    final filters = <String>[];
    if (period != null && period.isNotEmpty) {
      filters.add('period = "$period"');
    }

    final result = await pb.collection('impact_metrics').getList(
          page: page,
          perPage: perPage,
          filter: filters.isNotEmpty ? filters.join(' && ') : '',
          sort: '-created',
        );

    return result.items
        .map((record) => ImpactMetricModel.fromRecord(record))
        .toList();
  }

  @override
  Future<ImpactMetricModel> getImpactMetricById(String id) async {
    final record = await pb.collection('impact_metrics').getOne(id);
    return ImpactMetricModel.fromRecord(record);
  }
}
