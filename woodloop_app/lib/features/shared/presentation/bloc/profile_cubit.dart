import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../../../features/auth/domain/repositories/auth_repository.dart';
import 'profile_state.dart';

@injectable
class ProfileCubit extends Cubit<ProfileState> {
  final AuthRepository _repository;

  ProfileCubit(this._repository) : super(ProfileInitial());

  Future<void> loadProfile(String userId) async {
    emit(ProfileLoading());
    try {
      final documents = await _repository.fetchUserDocuments(userId);
      emit(ProfileLoaded(documents));
    } catch (e) {
      emit(ProfileError(e.toString()));
    }
  }

  Future<void> updateAvatar(String userId, String filePath) async {
    emit(ProfileLoading());
    try {
      await _repository.updateProfileAvatar(userId, filePath);
      // After upload, reload documents (though avatar isn't in documents collection)
      // but we might want to refresh the user state in AuthBloc instead.
      // For now, just reload documents to show we can.
      final documents = await _repository.fetchUserDocuments(userId);
      emit(ProfileLoaded(documents));
      emit(ProfileUpdateSuccess());
    } catch (e) {
      emit(ProfileError(e.toString()));
    }
  }
}
