import 'package:injectable/injectable.dart';
import '../../domain/entities/supplier_dashboard_data.dart';
import '../../domain/repositories/supplier_repository.dart';
import '../datasources/supplier_remote_data_source.dart';

@LazySingleton(as: SupplierRepository)
class SupplierRepositoryImpl implements SupplierRepository {
  final SupplierRemoteDataSource remoteDataSource;

  SupplierRepositoryImpl(this.remoteDataSource);

  @override
  Future<SupplierDashboardData> getDashboardData(
    String supplierId,
    String supplierName,
    String workshopName,
  ) async {
    return await remoteDataSource.getDashboardData(
      supplierId,
      supplierName,
      workshopName,
    );
  }
}
