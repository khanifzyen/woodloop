import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/auth/domain/entities/user.dart';
import 'package:woodloop_app/features/auth/domain/entities/user_document.dart';
import 'package:woodloop_app/features/auth/domain/repositories/auth_repository.dart';
import 'package:woodloop_app/features/shared/presentation/bloc/profile_cubit.dart';
import 'package:woodloop_app/features/shared/presentation/bloc/profile_state.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late MockAuthRepository repository;

  const userId = 'user1';
  final now = DateTime(2026, 4, 28);

  final sampleDocuments = [
    const UserDocument(
      id: 'doc1',
      userId: userId,
      docType: 'ktp',
      docName: 'KTP',
      file: 'ktp.pdf',
      verified: true,
    ),
    const UserDocument(
      id: 'doc2',
      userId: userId,
      docType: 'nib',
      docName: 'NIB',
      file: 'nib.pdf',
      verified: false,
    ),
  ];

  setUp(() {
    repository = MockAuthRepository();
  });

  group('loadProfile', () {
    blocTest<ProfileCubit, ProfileState>(
      'emits [ProfileLoading, ProfileLoaded] on success',
      build: () {
        when(() => repository.fetchUserDocuments(userId))
            .thenAnswer((_) async => sampleDocuments);
        return ProfileCubit(repository);
      },
      act: (cubit) => cubit.loadProfile(userId),
      expect: () => [
        ProfileLoading(),
        ProfileLoaded(sampleDocuments),
      ],
    );

    blocTest<ProfileCubit, ProfileState>(
      'emits [ProfileLoading, ProfileError] on failure',
      build: () {
        when(() => repository.fetchUserDocuments(userId))
            .thenThrow(Exception('Failed to load documents'));
        return ProfileCubit(repository);
      },
      act: (cubit) => cubit.loadProfile(userId),
      expect: () => [
        ProfileLoading(),
        isA<ProfileError>(),
      ],
    );
  });

  group('updateAvatar', () {
    const filePath = '/path/to/avatar.jpg';

    blocTest<ProfileCubit, ProfileState>(
      'emits [ProfileLoading, ProfileLoaded, ProfileUpdateSuccess] on success',
      build: () {
        when(
          () => repository.updateProfileAvatar(userId, filePath),
        ).thenAnswer((_) async => const User(
              id: userId,
              email: 'user@woodloop.id',
              name: 'Test User',
              role: 'generator',
            ));
        when(() => repository.fetchUserDocuments(userId))
            .thenAnswer((_) async => sampleDocuments);
        return ProfileCubit(repository);
      },
      act: (cubit) => cubit.updateAvatar(userId, filePath),
      expect: () => [
        ProfileLoading(),
        ProfileLoaded(sampleDocuments),
        ProfileUpdateSuccess(),
      ],
    );

    blocTest<ProfileCubit, ProfileState>(
      'emits [ProfileLoading, ProfileError] when updateProfileAvatar fails',
      build: () {
        when(
          () => repository.updateProfileAvatar(userId, filePath),
        ).thenThrow(Exception('Upload failed'));
        return ProfileCubit(repository);
      },
      act: (cubit) => cubit.updateAvatar(userId, filePath),
      expect: () => [
        ProfileLoading(),
        isA<ProfileError>(),
      ],
    );

    blocTest<ProfileCubit, ProfileState>(
      'emits [ProfileLoading, ProfileError] when fetchUserDocuments fails '
      'after avatar update',
      build: () {
        when(
          () => repository.updateProfileAvatar(userId, filePath),
        ).thenAnswer((_) async => const User(
              id: userId,
              email: 'user@woodloop.id',
              name: 'Test User',
              role: 'generator',
            ));
        when(() => repository.fetchUserDocuments(userId))
            .thenThrow(Exception('Reload failed'));
        return ProfileCubit(repository);
      },
      act: (cubit) => cubit.updateAvatar(userId, filePath),
      expect: () => [
        ProfileLoading(),
        isA<ProfileError>(),
      ],
    );
  });
}
