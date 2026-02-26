import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../../auth/domain/entities/user.dart';
import '../../domain/repositories/user_profile_repository.dart';

part 'user_profile_event.dart';
part 'user_profile_state.dart';

@injectable
class UserProfileBloc extends Bloc<UserProfileEvent, UserProfileState> {
  final UserProfileRepository _repository;

  UserProfileBloc(this._repository) : super(UserProfileInitial()) {
    on<UserProfileFetchRequested>(_onFetchRequested);
    on<UserProfileUpdateRequested>(_onUpdateRequested);
  }

  Future<void> _onFetchRequested(
    UserProfileFetchRequested event,
    Emitter<UserProfileState> emit,
  ) async {
    emit(UserProfileLoading());
    try {
      final user = await _repository.getUserProfile(event.userId);
      emit(UserProfileLoaded(user));
    } catch (e) {
      emit(UserProfileError(e.toString()));
    }
  }

  Future<void> _onUpdateRequested(
    UserProfileUpdateRequested event,
    Emitter<UserProfileState> emit,
  ) async {
    emit(UserProfileLoading());
    try {
      final user = await _repository.updateUserProfile(
        event.userId,
        event.data,
      );
      emit(UserProfileUpdateSuccess(user));
      emit(
        UserProfileLoaded(user),
      ); // Reset immediately to loaded state visually
    } catch (e) {
      emit(UserProfileError(e.toString()));
    }
  }
}
