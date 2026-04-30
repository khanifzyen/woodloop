import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/traceability/domain/entities/traceability_step.dart';
import 'package:woodloop_app/features/traceability/domain/repositories/traceability_repository.dart';
import 'package:woodloop_app/features/traceability/presentation/bloc/traceability_bloc.dart';

class MockTraceabilityRepository extends Mock
    implements TraceabilityRepository {}

void main() {
  late MockTraceabilityRepository repository;

  final now = DateTime(2026, 4, 28);
  const productId = 'prod1';
  final sampleData = TraceabilityData(
    productId: productId,
    productName: 'Kayu Jati',
    productCategory: 'Log',
    co2Saved: 50.5,
    wasteDiverted: 100.0,
    steps: [
      TraceabilityStep(
        role: 'supplier',
        entityName: 'PT Hutan Jati',
        title: 'Kayu Jati Dipanen',
        description: 'Panen kayu jati dari hutan lestari',
        date: now,
        location: 'Jepara',
        isVerified: true,
      ),
    ],
  );

  setUp(() {
    repository = MockTraceabilityRepository();
  });

  group('LoadTraceability', () {
    blocTest<TraceabilityBloc, TraceabilityState>(
      'emits [TraceabilityLoading, TraceabilityLoaded] on success',
      build: () {
        when(() => repository.getTraceability(productId))
            .thenAnswer((_) async => sampleData);
        return TraceabilityBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadTraceability(productId)),
      expect: () => [
        TraceabilityLoading(),
        TraceabilityLoaded(sampleData),
      ],
    );

    blocTest<TraceabilityBloc, TraceabilityState>(
      'emits [TraceabilityLoading, TraceabilityError] on failure',
      build: () {
        when(() => repository.getTraceability(productId))
            .thenThrow(Exception('Traceability data not found'));
        return TraceabilityBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadTraceability(productId)),
      expect: () => [
        TraceabilityLoading(),
        isA<TraceabilityError>(),
      ],
    );
  });
}
