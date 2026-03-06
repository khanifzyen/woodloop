import 'dart:io';
import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> loginWithEmailAndPassword(String email, String password);
  Future<UserModel> register(Map<String, dynamic> body);
  Future<void> logout();
  Future<UserModel?> getCurrentUser();
  Future<bool> checkUniqueness(String field, String value);
  Future<void> requestPasswordReset(String email);
  Stream<AuthStoreEvent> get authStateChanges;

  /// Upload multiple legality documents to user_documents collection.
  /// [userId] — the user's record ID after registration.
  /// [filePaths] — list of local file paths to upload.
  /// [docType] — document type key (e.g. 'NIB', 'SVLK', 'Lainnya').
  Future<void> uploadUserDocuments({
    required String userId,
    required List<String> filePaths,
    String docType = 'Lainnya',
  });
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
    // authWithPassword returns a cached record from the JWT token.
    // Fetch the full record to ensure ALL custom fields (verified, is_verified, role, etc.) are present.
    final fullRecord = await pb.collection('users').getOne(authData.record.id);
    return UserModel.fromRecord(fullRecord);
  }

  @override
  Future<UserModel> register(Map<String, dynamic> body) async {
    final record = await pb.collection('users').create(body: body);

    // Request verification email explicitly, just in case "Send on register" is off in PB settings
    try {
      if (body.containsKey('email') && body['email'].toString().isNotEmpty) {
        await pb.collection('users').requestVerification(body['email']);
      }
    } catch (_) {
      // Ignore if it fails (e.g. already verified or email invalid)
    }

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
    if (!pb.authStore.isValid || pb.authStore.record == null) return null;
    try {
      // Fetch fresh record from API to get all custom fields (not just cached JWT data)
      final fullRecord = await pb
          .collection('users')
          .getOne(pb.authStore.record!.id);
      return UserModel.fromRecord(fullRecord);
    } catch (_) {
      return null;
    }
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
  Future<void> requestPasswordReset(String email) async {
    await pb.collection('users').requestPasswordReset(email);
  }

  @override
  Future<void> uploadUserDocuments({
    required String userId,
    required List<String> filePaths,
    String docType = 'Lainnya',
  }) async {
    for (final path in filePaths) {
      final file = File(path);
      if (!file.existsSync()) continue;
      final fileName = file.path.split('/').last;
      await pb
          .collection('user_documents')
          .create(
            body: {'user': userId, 'doc_type': docType, 'doc_name': fileName},
            files: [
              http.MultipartFile.fromBytes(
                'file',
                file.readAsBytesSync(),
                filename: fileName,
              ),
            ],
          );
    }
  }

  @override
  Stream<AuthStoreEvent> get authStateChanges => pb.authStore.onChange;
}
