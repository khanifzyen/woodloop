import 'package:injectable/injectable.dart';

import '../../../auth/domain/entities/user.dart';
import '../../domain/repositories/user_profile_repository.dart';
import '../datasources/user_profile_remote_data_source.dart';

@LazySingleton(as: UserProfileRepository)
class UserProfileRepositoryImpl implements UserProfileRepository {
  final UserProfileRemoteDataSource remoteDataSource;

  UserProfileRepositoryImpl(this.remoteDataSource);

  @override
  Future<User> getUserProfile(String userId) {
    return remoteDataSource.getUserProfile(userId);
  }

  @override
  Future<User> updateUserProfile(String userId, Map<String, dynamic> data) {
    return remoteDataSource.updateUserProfile(userId, data);
  }
}
