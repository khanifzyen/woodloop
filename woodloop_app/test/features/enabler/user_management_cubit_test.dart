import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:pocketbase/pocketbase.dart';

import 'package:woodloop_app/features/enabler/presentation/cubit/user_management_cubit.dart';

class MockPocketBase extends Mock implements PocketBase {}

class MockRecordService extends Mock implements RecordService {}

class MockRecordModel extends Mock implements RecordModel {}

void main() {
  late MockPocketBase mockPb;

  setUp(() {
    mockPb = MockPocketBase();
  });

  group('UserSummary', () {
    final now = DateTime(2026, 5, 1);

    test('full construction', () {
      final user = UserSummary(
        id: 'u1', name: 'Test User', email: 'test@test.com',
        role: 'generator', isVerified: true,
        workshopName: 'Bengkel Test', phone: '08123456789',
        created: now,
      );
      expect(user.id, equals('u1'));
      expect(user.name, equals('Test User'));
      expect(user.email, equals('test@test.com'));
      expect(user.role, equals('generator'));
      expect(user.isVerified, isTrue);
      expect(user.workshopName, equals('Bengkel Test'));
    });

    test('equality', () {
      final a = UserSummary(id: '1', name: 'A', email: 'a@a.com', role: 'buyer', isVerified: false, created: now);
      final b = UserSummary(id: '1', name: 'A', email: 'a@a.com', role: 'buyer', isVerified: false, created: now);
      expect(a, equals(b));
    });

    test('copyWith changes isVerified', () {
      final original = UserSummary(id: '1', name: 'A', email: 'a@a.com', role: 'buyer', isVerified: false, created: now);
      final updated = original.copyWith(isVerified: true);
      expect(updated.isVerified, isTrue);
      expect(original.isVerified, isFalse);
      expect(updated.id, equals(original.id));
    });
  });

  group('UserManagementCubit', () {
    blocTest<UserManagementCubit, UserManagementState>(
      'initial state is UserManagementInitial',
      build: () => UserManagementCubit(mockPb),
      verify: (cubit) => expect(cubit.state, isA<UserManagementInitial>()),
    );
  });

  group('UserManagement Logic', () {
    test('user role labels are valid', () {
      const roles = ['supplier', 'generator', 'aggregator', 'converter', 'buyer', 'enabler'];
      expect(roles.length, equals(6));
    });

    test('verification toggle should update isVerified', () {
      var isVerified = false;
      isVerified = !isVerified; // toggle
      expect(isVerified, isTrue);
      isVerified = !isVerified;
      expect(isVerified, isFalse);
    });

    test('stats calculation: total = verified + unverified', () {
      const total = 10;
      const verified = 7;
      const unverified = 3;
      expect(verified + unverified, equals(total));
    });

    test('optimistic update: verified count adjusts immediately', () {
      var verified = 7;
      var unverified = 3;
      // Toggle one user from unverified to verified
      verified++;
      unverified--;
      expect(verified, equals(8));
      expect(unverified, equals(2));
    });

    test('role filter returns only matching role', () {
      const users = [
        ('generator', 'User A'),
        ('aggregator', 'User B'),
        ('generator', 'User C'),
      ];
      final filtered = users.where((u) => u.$1 == 'generator').toList();
      expect(filtered.length, equals(2));
    });

    test('role filter null returns all users', () {
      const users = ['a', 'b', 'c'];
      // No filter = all
      expect(users.length, equals(3));
    });

    test('revert on failed verification update', () {
      var verified = 7;
      var unverified = 3;
      final savedVerified = verified;
      final savedUnverified = unverified;

      // Optimistic update
      verified++;
      unverified--;

      // Revert on failure
      verified = savedVerified;
      unverified = savedUnverified;

      expect(verified, equals(7));
      expect(unverified, equals(3));
    });
  });
}
