import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/auth/domain/entities/user.dart';

void main() {
  group('User', () {
    const user = User(
      id: 'user1',
      email: 'demo@woodloop.id',
      name: 'Test User',
      role: 'generator',
    );

    test('creates with required fields', () {
      expect(user.id, 'user1');
      expect(user.email, 'demo@woodloop.id');
      expect(user.name, 'Test User');
      expect(user.role, 'generator');
    });

    test('has defaults for optional fields', () {
      expect(user.workshopName, isNull);
      expect(user.address, isNull);
      expect(user.phone, isNull);
      expect(user.isVerified, false);
      expect(user.isAdminVerified, false);
      expect(user.bio, isNull);
      expect(user.avatar, isNull);
    });

    test('supports full construction', () {
      const full = User(
        id: 'u2',
        email: 'e@w.id',
        name: 'Full',
        role: 'supplier',
        workshopName: 'Workshop',
        address: 'Jepara',
        locationLat: -6.5,
        locationLng: 110.6,
        phone: '08123',
        isVerified: true,
        isAdminVerified: true,
        bio: 'Bio text',
        avatar: 'avatar.jpg',
      );
      expect(full.workshopName, 'Workshop');
      expect(full.locationLat, -6.5);
      expect(full.isAdminVerified, true);
    });

    test('props includes all fields', () {
      expect(user.props, [
        'user1',
        'demo@woodloop.id',
        'Test User',
        'generator',
        null,
        null,
        null,
        null,
        null,
        false,
        false,
        null,
        null,
      ]);
    });

    test('equality', () {
      const a = User(id: 'x', email: 'a@b.c', name: 'A', role: 'buyer');
      const b = User(id: 'x', email: 'a@b.c', name: 'A', role: 'buyer');
      expect(a, b);
    });

    test('inequality on different fields', () {
      const a = User(id: 'x', email: 'a@b.c', name: 'A', role: 'buyer');
      const b = User(id: 'y', email: 'a@b.c', name: 'A', role: 'buyer');
      expect(a, isNot(b));
    });
  });
}
