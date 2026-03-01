import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> loginWithEmailAndPassword(String email, String password);
  Future<UserModel> register(Map<String, dynamic> body);
  Future<void> logout();
  Future<UserModel?> getCurrentUser();
  Future<bool> checkUniqueness(String field, String value);
  Stream<AuthStoreEvent> get authStateChanges;
}

@LazySingleton(as: AuthRemoteDataSource)
class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final PocketBase pb;

  AuthRemoteDataSourceImpl(this.pb);

  @override
  Future<UserModel> loginWithEmailAndPassword(
    String email,
    String password,
  ) async {
    final authData = await pb
        .collection('users')
        .authWithPassword(email, password);
    return UserModel.fromRecord(authData.record);
  }

  @override
  Future<UserModel> register(Map<String, dynamic> body) async {
    final record = await pb.collection('users').create(body: body);

    // Attempt auto-login after register
    try {
      if (body.containsKey('password') && body.containsKey('email')) {
        await loginWithEmailAndPassword(body['email'], body['password']);
      }
    } catch (_) {
      // Ignore auto-login fail, we just want the registered user record
    }

    return UserModel.fromRecord(record);
  }

  @override
  Future<void> logout() async {
    pb.authStore.clear();
  }

  @override
  Future<UserModel?> getCurrentUser() async {
    if (pb.authStore.isValid && pb.authStore.record != null) {
      // Technically we should refresh to get latest, but for speed we use cached model unless requested
      return UserModel.fromRecord(pb.authStore.record!);
    }
    return null;
  }

  @override
  Future<bool> checkUniqueness(String field, String value) async {
    try {
      final result = await pb
          .collection('users')
          .getList(page: 1, perPage: 1, filter: '$field = "$value"');
      return result.items.isEmpty;
    } catch (e) {
      // If error, assume it might not be unique or something went wrong
      return false;
    }
  }

  @override
  Stream<AuthStoreEvent> get authStateChanges => pb.authStore.onChange;
}
