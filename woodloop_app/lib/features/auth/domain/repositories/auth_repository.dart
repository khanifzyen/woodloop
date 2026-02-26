import '../entities/user.dart';
import 'package:pocketbase/pocketbase.dart';

abstract class AuthRepository {
  Future<User> login(String email, String password);
  Future<User> register(Map<String, dynamic> data);
  Future<void> logout();
  Future<User?> getCurrentUser();
  Stream<AuthStoreEvent> get authStateChanges;
}
