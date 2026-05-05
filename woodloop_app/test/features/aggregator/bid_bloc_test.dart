import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/aggregator/domain/entities/bid.dart';
import 'package:woodloop_app/features/aggregator/domain/repositories/bid_repository.dart';
import 'package:woodloop_app/features/aggregator/presentation/bloc/bid_bloc.dart';

class MockBidRepository extends Mock implements BidRepository {}

void main() {
  late MockBidRepository repository;

  final now = DateTime(2026, 5, 1);
  const bidId = 'bid1';

  final sampleBid = Bid(
    id: bidId,
    bidderId: 'agg1',
    wasteListingId: 'wl1',
    bidAmount: 450000,
    message: 'Siap jemput besok',
    status: 'pending',
    created: now,
    updated: now,
  );

  final sampleBids = [sampleBid];

  setUp(() {
    repository = MockBidRepository();
  });

  group('LoadBids', () {
    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidsLoaded] on success',
      build: () {
        when(() => repository.getBids(
              bidderId: any(named: 'bidderId'),
              wasteListingId: any(named: 'wasteListingId'),
              status: any(named: 'status'),
            )).thenAnswer((_) async => sampleBids);
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(
        const LoadBids(bidderId: 'agg1', status: 'pending'),
      ),
      expect: () => [BidLoading(), BidsLoaded(sampleBids)],
    );

    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidError] on failure',
      build: () {
        when(() => repository.getBids(
              bidderId: any(named: 'bidderId'),
              wasteListingId: any(named: 'wasteListingId'),
              status: any(named: 'status'),
            )).thenThrow(Exception('Network error'));
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadBids()),
      expect: () => [BidLoading(), isA<BidError>()],
    );

    blocTest<BidBloc, BidState>(
      'filters by wasteListingId when provided',
      build: () {
        when(() => repository.getBids(
              bidderId: any(named: 'bidderId'),
              wasteListingId: 'wl1',
              status: any(named: 'status'),
            )).thenAnswer((_) async => sampleBids);
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(
        const LoadBids(wasteListingId: 'wl1'),
      ),
      expect: () => [BidLoading(), BidsLoaded(sampleBids)],
    );
  });

  group('LoadBidDetail', () {
    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidDetailLoaded] on success',
      build: () {
        when(() => repository.getBidById(bidId))
            .thenAnswer((_) async => sampleBid);
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadBidDetail(bidId)),
      expect: () => [BidLoading(), BidDetailLoaded(sampleBid)],
    );

    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidError] on failure',
      build: () {
        when(() => repository.getBidById(bidId))
            .thenThrow(Exception('Not found'));
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadBidDetail(bidId)),
      expect: () => [BidLoading(), isA<BidError>()],
    );
  });

  group('CreateBid', () {
    final body = <String, dynamic>{
      'bidder': 'agg1',
      'waste_listing': 'wl1',
      'bid_amount': 450000,
      'message': 'Siap jemput besok',
    };

    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidCreated] on success',
      build: () {
        when(() => repository.createBid(body))
            .thenAnswer((_) async => sampleBid);
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(CreateBid(body)),
      expect: () => [BidLoading(), BidCreated(sampleBid)],
    );

    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidError] on failure',
      build: () {
        when(() => repository.createBid(body))
            .thenThrow(Exception('Validation error'));
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(CreateBid(body)),
      expect: () => [BidLoading(), isA<BidError>()],
    );
  });

  group('UpdateBidStatus', () {
    final body = <String, dynamic>{'status': 'accepted'};

    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidUpdated] when bid accepted',
      build: () {
        when(() => repository.updateBid(bidId, body)).thenAnswer(
            (_) async => sampleBid.copyWith(status: 'accepted'));
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(
        UpdateBidStatus(id: bidId, body: body),
      ),
      expect: () => [
        BidLoading(),
        BidUpdated(sampleBid.copyWith(status: 'accepted')),
      ],
    );

    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidError] on failure',
      build: () {
        when(() => repository.updateBid(bidId, body))
            .thenThrow(Exception('Update failed'));
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(
        UpdateBidStatus(id: bidId, body: body),
      ),
      expect: () => [BidLoading(), isA<BidError>()],
    );
  });

  group('DeleteBid', () {
    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidDeleted] on success',
      build: () {
        when(() => repository.deleteBid(bidId))
            .thenAnswer((_) async {});
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(const DeleteBid(bidId)),
      expect: () => [BidLoading(), BidDeleted()],
    );

    blocTest<BidBloc, BidState>(
      'emits [BidLoading, BidError] on failure',
      build: () {
        when(() => repository.deleteBid(bidId))
            .thenThrow(Exception('Delete failed'));
        return BidBloc(repository);
      },
      act: (bloc) => bloc.add(const DeleteBid(bidId)),
      expect: () => [BidLoading(), isA<BidError>()],
    );
  });
}

// Helper extension for creating modified copies in tests
extension _BidCopyWith on Bid {
  Bid copyWith({String? status}) {
    return Bid(
      id: id,
      bidderId: bidderId,
      wasteListingId: wasteListingId,
      bidAmount: bidAmount,
      message: message,
      status: status ?? this.status,
      created: created,
      updated: updated,
    );
  }
}
