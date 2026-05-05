import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

part 'user_management_state.dart';

@injectable
class UserManagementCubit extends Cubit<UserManagementState> {
  final PocketBase _pb;

  UserManagementCubit(this._pb) : super(UserManagementInitial());

  Future<void> loadUsers({String? roleFilter}) async {
    emit(UserManagementLoading());
    try {
      String filter = '';
      if (roleFilter != null && roleFilter.isNotEmpty) {
        filter = 'role = "$roleFilter"';
      }

      final result = await _pb.collection('users').getList(
            perPage: 200,
            filter: filter,
            sort: '-created',
          );

      final users = result.items.map((r) => UserSummary(
        id: r.id,
        name: r.getStringValue('name'),
        email: r.getStringValue('email'),
        role: r.getStringValue('role'),
        isVerified: r.getBoolValue('is_verified'),
        workshopName: r.getStringValue('workshop_name'),
        phone: r.getStringValue('phone'),
        created: DateTime.tryParse(r.getStringValue('created')) ?? DateTime.now(),
      )).toList();

      // Count stats
      final totalUsers = users.length;
      final verifiedCount = users.where((u) => u.isVerified).length;
      final unverifiedCount = totalUsers - verifiedCount;

      emit(UserManagementLoaded(
        users: users,
        totalUsers: totalUsers,
        verifiedCount: verifiedCount,
        unverifiedCount: unverifiedCount,
        activeFilter: roleFilter,
      ));
    } catch (e) {
      emit(UserManagementError(e.toString()));
    }
  }

  Future<void> toggleVerification(String userId, bool newValue) async {
    final currentState = state;
    if (currentState is! UserManagementLoaded) return;

    // Optimistic update
    final updatedUsers = currentState.users.map((u) {
      if (u.id == userId) return u.copyWith(isVerified: newValue);
      return u;
    }).toList();

    emit(UserManagementLoaded(
      users: updatedUsers,
      totalUsers: currentState.totalUsers,
      verifiedCount: newValue
          ? currentState.verifiedCount + 1
          : currentState.verifiedCount - 1,
      unverifiedCount: newValue
          ? currentState.unverifiedCount - 1
          : currentState.unverifiedCount + 1,
      activeFilter: currentState.activeFilter,
    ));

    try {
      await _pb.collection('users').update(userId, body: {
        'is_verified': newValue,
      });
    } catch (e) {
      // Revert on failure
      final revertedUsers = currentState.users.map((u) {
        if (u.id == userId) return u.copyWith(isVerified: !newValue);
        return u;
      }).toList();

      emit(UserManagementLoaded(
        users: revertedUsers,
        totalUsers: currentState.totalUsers,
        verifiedCount: currentState.verifiedCount,
        unverifiedCount: currentState.unverifiedCount,
        activeFilter: currentState.activeFilter,
      ));

      emit(UserManagementError('Gagal update verifikasi: $e'));
      // Re-emit loaded state after error shown
      await Future.delayed(const Duration(seconds: 2));
      emit(UserManagementLoaded(
        users: revertedUsers,
        totalUsers: currentState.totalUsers,
        verifiedCount: currentState.verifiedCount,
        unverifiedCount: currentState.unverifiedCount,
        activeFilter: currentState.activeFilter,
      ));
    }
  }
}

class UserSummary extends Equatable {
  final String id;
  final String name;
  final String email;
  final String role;
  final bool isVerified;
  final String? workshopName;
  final String? phone;
  final DateTime created;

  const UserSummary({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.isVerified,
    this.workshopName,
    this.phone,
    required this.created,
  });

  UserSummary copyWith({bool? isVerified}) {
    return UserSummary(
      id: id, name: name, email: email, role: role,
      isVerified: isVerified ?? this.isVerified,
      workshopName: workshopName, phone: phone, created: created,
    );
  }

  @override
  List<Object?> get props => [id, name, email, role, isVerified, workshopName, phone, created];
}
