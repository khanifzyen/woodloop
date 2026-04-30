import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/supplier/domain/entities/raw_timber_listing.dart';
import 'package:woodloop_app/features/supplier/domain/entities/supplier_dashboard_data.dart';
import 'package:woodloop_app/features/supplier/domain/repositories/supplier_repository.dart';
import 'package:woodloop_app/features/supplier/presentation/bloc/supplier_dashboard_cubit.dart';
import 'package:woodloop_app/features/supplier/presentation/bloc/supplier_inventory_cubit.dart';
import 'package:woodloop_app/features/supplier/presentation/bloc/wood_types_cubit.dart';

class MockSupplierRepository extends Mock implements SupplierRepository {}

void main() {
  late MockSupplierRepository repository;
  final now = DateTime(2026, 4, 28);

  setUp(() {
    repository = MockSupplierRepository();
  });

  group('SupplierDashboardCubit', () {
    const supplierId = 'sup1';
    const supplierName = 'UD Jati Makmur';
    const workshopName = 'Workshop Jepara';

    final dashboardData = SupplierDashboardData(
      supplierName: supplierName,
      workshopName: workshopName,
      monthlyRevenue: 25000000,
      totalStock: 15.5,
      activeListings: 8,
      recentSales: [],
    );

    blocTest<SupplierDashboardCubit, SupplierDashboardState>(
      'emits [SupplierDashboardLoading, SupplierDashboardLoaded] on success',
      build: () {
        when(() => repository.getDashboardData(
              supplierId,
              supplierName,
              workshopName,
            )).thenAnswer((_) async => dashboardData);
        return SupplierDashboardCubit(repository);
      },
      act: (cubit) => cubit.load(supplierId, supplierName, workshopName),
      expect: () => [
        SupplierDashboardLoading(),
        SupplierDashboardLoaded(dashboardData),
      ],
    );

    blocTest<SupplierDashboardCubit, SupplierDashboardState>(
      'emits [SupplierDashboardLoading, SupplierDashboardError] on failure',
      build: () {
        when(() => repository.getDashboardData(
              supplierId,
              supplierName,
              workshopName,
            )).thenThrow(Exception('Network error'));
        return SupplierDashboardCubit(repository);
      },
      act: (cubit) => cubit.load(supplierId, supplierName, workshopName),
      expect: () => [
        SupplierDashboardLoading(),
        isA<SupplierDashboardError>(),
      ],
    );

    test('initial state is SupplierDashboardInitial', () {
      expect(SupplierDashboardCubit(repository).state, SupplierDashboardInitial());
    });
  });

  group('SupplierInventoryCubit', () {
    const supplierId = 'sup1';

    final listingA = RawTimberListing(
      id: 'rt1', supplierId: supplierId, woodTypeId: 'wt1',
      woodTypeName: 'Jati', shape: 'log', volume: 2.0, price: 5000000,
      unit: 'm3', status: 'available', updatedAt: now,
    );

    final listingB = RawTimberListing(
      id: 'rt2', supplierId: supplierId, woodTypeId: 'wt2',
      woodTypeName: 'Mahoni', shape: 'sawn', volume: 1.0, price: 2000000,
      unit: 'm3', status: 'sold', updatedAt: now,
    );

    final allListings = [listingA, listingB];
    final availableOnly = [listingA];

    blocTest<SupplierInventoryCubit, SupplierInventoryState>(
      'emits [SupplierInventoryLoading, SupplierInventoryLoaded] on load success',
      build: () {
        when(() => repository.getListingsBySupplier(supplierId))
            .thenAnswer((_) async => allListings);
        return SupplierInventoryCubit(repository);
      },
      act: (cubit) => cubit.loadInventory(supplierId),
      expect: () => [
        SupplierInventoryLoading(),
        SupplierInventoryLoaded(
          allListings: allListings,
          filteredListings: allListings,
          activeFilter: 'all',
        ),
      ],
    );

    blocTest<SupplierInventoryCubit, SupplierInventoryState>(
      'emits [SupplierInventoryLoading, SupplierInventoryError] on load failure',
      build: () {
        when(() => repository.getListingsBySupplier(supplierId))
            .thenThrow(Exception('DB error'));
        return SupplierInventoryCubit(repository);
      },
      act: (cubit) => cubit.loadInventory(supplierId),
      expect: () => [
        SupplierInventoryLoading(),
        isA<SupplierInventoryError>(),
      ],
    );

    blocTest<SupplierInventoryCubit, SupplierInventoryState>(
      'applyFilter filters listings by status',
      build: () {
        when(() => repository.getListingsBySupplier(supplierId))
            .thenAnswer((_) async => allListings);
        return SupplierInventoryCubit(repository);
      },
      act: (cubit) async {
        await cubit.loadInventory(supplierId);
        cubit.applyFilter('available');
      },
      expect: () => [
        SupplierInventoryLoading(),
        SupplierInventoryLoaded(
          allListings: allListings,
          filteredListings: allListings,
          activeFilter: 'all',
        ),
        SupplierInventoryLoaded(
          allListings: allListings,
          filteredListings: availableOnly,
          activeFilter: 'available',
        ),
      ],
    );

    blocTest<SupplierInventoryCubit, SupplierInventoryState>(
      'applyFilter resets filter with "all"',
      build: () {
        when(() => repository.getListingsBySupplier(supplierId))
            .thenAnswer((_) async => allListings);
        return SupplierInventoryCubit(repository);
      },
      seed: () => SupplierInventoryLoaded(
        allListings: allListings,
        filteredListings: availableOnly,
        activeFilter: 'available',
      ),
      act: (cubit) => cubit.applyFilter('all'),
      expect: () => [
        SupplierInventoryLoaded(
          allListings: allListings,
          filteredListings: allListings,
          activeFilter: 'all',
        ),
      ],
    );

    blocTest<SupplierInventoryCubit, SupplierInventoryState>(
      'deleteListing reloads inventory after successful delete',
      build: () {
        when(() => repository.getListingsBySupplier(supplierId))
            .thenAnswer((_) async => allListings);
        when(() => repository.deleteListing('rt1'))
            .thenAnswer((_) async {});
        return SupplierInventoryCubit(repository);
      },
      act: (cubit) async {
        await cubit.loadInventory(supplierId);
        await cubit.deleteListing('rt1');
      },
      expect: () => [
        SupplierInventoryLoading(),
        SupplierInventoryLoaded(
          allListings: allListings,
          filteredListings: allListings,
          activeFilter: 'all',
        ),
        SupplierInventoryLoaded(
          allListings: allListings,
          filteredListings: allListings,
          activeFilter: 'all',
          isDeleting: true,
        ),
        SupplierInventoryLoaded(
          allListings: allListings,
          filteredListings: allListings,
          activeFilter: 'all',
          isDeleting: false,
        ),
      ],
    );

    blocTest<SupplierInventoryCubit, SupplierInventoryState>(
      'deleteListing reverts isDeleting on failure',
      build: () {
        when(() => repository.getListingsBySupplier(supplierId))
            .thenAnswer((_) async => allListings);
        when(() => repository.deleteListing('rt1'))
            .thenThrow(Exception('Cannot delete'));
        return SupplierInventoryCubit(repository);
      },
      seed: () => SupplierInventoryLoaded(
        allListings: allListings,
        filteredListings: allListings,
        activeFilter: 'all',
      ),
      act: (cubit) => cubit.deleteListing('rt1'),
      expect: () => [
        SupplierInventoryLoaded(
          allListings: allListings,
          filteredListings: allListings,
          activeFilter: 'all',
          isDeleting: true,
        ),
        SupplierInventoryLoaded(
          allListings: allListings,
          filteredListings: allListings,
          activeFilter: 'all',
          isDeleting: false,
        ),
      ],
    );

    test('initial state is SupplierInventoryInitial', () {
      expect(SupplierInventoryCubit(repository).state, SupplierInventoryInitial());
    });
  });

  group('WoodTypesCubit', () {
    final woodTypes = [
      {'id': 'wt1', 'name': 'Jati', 'carbon_factor': 1.5},
      {'id': 'wt2', 'name': 'Mahoni', 'carbon_factor': 1.4},
      {'id': 'wt3', 'name': 'Trembesi', 'carbon_factor': 1.2},
    ];

    blocTest<WoodTypesCubit, WoodTypesState>(
      'emits [WoodTypesLoading, WoodTypesLoaded] on first load',
      build: () {
        when(() => repository.getWoodTypes())
            .thenAnswer((_) async => woodTypes);
        return WoodTypesCubit(repository);
      },
      act: (cubit) => cubit.loadWoodTypes(),
      expect: () => [
        isA<WoodTypesLoading>(),
        isA<WoodTypesLoaded>(),
      ],
    );

    blocTest<WoodTypesCubit, WoodTypesState>(
      'emits [WoodTypesLoaded] directly on reload (skip loading)',
      build: () {
        when(() => repository.getWoodTypes())
            .thenAnswer((_) async => woodTypes);
        return WoodTypesCubit(repository);
      },
      seed: () => WoodTypesLoaded(woodTypes),
      act: (cubit) => cubit.loadWoodTypes(),
      expect: () => [
        isA<WoodTypesLoaded>(),
      ],
    );

    blocTest<WoodTypesCubit, WoodTypesState>(
      'emits [WoodTypesLoading, WoodTypesError] on failure',
      build: () {
        when(() => repository.getWoodTypes())
            .thenThrow(Exception('Network error'));
        return WoodTypesCubit(repository);
      },
      act: (cubit) => cubit.loadWoodTypes(),
      expect: () => [
        isA<WoodTypesLoading>(),
        isA<WoodTypesError>(),
      ],
    );

    test('initial state is WoodTypesInitial', () {
      expect(WoodTypesCubit(repository).state, isA<WoodTypesInitial>());
    });
  });
}
