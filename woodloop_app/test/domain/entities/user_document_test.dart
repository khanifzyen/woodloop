import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/auth/domain/entities/user_document.dart';

void main() {
  group('UserDocument', () {
    test('creates with required fields', () {
      const doc = UserDocument(
        id: 'd1',
        userId: 'u1',
        docType: 'NIB',
        docName: 'nib.pdf',
        file: 'nib_abc.pdf',
        verified: false,
      );
      expect(doc.id, 'd1');
      expect(doc.userId, 'u1');
      expect(doc.docType, 'NIB');
      expect(doc.docName, 'nib.pdf');
      expect(doc.file, 'nib_abc.pdf');
      expect(doc.verified, false);
      expect(doc.notes, isNull);
    });

    test('props includes all fields', () {
      const doc = UserDocument(
        id: 'd1',
        userId: 'u1',
        docType: 'SVLK',
        docName: 'svlk.pdf',
        file: 'svlk_123.pdf',
        verified: true,
        notes: 'ok',
      );
      expect(doc.props, ['d1', 'u1', 'SVLK', 'svlk.pdf', 'svlk_123.pdf', true, 'ok']);
    });

    test('equality', () {
      const a = UserDocument(
        id: 'x', userId: 'y', docType: 'NIB', docName: 'n.pdf', file: 'f', verified: false,
      );
      const b = UserDocument(
        id: 'x', userId: 'y', docType: 'NIB', docName: 'n.pdf', file: 'f', verified: false,
      );
      expect(a, b);
    });
  });
}
