import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/auth/domain/entities/user_document.dart';
import 'package:woodloop_app/features/auth/domain/repositories/auth_repository.dart';
import 'package:woodloop_app/features/shared/presentation/cubit/user_documents_cubit.dart';
import 'package:woodloop_app/features/shared/presentation/cubit/user_documents_state.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late MockAuthRepository repository;

  const userId = 'user1';
  final sampleDocuments = [
    const UserDocument(
      id: 'doc1',
      userId: userId,
      docType: 'ktp',
      docName: 'KTP',
      file: 'ktp.pdf',
      verified: true,
    ),
    const UserDocument(
      id: 'doc2',
      userId: userId,
      docType: 'nib',
      docName: 'NIB',
      file: 'nib.pdf',
      verified: false,
    ),
  ];

  setUp(() {
    repository = MockAuthRepository();
  });

  group('fetchDocuments', () {
    blocTest<UserDocumentsCubit, UserDocumentsState>(
      'emits [UserDocumentsLoading, UserDocumentsLoaded] on success',
      build: () {
        when(() => repository.fetchUserDocuments(userId))
            .thenAnswer((_) async => sampleDocuments);
        return UserDocumentsCubit(repository);
      },
      act: (cubit) => cubit.fetchDocuments(userId),
      expect: () => [
        UserDocumentsLoading(),
        UserDocumentsLoaded(sampleDocuments),
      ],
    );

    blocTest<UserDocumentsCubit, UserDocumentsState>(
      'emits [UserDocumentsLoading, UserDocumentsError] on failure',
      build: () {
        when(() => repository.fetchUserDocuments(userId))
            .thenThrow(Exception('Failed to fetch'));
        return UserDocumentsCubit(repository);
      },
      act: (cubit) => cubit.fetchDocuments(userId),
      expect: () => [
        UserDocumentsLoading(),
        isA<UserDocumentsError>(),
      ],
    );
  });

  group('updateDocument', () {
    const docId = 'doc1';
    const filePath = '/path/to/new_doc.pdf';

    blocTest<UserDocumentsCubit, UserDocumentsState>(
      'emits [UserDocumentsUploading, UserDocumentsUploadSuccess, '
      'UserDocumentsLoading, UserDocumentsLoaded] on success',
      build: () {
        when(
          () => repository.updateUserDocumentFile(
            docId: docId,
            filePath: filePath,
          ),
        ).thenAnswer((_) async {});
        when(() => repository.fetchUserDocuments(userId))
            .thenAnswer((_) async => sampleDocuments);
        return UserDocumentsCubit(repository);
      },
      act: (cubit) => cubit.updateDocument(
        docId: docId,
        filePath: filePath,
        userId: userId,
      ),
      expect: () => [
        UserDocumentsUploading(),
        UserDocumentsUploadSuccess(),
        UserDocumentsLoading(),
        UserDocumentsLoaded(sampleDocuments),
      ],
    );

    blocTest<UserDocumentsCubit, UserDocumentsState>(
      'emits [UserDocumentsUploading, UserDocumentsError] when '
      'updateUserDocumentFile fails',
      build: () {
        when(
          () => repository.updateUserDocumentFile(
            docId: docId,
            filePath: filePath,
          ),
        ).thenThrow(Exception('Upload failed'));
        return UserDocumentsCubit(repository);
      },
      act: (cubit) => cubit.updateDocument(
        docId: docId,
        filePath: filePath,
        userId: userId,
      ),
      expect: () => [
        UserDocumentsUploading(),
        isA<UserDocumentsError>(),
      ],
    );
  });

  group('addDocument', () {
    const filePath = '/path/to/new_doc.pdf';
    const docType = 'ktp';

    blocTest<UserDocumentsCubit, UserDocumentsState>(
      'emits [UserDocumentsUploading, UserDocumentsUploadSuccess, '
      'UserDocumentsLoading, UserDocumentsLoaded] on success',
      build: () {
        when(
          () => repository.uploadUserDocuments(
            userId: userId,
            filePaths: [filePath],
            docType: docType,
          ),
        ).thenAnswer((_) async {});
        when(() => repository.fetchUserDocuments(userId))
            .thenAnswer((_) async => sampleDocuments);
        return UserDocumentsCubit(repository);
      },
      act: (cubit) => cubit.addDocument(
        filePath: filePath,
        docType: docType,
        userId: userId,
      ),
      expect: () => [
        UserDocumentsUploading(),
        UserDocumentsUploadSuccess(),
        UserDocumentsLoading(),
        UserDocumentsLoaded(sampleDocuments),
      ],
    );

    blocTest<UserDocumentsCubit, UserDocumentsState>(
      'emits [UserDocumentsUploading, UserDocumentsError] when '
      'uploadUserDocuments fails',
      build: () {
        when(
          () => repository.uploadUserDocuments(
            userId: userId,
            filePaths: [filePath],
            docType: docType,
          ),
        ).thenThrow(Exception('Upload failed'));
        return UserDocumentsCubit(repository);
      },
      act: (cubit) => cubit.addDocument(
        filePath: filePath,
        docType: docType,
        userId: userId,
      ),
      expect: () => [
        UserDocumentsUploading(),
        isA<UserDocumentsError>(),
      ],
    );
  });
}
