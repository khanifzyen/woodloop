part of 'supplier_dashboard_cubit.dart';

abstract class SupplierDashboardState extends Equatable {
  const SupplierDashboardState();

  @override
  List<Object?> get props => [];
}

class SupplierDashboardInitial extends SupplierDashboardState {}

class SupplierDashboardLoading extends SupplierDashboardState {}

class SupplierDashboardLoaded extends SupplierDashboardState {
  final SupplierDashboardData data;

  const SupplierDashboardLoaded(this.data);

  @override
  List<Object?> get props => [data];
}

class SupplierDashboardError extends SupplierDashboardState {
  final String message;

  const SupplierDashboardError(this.message);

  @override
  List<Object?> get props => [message];
}
