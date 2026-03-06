import '../entities/user.dart';
import '../entities/user_document.dart';
import 'package:pocketbase/pocketbase.dart';

abstract class AuthRepository {
  Future<User> login(String email, String password);
  Future<User> register(Map<String, dynamic> data);
  Future<void> logout();
  Future<User?> getCurrentUser();
  Future<bool> checkUniqueness(String field, String value);
  Future<void> requestPasswordReset(String email);
  Stream<AuthStoreEvent> get authStateChanges;
  Future<void> uploadUserDocuments({
    required String userId,
    required List<String> filePaths,
    required String docType,
  });
  Future<List<UserDocument>> fetchUserDocuments(String userId);
  Future<User> updateProfileAvatar(String userId, String filePath);
}
