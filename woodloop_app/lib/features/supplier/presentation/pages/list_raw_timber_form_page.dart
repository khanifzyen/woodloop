import 'dart:io';
import 'dart:math' as math;
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../injection_container.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../data/datasources/supplier_remote_data_source.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

// ── Thousands separator formatter ─────────────────────────────────────────────
class _ThousandsInputFormatter extends TextInputFormatter {
  final NumberFormat _fmt = NumberFormat('#,###', 'id_ID');

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final raw = newValue.text.replaceAll(RegExp(r'[^0-9]'), '');
    if (raw.isEmpty) return newValue.copyWith(text: '');
    final formatted = _fmt.format(int.parse(raw));
    return newValue.copyWith(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

class ListRawTimberFormPage extends StatefulWidget {
  const ListRawTimberFormPage({super.key});

  @override
  State<ListRawTimberFormPage> createState() => _ListRawTimberFormPageState();
}

class _ListRawTimberFormPageState extends State<ListRawTimberFormPage> {
  String? _selectedSpecies;
  String _selectedGrade = 'A';
  String _selectedShape = 'log';

  // Dimension + price controllers
  final _diameterCtrl = TextEditingController();
  final _thicknessCtrl = TextEditingController();
  final _widthCtrl = TextEditingController();
  final _lengthCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();

  double _estVolume = 0.0;

  // Captured/selected images (up to 5)
  final List<File?> _images = [null, null, null, null, null];
  bool _isProcessingImage = false;

  // Compliance document
  File? _complianceFile;
  String? _complianceFileName;

  bool _isSubmitting = false;

  final _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _diameterCtrl.addListener(_recalcVolume);
    _thicknessCtrl.addListener(_recalcVolume);
    _widthCtrl.addListener(_recalcVolume);
    _lengthCtrl.addListener(_recalcVolume);
  }

  @override
  void dispose() {
    _diameterCtrl.dispose();
    _thicknessCtrl.dispose();
    _widthCtrl.dispose();
    _lengthCtrl.dispose();
    _priceCtrl.dispose();
    super.dispose();
  }

  double _parseField(TextEditingController ctrl) =>
      double.tryParse(ctrl.text.replaceAll(RegExp(r'[^0-9.]'), '')) ?? 0.0;

  void _recalcVolume() {
    final length = _parseField(_lengthCtrl);
    double vol = 0.0;

    if (_selectedShape == 'log') {
      // Log (round): V = π × r² × L  (d in cm → m, L in m)
      final d = _parseField(_diameterCtrl) / 100; // cm → m
      vol = math.pi * math.pow(d / 2, 2) * length;
    } else {
      // Sawn: V = T × W × L  (T, W in cm → m)
      final t = _parseField(_thicknessCtrl) / 100;
      final w = _parseField(_widthCtrl) / 100;
      vol = t * w * length;
    }

    setState(() => _estVolume = vol);
  }

  // ── Image handling ──────────────────────────────────────────────────────────

  Future<void> _pickImage(int slotIndex, ImageSource source) async {
    try {
      final picked = await _picker.pickImage(source: source, imageQuality: 100);
      if (picked == null) return;

      setState(() => _isProcessingImage = true);

      final dir = await getTemporaryDirectory();
      final ext = p.extension(picked.path).isNotEmpty
          ? p.extension(picked.path)
          : '.jpg';
      final outPath =
          '${dir.path}/timber_${DateTime.now().millisecondsSinceEpoch}$ext';

      final result = await FlutterImageCompress.compressAndGetFile(
        picked.path,
        outPath,
        minWidth: 1024,
        minHeight: 1024,
        quality: 85,
        keepExif: false,
      );

      if (result != null && mounted) {
        setState(() {
          _images[slotIndex] = File(result.path);
          _isProcessingImage = false;
        });
      } else {
        setState(() => _isProcessingImage = false);
      }
    } catch (_) {
      if (mounted) setState(() => _isProcessingImage = false);
    }
  }

  void _showPickerSheet(int slotIndex) {
    final l10n = AppLocalizations.of(context)!;
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              ListTile(
                leading: const Icon(
                  Icons.camera_alt_rounded,
                  color: AppTheme.primaryColor,
                ),
                title: Text(
                  l10n.supplierListTimberPhotoCamera,
                  style: const TextStyle(color: Colors.white),
                ),
                onTap: () {
                  Navigator.pop(context);
                  _pickImage(slotIndex, ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(
                  Icons.photo_library_rounded,
                  color: AppTheme.primaryColor,
                ),
                title: Text(
                  l10n.supplierListTimberPhotoGallery,
                  style: const TextStyle(color: Colors.white),
                ),
                onTap: () {
                  Navigator.pop(context);
                  _pickImage(slotIndex, ImageSource.gallery);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _removeImage(int slotIndex) => setState(() => _images[slotIndex] = null);

  void _showFullScreenPreview(int slotIndex, File imageFile) {
    final l10n = AppLocalizations.of(context)!;
    showDialog<void>(
      context: context,
      barrierColor: Colors.black87,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: EdgeInsets.zero,
        child: Stack(
          children: [
            SizedBox(
              width: double.infinity,
              height: double.infinity,
              child: InteractiveViewer(
                child: Image.file(imageFile, fit: BoxFit.contain),
              ),
            ),
            Positioned(
              top: 44,
              left: 16,
              child: GestureDetector(
                onTap: () => Navigator.pop(ctx),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.6),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.close, color: Colors.white, size: 20),
                ),
              ),
            ),
            Positioned(
              top: 52,
              left: 0,
              right: 0,
              child: Center(
                child: Text(
                  '${slotIndex + 1} / ${_images.where((f) => f != null).length}',
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ),
            ),
            Positioned(
              bottom: 40,
              left: 24,
              right: 24,
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        Navigator.pop(ctx);
                        _showPickerSheet(slotIndex);
                      },
                      icon: const Icon(Icons.swap_horiz_rounded, size: 18),
                      label: Text(l10n.supplierListTimberPhotoReplace),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: const BorderSide(color: Colors.white38),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(ctx);
                        _removeImage(slotIndex);
                      },
                      icon: const Icon(Icons.delete_outline_rounded, size: 18),
                      label: Text(l10n.supplierListTimberPhotoDelete),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red.withValues(alpha: 0.8),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Compliance file ─────────────────────────────────────────────────────────

  Future<void> _pickComplianceFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    );
    if (result != null && result.files.single.path != null) {
      setState(() {
        _complianceFile = File(result.files.single.path!);
        _complianceFileName = result.files.single.name;
      });
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  Future<void> _submit(String status) async {
    final authState = context.read<AuthBloc>().state;
    if (authState is! Authenticated) return;

    if (_estVolume <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Isi dimensi terlebih dahulu untuk menghitung volume.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final rawPrice = _priceCtrl.text.replaceAll(RegExp(r'[^0-9]'), '');
    if (rawPrice.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Masukkan harga per m³ terlebih dahulu.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final datasource = getIt<SupplierRemoteDataSource>();
      await datasource.createListing(
        supplierId: authState.user.id,
        shape: _selectedShape,
        diameter: _selectedShape == 'log' ? _parseField(_diameterCtrl) : null,
        thickness: _selectedShape == 'sawn'
            ? _parseField(_thicknessCtrl)
            : null,
        width: _selectedShape == 'sawn' ? _parseField(_widthCtrl) : null,
        length: _parseField(_lengthCtrl),
        volume: _estVolume,
        price: double.parse(rawPrice),
        unit: 'm3',
        status: status,
        photos: _images.whereType<File>().toList(),
        legalityDoc: _complianceFile,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              status == 'published'
                  ? 'Listing berhasil dipublikasikan!'
                  : 'Draft berhasil disimpan.',
            ),
            backgroundColor: AppTheme.primaryColor,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Gagal menyimpan: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  // ── Build ───────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    _selectedSpecies ??= l10n.supplierListTimberSpeciesJati;

    final woodSpecies = [
      l10n.supplierListTimberSpeciesJati,
      l10n.supplierListTimberSpeciesMahoni,
      l10n.supplierListTimberSpeciesMerbau,
      l10n.supplierListTimberSpeciesSengon,
      l10n.supplierListTimberSpeciesUlin,
    ];
    final grades = ['A', 'B', 'C'];
    final shapes = ['log', 'sawn'];

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.supplierListTimberTitle,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        actions: [
          TextButton(
            onPressed: () => context.pop(),
            child: Text(
              l10n.supplierListTimberCancel,
              style: const TextStyle(
                color: Colors.white54,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Photos ────────────────────────────────────────────────────────
            _buildSectionLabel(l10n.supplierListTimberCaptureTitle),
            const SizedBox(height: 4),
            Text(
              l10n.supplierListTimberCaptureSubtitle,
              style: const TextStyle(color: Colors.white54, fontSize: 12),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 100,
              child: Stack(
                children: [
                  ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: 5,
                    itemBuilder: (context, i) {
                      final imageFile = _images[i];
                      final hasImage = imageFile != null;
                      final nextEmpty = _images.indexOf(null);
                      final isTappable = hasImage || i == nextEmpty;

                      return GestureDetector(
                        onTap: _isProcessingImage
                            ? null
                            : () {
                                if (imageFile case final img?) {
                                  _showFullScreenPreview(i, img);
                                } else if (i == nextEmpty) {
                                  _showPickerSheet(i);
                                }
                              },
                        child: Container(
                          width: 100,
                          margin: const EdgeInsets.only(right: 12),
                          decoration: BoxDecoration(
                            color: hasImage
                                ? null
                                : AppTheme.surfaceColor.withValues(
                                    alpha: isTappable ? 0.8 : 0.3,
                                  ),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: hasImage
                                  ? Colors.white.withValues(alpha: 0.05)
                                  : isTappable
                                  ? AppTheme.primaryColor.withValues(alpha: 0.5)
                                  : Colors.white.withValues(alpha: 0.08),
                            ),
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: hasImage
                              ? Stack(
                                  fit: StackFit.expand,
                                  children: [
                                    Image.file(imageFile, fit: BoxFit.cover),
                                    Positioned(
                                      top: 4,
                                      right: 4,
                                      child: GestureDetector(
                                        onTap: () => _removeImage(i),
                                        child: Container(
                                          padding: const EdgeInsets.all(3),
                                          decoration: BoxDecoration(
                                            color: Colors.black.withValues(
                                              alpha: 0.6,
                                            ),
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(
                                            Icons.close,
                                            color: Colors.white,
                                            size: 14,
                                          ),
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      bottom: 4,
                                      left: 6,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 5,
                                          vertical: 2,
                                        ),
                                        decoration: BoxDecoration(
                                          color: Colors.black.withValues(
                                            alpha: 0.5,
                                          ),
                                          borderRadius: BorderRadius.circular(
                                            4,
                                          ),
                                        ),
                                        child: Text(
                                          '${i + 1}/5',
                                          style: const TextStyle(
                                            color: Colors.white70,
                                            fontSize: 9,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                )
                              : isTappable
                              ? Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      i == 0
                                          ? Icons.add_a_photo_outlined
                                          : Icons.add_photo_alternate_outlined,
                                      color: AppTheme.primaryColor,
                                      size: 28,
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      i == 0
                                          ? l10n.generatorAddProductAddPhotoBtn
                                          : '${i + 1}/5',
                                      style: const TextStyle(
                                        color: AppTheme.primaryColor,
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                )
                              : Center(
                                  child: Text(
                                    '${i + 1}/5',
                                    style: const TextStyle(
                                      color: Colors.white12,
                                      fontSize: 11,
                                    ),
                                  ),
                                ),
                        ),
                      );
                    },
                  ),
                  if (_isProcessingImage)
                    Container(
                      color: Colors.black.withValues(alpha: 0.5),
                      child: const Center(
                        child: SizedBox(
                          width: 28,
                          height: 28,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // ── Specifications ────────────────────────────────────────────────
            _buildSectionTitle(l10n.supplierListTimberSpecsTitle),
            const SizedBox(height: 16),
            _buildSectionLabel(l10n.supplierListTimberShape),
            const SizedBox(height: 8),
            Row(
              children: shapes.map((shape) {
                final isSelected = _selectedShape == shape;
                return Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedShape = shape;
                        _recalcVolume();
                      });
                    },
                    child: Container(
                      margin: EdgeInsets.only(
                        right: shape != shapes.last ? 10 : 0,
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.primaryColor.withValues(alpha: 0.1)
                            : AppTheme.surfaceColor,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected
                              ? AppTheme.primaryColor
                              : Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                      child: Text(
                        shape == 'log'
                            ? l10n.supplierListTimberShapeLog
                            : l10n.supplierListTimberShapeSawn,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: isSelected
                              ? AppTheme.primaryColor
                              : Colors.white70,
                          fontSize: 13,
                          fontWeight: isSelected
                              ? FontWeight.bold
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Species
            _buildSectionLabel(l10n.supplierListTimberSpecsSpecies),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: woodSpecies.map((species) {
                final isSelected = _selectedSpecies == species;
                return GestureDetector(
                  onTap: () => setState(() => _selectedSpecies = species),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppTheme.primaryColor.withValues(alpha: 0.1)
                          : AppTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: isSelected
                            ? AppTheme.primaryColor
                            : Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (isSelected) ...[
                          const Icon(
                            Icons.check,
                            color: AppTheme.primaryColor,
                            size: 14,
                          ),
                          const SizedBox(width: 4),
                        ],
                        Text(
                          species,
                          style: TextStyle(
                            color: isSelected
                                ? AppTheme.primaryColor
                                : Colors.white70,
                            fontSize: 13,
                            fontWeight: isSelected
                                ? FontWeight.w600
                                : FontWeight.normal,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Grade
            _buildSectionLabel(l10n.supplierListTimberSpecsGrade),
            const SizedBox(height: 8),
            Row(
              children: grades.map((grade) {
                final isSelected = _selectedGrade == grade;
                return Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedGrade = grade),
                    child: Container(
                      margin: EdgeInsets.only(
                        right: grade != grades.last ? 10 : 0,
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.primaryColor.withValues(alpha: 0.1)
                            : AppTheme.surfaceColor,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected
                              ? AppTheme.primaryColor
                              : Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                      child: Text(
                        l10n.supplierListTimberGrade(grade),
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: isSelected
                              ? AppTheme.primaryColor
                              : Colors.white70,
                          fontSize: 13,
                          fontWeight: isSelected
                              ? FontWeight.bold
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 32),

            // ── Dimensions ────────────────────────────────────────────────────
            _buildSectionTitle(l10n.supplierListTimberDimTitle),
            const SizedBox(height: 16),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_selectedShape == 'log') ...[
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionLabel(l10n.supplierListTimberDimDiameter),
                        const SizedBox(height: 8),
                        _buildNumberField(ctrl: _diameterCtrl, suffix: 'CM'),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                ] else ...[
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionLabel(l10n.supplierListTimberDimThickness),
                        const SizedBox(height: 8),
                        _buildNumberField(ctrl: _thicknessCtrl, suffix: 'CM'),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionLabel(l10n.supplierListTimberDimWidth),
                        const SizedBox(height: 8),
                        _buildNumberField(ctrl: _widthCtrl, suffix: 'CM'),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                ],
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSectionLabel(l10n.supplierListTimberDimLength),
                      const SizedBox(height: 8),
                      _buildNumberField(ctrl: _lengthCtrl, suffix: 'M'),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Est. volume display
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.primaryColor.withValues(alpha: 0.2),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        l10n.supplierListTimberDimEstVolume,
                        style: TextStyle(
                          color: AppTheme.primaryColor.withValues(alpha: 0.8),
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1,
                        ),
                      ),
                      Text(
                        _estVolume > 0
                            ? _estVolume.toStringAsFixed(4)
                            : '0.0000',
                        style: const TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    'm³',
                    style: TextStyle(
                      color: AppTheme.primaryColor.withValues(alpha: 0.8),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // ── Financials ────────────────────────────────────────────────────
            _buildSectionTitle(l10n.supplierListTimberFinTitle),
            const SizedBox(height: 16),
            _buildSectionLabel(l10n.supplierListTimberFinPrice),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 16,
                    ),
                    child: const Text(
                      'Rp',
                      style: TextStyle(
                        color: Colors.white54,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  const VerticalDivider(
                    width: 1,
                    thickness: 1,
                    color: Colors.white10,
                  ),
                  Expanded(
                    child: TextField(
                      controller: _priceCtrl,
                      keyboardType: TextInputType.number,
                      inputFormatters: [_ThousandsInputFormatter()],
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        hintText: '0',
                        hintStyle: TextStyle(color: Colors.white38),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 16,
                        ),
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.only(right: 14),
                    child: const Text(
                      '/m³',
                      style: TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Total approx
            if (_estVolume > 0 && _priceCtrl.text.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(left: 4, top: 8),
                child: Builder(
                  builder: (_) {
                    final rawPrice =
                        double.tryParse(
                          _priceCtrl.text.replaceAll(RegExp(r'[^0-9]'), ''),
                        ) ??
                        0;
                    final total = rawPrice * _estVolume;
                    final fmt = NumberFormat.currency(
                      locale: 'id_ID',
                      symbol: 'Rp ',
                      decimalDigits: 0,
                    );
                    return Text(
                      '≈ ${fmt.format(total)} total (${_estVolume.toStringAsFixed(3)} m³)',
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    );
                  },
                ),
              ),
            const SizedBox(height: 32),

            // ── Compliance ────────────────────────────────────────────────────
            _buildSectionTitle(l10n.supplierListTimberCompTitle),
            const SizedBox(height: 16),
            Container(
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Container(
                          height: 48,
                          width: 48,
                          decoration: BoxDecoration(
                            color: _complianceFile != null
                                ? AppTheme.primaryColor.withValues(alpha: 0.1)
                                : Colors.white.withValues(alpha: 0.05),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            _complianceFile != null
                                ? Icons.check_circle_outline
                                : Icons.description_outlined,
                            color: _complianceFile != null
                                ? AppTheme.primaryColor
                                : Colors.white54,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                l10n.supplierListTimberCompLegalCert,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                _complianceFileName ??
                                    l10n.supplierListTimberCompSvlkorFsc,
                                style: TextStyle(
                                  color: _complianceFile != null
                                      ? AppTheme.primaryColor
                                      : Colors.white54,
                                  fontSize: 12,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        if (_complianceFile != null)
                          IconButton(
                            onPressed: () => setState(() {
                              _complianceFile = null;
                              _complianceFileName = null;
                            }),
                            icon: const Icon(
                              Icons.close,
                              color: Colors.white38,
                              size: 18,
                            ),
                          ),
                      ],
                    ),
                  ),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.03),
                      borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(16),
                        bottomRight: Radius.circular(16),
                      ),
                      border: Border(
                        top: BorderSide(
                          color: Colors.white.withValues(alpha: 0.05),
                        ),
                      ),
                    ),
                    child: TextButton.icon(
                      onPressed: _pickComplianceFile,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                          side: BorderSide(
                            color: Colors.white.withValues(alpha: 0.2),
                          ),
                        ),
                      ),
                      icon: Icon(
                        _complianceFile != null
                            ? Icons.update
                            : Icons.upload_file,
                        color: _complianceFile != null
                            ? AppTheme.primaryColor
                            : Colors.white54,
                      ),
                      label: Text(
                        _complianceFile != null
                            ? l10n.supplierListTimberCompChange
                            : l10n.supplierListTimberCompUpload,
                        style: TextStyle(
                          color: _complianceFile != null
                              ? AppTheme.primaryColor
                              : Colors.white54,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),

      // ── Sticky Bottom Buttons ─────────────────────────────────────────────
      bottomNavigationBar: Container(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
        decoration: BoxDecoration(
          color: AppTheme.background.withValues(alpha: 0.95),
          border: Border(
            top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
          ),
        ),
        child: Row(
          children: [
            // Save as Draft button
            Expanded(
              flex: 2,
              child: OutlinedButton.icon(
                onPressed: _isSubmitting ? null : () => _submit('draft'),
                icon: _isSubmitting
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white54,
                        ),
                      )
                    : const Icon(Icons.save_outlined, size: 18),
                label: Text(l10n.supplierListTimberSaveDraftBtn),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white70,
                  side: BorderSide(color: Colors.white.withValues(alpha: 0.25)),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            // Publish button
            Expanded(
              flex: 3,
              child: ElevatedButton.icon(
                onPressed: _isSubmitting ? null : () => _submit('published'),
                icon: _isSubmitting
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppTheme.background,
                        ),
                      )
                    : const Icon(Icons.rocket_launch_rounded, size: 18),
                label: Text(
                  l10n.supplierListTimberPublishBtn,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.3,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: AppTheme.background,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  elevation: 0,
                  shadowColor: AppTheme.primaryColor.withValues(alpha: 0.4),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  Widget _buildSectionTitle(String title) {
    return Text(
      title.toUpperCase(),
      style: const TextStyle(
        color: AppTheme.primaryColor,
        fontSize: 12,
        fontWeight: FontWeight.bold,
        letterSpacing: 1,
      ),
    );
  }

  Widget _buildSectionLabel(String label) {
    return Text(
      label,
      style: const TextStyle(
        color: Colors.white70,
        fontSize: 13,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildNumberField({
    required TextEditingController ctrl,
    required String suffix,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: ctrl,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'[0-9.]')),
              ],
              style: const TextStyle(
                color: Colors.white,
                fontFamily: 'monospace',
              ),
              decoration: const InputDecoration(
                hintText: '0',
                hintStyle: TextStyle(color: Colors.white38),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 14,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 14),
            child: Text(
              suffix,
              style: const TextStyle(
                color: Colors.white54,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
