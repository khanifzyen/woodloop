import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/auth/domain/entities/user.dart';
import 'package:woodloop_app/features/profile/domain/repositories/user_profile_repository.dart';
import 'package:woodloop_app/features/profile/presentation/bloc/user_profile_bloc.dart';

class MockUserProfileRepository extends Mock
    implements UserProfileRepository {}

void main() {
  late MockUserProfileRepository repository;

  const userId = 'user1';
  const sampleUser = User(
    id: userId,
    email: 'user@woodloop.id',
    name: 'Test User',
    role: 'generator',
    workshopName: 'Workshop Jati',
    address: 'Jepara',
    isVerified: true,
  );

  setUp(() {
    repository = MockUserProfileRepository();
  });

  group('UserProfileFetchRequested', () {
    blocTest<UserProfileBloc, UserProfileState>(
      'emits [UserProfileLoading, UserProfileLoaded] on success',
      build: () {
        when(() => repository.getUserProfile(userId))
            .thenAnswer((_) async => sampleUser);
        return UserProfileBloc(repository);
      },
      act: (bloc) => bloc.add(UserProfileFetchRequested(userId)),
      expect: () => [
        UserProfileLoading(),
        const UserProfileLoaded(sampleUser),
      ],
    );

    blocTest<UserProfileBloc, UserProfileState>(
      'emits [UserProfileLoading, UserProfileError] on failure',
      build: () {
        when(() => repository.getUserProfile(userId))
            .thenThrow(Exception('Profile not found'));
        return UserProfileBloc(repository);
      },
      act: (bloc) => bloc.add(UserProfileFetchRequested(userId)),
      expect: () => [
        UserProfileLoading(),
        isA<UserProfileError>(),
      ],
    );
  });

  group('UserProfileUpdateRequested', () {
    final updateData = <String, dynamic>{
      'name': 'Updated Name',
      'bio': 'New bio',
    };

    const updatedUser = User(
      id: userId,
      email: 'user@woodloop.id',
      name: 'Updated Name',
      role: 'generator',
      workshopName: 'Workshop Jati',
      address: 'Jepara',
      bio: 'New bio',
      isVerified: true,
    );

    blocTest<UserProfileBloc, UserProfileState>(
      'emits [UserProfileLoading, UserProfileUpdateSuccess, '
      'UserProfileLoaded] on success',
      build: () {
        when(() => repository.updateUserProfile(userId, updateData))
            .thenAnswer((_) async => updatedUser);
        return UserProfileBloc(repository);
      },
      act: (bloc) => bloc.add(
        UserProfileUpdateRequested(userId: userId, data: updateData),
      ),
      expect: () => [
        UserProfileLoading(),
        const UserProfileUpdateSuccess(updatedUser),
        const UserProfileLoaded(updatedUser),
      ],
    );

    blocTest<UserProfileBloc, UserProfileState>(
      'emits [UserProfileLoading, UserProfileError] on failure',
      build: () {
        when(() => repository.updateUserProfile(userId, updateData))
            .thenThrow(Exception('Update failed'));
        return UserProfileBloc(repository);
      },
      act: (bloc) => bloc.add(
        UserProfileUpdateRequested(userId: userId, data: updateData),
      ),
      expect: () => [
        UserProfileLoading(),
        isA<UserProfileError>(),
      ],
    );
  });
}
