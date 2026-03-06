import 'package:equatable/equatable.dart';
import 'raw_timber_listing.dart';

class SupplierDashboardData extends Equatable {
  final String supplierName;
  final String workshopName;
  final double monthlyRevenue;
  final double totalStock; // sum volume of available listings (m³)
  final int activeListings; // count of available listings
  final List<RawTimberListing> recentSales; // last sold listings

  const SupplierDashboardData({
    required this.supplierName,
    required this.workshopName,
    required this.monthlyRevenue,
    required this.totalStock,
    required this.activeListings,
    required this.recentSales,
  });

  @override
  List<Object?> get props => [
    supplierName,
    workshopName,
    monthlyRevenue,
    totalStock,
    activeListings,
    recentSales,
  ];
}
