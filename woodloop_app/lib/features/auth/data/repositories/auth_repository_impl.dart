import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';

@LazySingleton(as: AuthRepository)
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl(this.remoteDataSource);

  @override
  Future<User> login(String email, String password) async {
    return await remoteDataSource.loginWithEmailAndPassword(email, password);
  }

  @override
  Future<User> register(Map<String, dynamic> data) async {
    return await remoteDataSource.register(data);
  }

  @override
  Future<void> logout() async {
    await remoteDataSource.logout();
  }

  @override
  Future<User?> getCurrentUser() async {
    return await remoteDataSource.getCurrentUser();
  }

  @override
  Future<bool> checkUniqueness(String field, String value) async {
    return await remoteDataSource.checkUniqueness(field, value);
  }

  @override
  Future<void> requestPasswordReset(String email) async {
    await remoteDataSource.requestPasswordReset(email);
  }

  @override
  Stream<AuthStoreEvent> get authStateChanges =>
      remoteDataSource.authStateChanges;

  @override
  Future<void> uploadUserDocuments({
    required String userId,
    required List<String> filePaths,
    String docType = 'Lainnya',
  }) async {
    await remoteDataSource.uploadUserDocuments(
      userId: userId,
      filePaths: filePaths,
      docType: docType,
    );
  }
}
