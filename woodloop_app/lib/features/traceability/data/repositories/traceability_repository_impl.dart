import 'package:injectable/injectable.dart';
import '../../domain/entities/traceability_step.dart';
import '../../domain/repositories/traceability_repository.dart';
import '../datasources/traceability_remote_datasource.dart';

@LazySingleton(as: TraceabilityRepository)
class TraceabilityRepositoryImpl implements TraceabilityRepository {
  final TraceabilityRemoteDataSource _remoteDataSource;

  TraceabilityRepositoryImpl(this._remoteDataSource);

  @override
  Future<TraceabilityData> getTraceability(String productId) {
    return _remoteDataSource.getTraceability(productId);
  }
}
