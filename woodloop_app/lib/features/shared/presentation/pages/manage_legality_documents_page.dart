import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../widgets/document_manager_view.dart';
import '../cubit/user_documents_cubit.dart';
import '../../../../injection_container.dart';

class ManageLegalityDocumentsPage extends StatelessWidget {
  const ManageLegalityDocumentsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authState = context.read<AuthBloc>().state;
    if (authState is! Authenticated) {
      return const Scaffold(body: Center(child: Text('Unauthorized')));
    }

    final userId = authState
        .user
        .id; // User is verified here, so they can just manage docs

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.surfaceColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Manajemen Dokumen Legalitas',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: BlocProvider(
        create: (context) => getIt<UserDocumentsCubit>(),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              color: AppTheme.primaryColor.withValues(alpha: 0.1),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, color: AppTheme.primaryColor),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Pastikan dokumen legalitas Anda selalu yang terbaru dan masih berlaku.',
                      style: TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: DocumentManagerView(
                userId: userId,
                isReadOnly:
                    false, // users in profile might want to update their expiring docs
              ),
            ),
          ],
        ),
      ),
    );
  }
}
