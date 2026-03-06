import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/supplier_dashboard_data.dart';
import '../../domain/repositories/supplier_repository.dart';

part 'supplier_dashboard_state.dart';

@injectable
class SupplierDashboardCubit extends Cubit<SupplierDashboardState> {
  final SupplierRepository _repository;

  SupplierDashboardCubit(this._repository) : super(SupplierDashboardInitial());

  Future<void> load(
    String supplierId,
    String supplierName,
    String workshopName,
  ) async {
    emit(SupplierDashboardLoading());
    try {
      final data = await _repository.getDashboardData(
        supplierId,
        supplierName,
        workshopName,
      );
      emit(SupplierDashboardLoaded(data));
    } catch (e) {
      emit(SupplierDashboardError(e.toString()));
    }
  }
}
