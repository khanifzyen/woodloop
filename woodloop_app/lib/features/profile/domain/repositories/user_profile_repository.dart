import '../../../auth/domain/entities/user.dart';

abstract class UserProfileRepository {
  Future<User> getUserProfile(String userId);
  Future<User> updateUserProfile(String userId, Map<String, dynamic> data);
}
