import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../../../features/auth/domain/repositories/auth_repository.dart';
import 'user_documents_state.dart';

@injectable
class UserDocumentsCubit extends Cubit<UserDocumentsState> {
  final AuthRepository _repository;

  UserDocumentsCubit(this._repository) : super(UserDocumentsInitial());

  Future<void> fetchDocuments(String userId) async {
    emit(UserDocumentsLoading());
    try {
      final docs = await _repository.fetchUserDocuments(userId);
      emit(UserDocumentsLoaded(docs));
    } catch (e) {
      emit(UserDocumentsError(e.toString()));
    }
  }

  Future<void> updateDocument({
    required String docId,
    required String filePath,
    required String userId,
  }) async {
    emit(UserDocumentsUploading());
    try {
      await _repository.updateUserDocumentFile(
        docId: docId,
        filePath: filePath,
      );
      emit(UserDocumentsUploadSuccess());
      // Re-fetch documents to update UI
      await fetchDocuments(userId);
    } catch (e) {
      emit(UserDocumentsError(e.toString()));
    }
  }
}
