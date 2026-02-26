import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../../../auth/data/models/user_model.dart';
import '../../../auth/domain/entities/user.dart';

abstract class UserProfileRemoteDataSource {
  Future<User> getUserProfile(String userId);
  Future<User> updateUserProfile(String userId, Map<String, dynamic> data);
}

@LazySingleton(as: UserProfileRemoteDataSource)
class UserProfileRemoteDataSourceImpl implements UserProfileRemoteDataSource {
  final PocketBase pb;

  UserProfileRemoteDataSourceImpl(this.pb);

  @override
  Future<User> getUserProfile(String userId) async {
    final record = await pb.collection('users').getOne(userId);
    return UserModel.fromRecord(record);
  }

  @override
  Future<User> updateUserProfile(
    String userId,
    Map<String, dynamic> data,
  ) async {
    final record = await pb.collection('users').update(userId, body: data);
    return UserModel.fromRecord(record);
  }
}
