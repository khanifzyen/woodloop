import '../entities/supplier_dashboard_data.dart';

abstract class SupplierRepository {
  Future<SupplierDashboardData> getDashboardData(
    String supplierId,
    String supplierName,
    String workshopName,
  );
}
