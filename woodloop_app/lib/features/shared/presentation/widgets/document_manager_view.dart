import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:file_picker/file_picker.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../auth/domain/entities/user_document.dart';
import '../cubit/user_documents_cubit.dart';
import '../cubit/user_documents_state.dart';

class DocumentManagerView extends StatefulWidget {
  final String userId;
  final bool
  isReadOnly; // set to true if just viewing, false for registration status

  const DocumentManagerView({
    super.key,
    required this.userId,
    this.isReadOnly = false,
  });

  @override
  State<DocumentManagerView> createState() => _DocumentManagerViewState();
}

class _DocumentManagerViewState extends State<DocumentManagerView> {
  @override
  void initState() {
    super.initState();
    context.read<UserDocumentsCubit>().fetchDocuments(widget.userId);
  }

  Future<void> _uploadRevision(UserDocument doc) async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    );

    if (result != null && result.files.single.path != null) {
      if (!mounted) return;
      context.read<UserDocumentsCubit>().updateDocument(
        docId: doc.id,
        filePath: result.files.single.path!,
        userId: widget.userId,
      );
    }
  }

  void _showAddDocumentSheet(BuildContext context) {
    String selectedType = 'Lainnya';
    final docTypes = [
      'NIB',
      'SVLK',
      'SK_Pengesahan',
      'Izin_Usaha',
      'Sertifikat_Lainnya',
      'Lainnya',
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (sheetContext) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 24,
                right: 24,
                top: 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Tambah Dokumen Legalitas',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Jenis Dokumen',
                    style: TextStyle(color: Colors.white54, fontSize: 12),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: AppTheme.background,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: selectedType,
                        isExpanded: true,
                        dropdownColor: AppTheme.background,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                        ),
                        items: docTypes
                            .map(
                              (t) => DropdownMenuItem(
                                value: t,
                                child: Text(t.replaceAll('_', ' ')),
                              ),
                            )
                            .toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => selectedType = val);
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  SafeArea(
                    child: SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton.icon(
                        onPressed: () async {
                          final result = await FilePicker.platform.pickFiles(
                            type: FileType.custom,
                            allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
                          );
                          if (result != null &&
                              result.files.single.path != null) {
                            if (!this.context.mounted) return;
                            Navigator.pop(sheetContext);
                            this.context.read<UserDocumentsCubit>().addDocument(
                              filePath: result.files.single.path!,
                              docType: selectedType,
                              userId: widget.userId,
                            );
                          }
                        },
                        icon: const Icon(Icons.upload_file),
                        label: const Text('Pilih File & Unggah'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryColor,
                          foregroundColor: AppTheme.background,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<UserDocumentsCubit, UserDocumentsState>(
      listener: (context, state) {
        if (state is UserDocumentsError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: Colors.redAccent,
            ),
          );
        } else if (state is UserDocumentsUploadSuccess) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Dokumen berhasil diunggah ulang.'),
              backgroundColor: Colors.green,
            ),
          );
        }
      },
      builder: (context, state) {
        if (state is UserDocumentsLoading || state is UserDocumentsInitial) {
          return const Center(
            child: CircularProgressIndicator(color: AppTheme.primaryColor),
          );
        } else if (state is UserDocumentsUploading) {
          return const Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircularProgressIndicator(color: AppTheme.primaryColor),
                SizedBox(height: 16),
                Text('Mengunggah dokumen...'),
              ],
            ),
          );
        } else if (state is UserDocumentsLoaded) {
          final docs = state.documents;

          return Column(
            children: [
              Expanded(
                child: docs.isEmpty
                    ? const Center(
                        child: Text(
                          'Tidak ada dokumen yang ditemukan.',
                          style: TextStyle(color: Colors.white54),
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.all(24),
                        itemCount: docs.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(height: 16),
                        itemBuilder: (context, index) {
                          final doc = docs[index];
                          final hasNotes =
                              doc.notes != null && doc.notes!.isNotEmpty;
                          final needsRevision = hasNotes && !doc.verified;

                          return Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceColor,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: needsRevision
                                    ? Colors.redAccent.withValues(alpha: 0.5)
                                    : doc.verified
                                    ? Colors.green.withValues(alpha: 0.5)
                                    : Colors.white10,
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      needsRevision
                                          ? Icons.warning_amber_rounded
                                          : doc.verified
                                          ? Icons.check_circle_outline
                                          : Icons.access_time,
                                      color: needsRevision
                                          ? Colors.redAccent
                                          : doc.verified
                                          ? Colors.green
                                          : Colors.orange,
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            doc.docType.replaceAll('_', ' '),
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                          if (doc.docName.isNotEmpty) ...[
                                            const SizedBox(height: 4),
                                            Text(
                                              doc.docName,
                                              style: const TextStyle(
                                                color: Colors.white54,
                                                fontSize: 12,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ],
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                if (needsRevision) ...[
                                  const SizedBox(height: 16),
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.redAccent.withValues(
                                        alpha: 0.1,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(
                                        color: Colors.redAccent.withValues(
                                          alpha: 0.2,
                                        ),
                                      ),
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'Catatan Admin:',
                                          style: TextStyle(
                                            color: Colors.redAccent,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 12,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          doc.notes!,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 13,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  if (!widget.isReadOnly) ...[
                                    const SizedBox(height: 16),
                                    SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton.icon(
                                        onPressed: () => _uploadRevision(doc),
                                        icon: const Icon(Icons.upload_file),
                                        label: const Text(
                                          'Unggah Ulang Dokumen',
                                        ),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor:
                                              AppTheme.primaryColor,
                                          foregroundColor: AppTheme.background,
                                        ),
                                      ),
                                    ),
                                  ],
                                ] else if (!doc.verified) ...[
                                  const SizedBox(height: 16),
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.orange.withValues(
                                        alpha: 0.1,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Text(
                                      'Menunggu review admin.',
                                      style: TextStyle(
                                        color: Colors.orange,
                                        fontSize: 13,
                                        fontStyle: FontStyle.italic,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
              ),
              if (!widget.isReadOnly)
                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton.icon(
                        onPressed: () => _showAddDocumentSheet(context),
                        icon: const Icon(Icons.add),
                        label: const Text('Tambah Dokumen Legalitas'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryColor,
                          foregroundColor: AppTheme.background,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 4,
                          shadowColor: AppTheme.primaryColor.withValues(
                            alpha: 0.3,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}
