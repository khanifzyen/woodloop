import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../bloc/product_bloc.dart';
import '../bloc/marketplace_bloc.dart';
import '../../../../injection_container.dart';

class CreateUpcycledProductFormPage extends StatefulWidget {
  const CreateUpcycledProductFormPage({super.key});

  @override
  State<CreateUpcycledProductFormPage> createState() =>
      _CreateUpcycledProductFormPageState();
}

class _CreateUpcycledProductFormPageState
    extends State<CreateUpcycledProductFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descController = TextEditingController();
  final _priceController = TextEditingController();
  final _stockController = TextEditingController();
  String _selectedCategory = 'furniture';
  final List<String> _selectedTransactionIds = [];

  // Category options matching PocketBase products schema
  final List<_CategoryOption> _categories = [
    _CategoryOption('furniture', 'Furniture'),
    _CategoryOption('decor', 'Decor'),
    _CategoryOption('accessories', 'Accessories'),
    _CategoryOption('art', 'Art'),
    _CategoryOption('other', 'Other'),
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _descController.dispose();
    _priceController.dispose();
    _stockController.dispose();
    super.dispose();
  }

  void _onSubmit() {
    if (!_formKey.currentState!.validate()) return;

    final authState = context.read<AuthBloc>().state;
    String? converterId;
    if (authState is Authenticated) {
      converterId = authState.user.id;
    }

    if (converterId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('User not authenticated')),
      );
      return;
    }

    final body = {
      'converter': converterId,
      'name': _nameController.text.trim(),
      'description': _descController.text.trim(),
      'category': _selectedCategory,
      'price': double.tryParse(_priceController.text.trim()) ?? 0,
      'stock': int.tryParse(_stockController.text.trim()) ?? 0,
      'source_transactions': _selectedTransactionIds,
    };

    context.read<ProductBloc>().add(CreateProduct(body));
  }

  void _showSuccessDialog(String productId) {
    final traceabilityUrl = 'https://woodloop.app/trace/$productId';

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Column(
          children: [
            Icon(Icons.check_circle, color: Colors.green, size: 40),
            SizedBox(height: 8),
            Text(
              'Produk Berhasil Dibuat!',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'QR Code Traceability untuk produk ini:',
              style: TextStyle(color: Colors.white70, fontSize: 12),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: QrImageView(
                data: traceabilityUrl,
                version: QrVersions.auto,
                size: 180,
                backgroundColor: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              traceabilityUrl,
              style: const TextStyle(
                color: AppTheme.primaryColor,
                fontSize: 10,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Sertakan QR ini bersama produk agar pembeli bisa melacak asal kayu.',
              style: TextStyle(
                color: Colors.white54,
                fontSize: 11,
                height: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(ctx).pop();
                context.pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Selesai & Kembali ke Katalog',
                style: TextStyle(
                  color: AppTheme.background,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return BlocProvider(
      create: (context) => getIt<ProductBloc>(),
      child: BlocConsumer<ProductBloc, ProductState>(
        listener: (context, state) {
          if (state is ProductCreated) {
            _showSuccessDialog(state.product.id);
          } else if (state is ProductError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.redAccent,
              ),
            );
          }
        },
        builder: (context, state) {
          final isLoading = state is ProductLoading;

          return Scaffold(
            backgroundColor: AppTheme.background,
            appBar: AppBar(
              leading: IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => context.pop(),
              ),
              title: Text(
                l10n.converterAddProductTitle,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              centerTitle: true,
              backgroundColor: Colors.transparent,
              elevation: 0,
            ),
            body: SafeArea(
              child: Column(
                children: [
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.all(24.0),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Image Upload Section
                            Text(
                              l10n.converterAddProductMainPhoto,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Container(
                                  height: 120,
                                  width: 120,
                                  decoration: BoxDecoration(
                                    color: AppTheme.surfaceColor,
                                    border: Border.all(
                                      color: AppTheme.primaryColor.withValues(
                                        alpha: 0.3,
                                      ),
                                      width: 2,
                                    ),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const Icon(
                                        Icons.add_a_photo_outlined,
                                        color: AppTheme.primaryColor,
                                        size: 32,
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        l10n.converterAddProductAddPhoto,
                                        style: TextStyle(
                                          color: AppTheme.primaryColor
                                              .withValues(alpha: 0.8),
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Container(
                                    height: 120,
                                    decoration: BoxDecoration(
                                      color: AppTheme.surfaceColor,
                                      border: Border.all(
                                        color:
                                            Colors.white.withValues(alpha: 0.1),
                                      ),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Center(
                                      child: Text(
                                        l10n.converterAddProductPhotoSlot2,
                                        textAlign: TextAlign.center,
                                        style: const TextStyle(
                                          color: Colors.white38,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 32),

                            // Category Selection
                            Text(
                              'Category',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: _categories
                                  .map(
                                    (cat) => Expanded(
                                      child: GestureDetector(
                                        onTap: () => setState(
                                          () => _selectedCategory = cat.value,
                                        ),
                                        child: Container(
                                          margin: EdgeInsets.only(
                                            right: cat != _categories.last
                                                ? 8
                                                : 0,
                                          ),
                                          padding:
                                              const EdgeInsets.symmetric(
                                            vertical: 12,
                                          ),
                                          decoration: BoxDecoration(
                                            color:
                                                _selectedCategory == cat.value
                                                    ? AppTheme.primaryColor
                                                        .withValues(alpha: 0.1)
                                                    : AppTheme.surfaceColor,
                                            borderRadius:
                                                BorderRadius.circular(12),
                                            border: Border.all(
                                              color:
                                                  _selectedCategory == cat.value
                                                      ? AppTheme.primaryColor
                                                      : Colors.white
                                                          .withValues(
                                                          alpha: 0.1,
                                                        ),
                                            ),
                                          ),
                                          child: Text(
                                            cat.display,
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                              color:
                                                  _selectedCategory == cat.value
                                                      ? AppTheme.primaryColor
                                                      : Colors.white70,
                                              fontSize: 12,
                                              fontWeight:
                                                  _selectedCategory == cat.value
                                                      ? FontWeight.bold
                                                      : FontWeight.normal,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  )
                                  .toList(),
                            ),
                            const SizedBox(height: 20),

                            // Input Fields
                            _buildInputField(
                              label: l10n.converterAddProductName,
                              hint: l10n.converterAddProductNameHint,
                              controller: _nameController,
                            ),
                            const SizedBox(height: 20),
                            _buildInputField(
                              label: l10n.converterAddProductDesc,
                              hint: l10n.converterAddProductDescHint,
                              maxLines: 4,
                              controller: _descController,
                            ),
                            const SizedBox(height: 20),
                            _buildInputField(
                              label: l10n.converterAddProductPrice,
                              hint: l10n.converterAddProductPriceHint,
                              keyboardType: TextInputType.number,
                              controller: _priceController,
                            ),
                            const SizedBox(height: 20),
                            _buildInputField(
                              label: l10n.converterAddProductStock,
                              hint: l10n.converterAddProductStockHint,
                              keyboardType: TextInputType.number,
                              controller: _stockController,
                            ),
                            const SizedBox(height: 32),

                            // Material Source Tracking — Load marketplace transactions
                            Container(
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: AppTheme.surfaceColor,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.1),
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.receipt_long, color: AppTheme.primaryColor, size: 20),
                                      const SizedBox(width: 8),
                                      Text(l10n.converterAddProductTraceability, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  Text(l10n.converterAddProductTraceabilityDesc, style: const TextStyle(color: Colors.white70, fontSize: 12, height: 1.5)),
                                  const SizedBox(height: 12),
                                  BlocProvider(
                                    create: (_) => getIt<MarketplaceBloc>()..add(LoadMarketplaceTransactions(buyerId: converterId, status: 'paid')),
                                    child: BlocBuilder<MarketplaceBloc, MarketplaceState>(
                                      builder: (ctx, mktState) {
                                        if (mktState is MarketplaceLoading) {
                                          return const SizedBox(height: 40, child: Center(child: CircularProgressIndicator(strokeWidth: 2)));
                                        }
                                        if (mktState is MarketplaceError) {
                                          return Text('Gagal memuat transaksi: ${mktState.message}', style: const TextStyle(color: Colors.redAccent, fontSize: 12));
                                        }
                                        if (mktState is MarketplaceTransactionsLoaded) {
                                          final transactions = mktState.transactions;
                                          if (transactions.isEmpty) {
                                            return const Text('Belum ada transaksi pembelian bahan.', style: TextStyle(color: Colors.white54, fontSize: 12));
                                          }
                                          return Wrap(
                                            spacing: 8,
                                            runSpacing: 8,
                                            children: transactions.map((tx) {
                                              final isSelected = _selectedTransactionIds.contains(tx.id);
                                              return FilterChip(
                                                selected: isSelected,
                                                label: Text('${tx.id.substring(0, 8)}... (${tx.quantity}kg)', style: TextStyle(fontSize: 11, color: isSelected ? AppTheme.background : Colors.white70)),
                                                selectedColor: AppTheme.primaryColor,
                                                backgroundColor: AppTheme.background,
                                                checkmarkColor: AppTheme.background,
                                                side: BorderSide(color: isSelected ? AppTheme.primaryColor : Colors.white24),
                                                onSelected: (sel) {
                                                  setState(() {
                                                    if (sel) { _selectedTransactionIds.add(tx.id); }
                                                    else { _selectedTransactionIds.remove(tx.id); }
                                                  });
                                                },
                                              );
                                            }).toList(),
                                          );
                                        }
                                        return const SizedBox.shrink();
                                      },
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 48),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Bottom Action
                  Container(
                    padding: const EdgeInsets.all(24.0),
                    decoration: BoxDecoration(
                      color: AppTheme.background,
                      border: Border(
                        top: BorderSide(
                          color: Colors.white.withValues(alpha: 0.05),
                        ),
                      ),
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: isLoading ? null : _onSubmit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryColor,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 0,
                        ),
                        child: isLoading
                            ? const SizedBox(
                                height: 24,
                                width: 24,
                                child: CircularProgressIndicator(
                                  color: AppTheme.background,
                                  strokeWidth: 2,
                                ),
                              )
                            : Text(
                                l10n.converterAddProductSubmitBtn,
                                style: const TextStyle(
                                  color: AppTheme.background,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInputField({
    required String label,
    required String hint,
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
    TextEditingController? controller,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          maxLines: maxLines,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white24),
            filled: true,
            fillColor: AppTheme.surfaceColor,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: Colors.white.withValues(alpha: 0.1),
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: Colors.white.withValues(alpha: 0.1),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppTheme.primaryColor),
            ),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return AppLocalizations.of(
                context,
              )!.converterRegRequiredValidation;
            }
            return null;
          },
        ),
      ],
    );
  }
}

class _CategoryOption {
  final String value;
  final String display;

  const _CategoryOption(this.value, this.display);
}
