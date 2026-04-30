import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/generator/domain/entities/waste_listing.dart';
import 'package:woodloop_app/features/generator/domain/repositories/waste_listing_repository.dart';
import 'package:woodloop_app/features/generator/presentation/bloc/waste_listing_bloc.dart';

class MockWasteListingRepository extends Mock
    implements WasteListingRepository {}

void main() {
  late MockWasteListingRepository repository;

  final now = DateTime(2026, 4, 28);
  const listingId = 'wl1';
  final sampleListing = WasteListing(
    id: listingId,
    generatorId: 'gen1',
    woodTypeId: 'wt1',
    woodTypeName: 'Jati',
    form: 'offcut_large',
    condition: 'dry',
    volume: 50,
    unit: 'kg',
    photos: ['photo1.jpg'],
    priceEstimate: 50000,
    status: 'available',
    description: 'Sisa produksi',
    created: now,
    updated: now,
  );

  final sampleListings = [sampleListing];

  setUp(() {
    repository = MockWasteListingRepository();
  });

  group('LoadWasteListings', () {
    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingsLoaded] on success',
      build: () {
        when(
          () => repository.getWasteListings(
            generatorId: any(named: 'generatorId'),
            status: any(named: 'status'),
          ),
        ).thenAnswer((_) async => sampleListings);
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(
        const LoadWasteListings(generatorId: 'gen1', status: 'available'),
      ),
      expect: () => [
        WasteListingLoading(),
        WasteListingsLoaded(sampleListings),
      ],
    );

    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingError] on failure',
      build: () {
        when(
          () => repository.getWasteListings(
            generatorId: any(named: 'generatorId'),
            status: any(named: 'status'),
          ),
        ).thenThrow(Exception('Network error'));
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(
        const LoadWasteListings(generatorId: 'gen1'),
      ),
      expect: () => [
        WasteListingLoading(),
        isA<WasteListingError>(),
      ],
    );
  });

  group('LoadWasteListingDetail', () {
    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingDetailLoaded] on success',
      build: () {
        when(() => repository.getWasteListingById(listingId))
            .thenAnswer((_) async => sampleListing);
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(LoadWasteListingDetail(listingId)),
      expect: () => [
        WasteListingLoading(),
        WasteListingDetailLoaded(sampleListing),
      ],
    );

    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingError] on failure',
      build: () {
        when(() => repository.getWasteListingById(listingId))
            .thenThrow(Exception('Not found'));
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(LoadWasteListingDetail(listingId)),
      expect: () => [
        WasteListingLoading(),
        isA<WasteListingError>(),
      ],
    );
  });

  group('CreateWasteListing', () {
    final body = <String, dynamic>{
      'generatorId': 'gen1',
      'form': 'offcut_large',
      'condition': 'dry',
      'volume': 50,
      'unit': 'kg',
      'status': 'available',
    };

    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingCreated] on success',
      build: () {
        when(() => repository.createWasteListing(body))
            .thenAnswer((_) async => sampleListing);
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(CreateWasteListing(body)),
      expect: () => [
        WasteListingLoading(),
        WasteListingCreated(sampleListing),
      ],
    );

    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingError] on failure',
      build: () {
        when(() => repository.createWasteListing(body))
            .thenThrow(Exception('Validation error'));
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(CreateWasteListing(body)),
      expect: () => [
        WasteListingLoading(),
        isA<WasteListingError>(),
      ],
    );
  });

  group('UpdateWasteListing', () {
    final body = <String, dynamic>{'status': 'sold'};

    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingUpdated] on success',
      build: () {
        when(() => repository.updateWasteListing(listingId, body))
            .thenAnswer((_) async => sampleListing);
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(
        UpdateWasteListing(id: listingId, body: body),
      ),
      expect: () => [
        WasteListingLoading(),
        WasteListingUpdated(sampleListing),
      ],
    );

    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingError] on failure',
      build: () {
        when(() => repository.updateWasteListing(listingId, body))
            .thenThrow(Exception('Update failed'));
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(
        UpdateWasteListing(id: listingId, body: body),
      ),
      expect: () => [
        WasteListingLoading(),
        isA<WasteListingError>(),
      ],
    );
  });

  group('DeleteWasteListing', () {
    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingDeleted] on success',
      build: () {
        when(() => repository.deleteWasteListing(listingId))
            .thenAnswer((_) async {});
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(DeleteWasteListing(listingId)),
      expect: () => [
        WasteListingLoading(),
        WasteListingDeleted(),
      ],
    );

    blocTest<WasteListingBloc, WasteListingState>(
      'emits [WasteListingLoading, WasteListingError] on failure',
      build: () {
        when(() => repository.deleteWasteListing(listingId))
            .thenThrow(Exception('Delete failed'));
        return WasteListingBloc(repository);
      },
      act: (bloc) => bloc.add(DeleteWasteListing(listingId)),
      expect: () => [
        WasteListingLoading(),
        isA<WasteListingError>(),
      ],
    );
  });
}
