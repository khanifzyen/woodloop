import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class CreateUpcycledProductFormPage extends StatefulWidget {
  const CreateUpcycledProductFormPage({super.key});

  @override
  State<CreateUpcycledProductFormPage> createState() =>
      _CreateUpcycledProductFormPageState();
}

class _CreateUpcycledProductFormPageState
    extends State<CreateUpcycledProductFormPage> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
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
                                    color: AppTheme.primaryColor.withValues(
                                      alpha: 0.8,
                                    ),
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
                                  color: Colors.white.withValues(alpha: 0.1),
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

                      // Input Fields
                      // Input Fields
                      _buildInputField(
                        label: l10n.converterAddProductName,
                        hint: l10n.converterAddProductNameHint,
                      ),
                      const SizedBox(height: 20),
                      _buildInputField(
                        label: l10n.converterAddProductDesc,
                        hint: l10n.converterAddProductDescHint,
                        maxLines: 4,
                      ),
                      const SizedBox(height: 20),
                      _buildInputField(
                        label: l10n.converterAddProductPrice,
                        hint: l10n.converterAddProductPriceHint,
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 20),
                      _buildInputField(
                        label: l10n.converterAddProductStock,
                        hint: l10n.converterAddProductStockHint,
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 32),

                      // Material Source Tracking
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
                                const Icon(
                                  Icons.receipt_long,
                                  color: AppTheme.primaryColor,
                                  size: 20,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  l10n.converterAddProductTraceability,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              l10n.converterAddProductTraceabilityDesc,
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 12,
                                height: 1.5,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 12,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.05),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.1),
                                ),
                              ),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    l10n.converterAddProductSelectTransaction,
                                    style: const TextStyle(
                                      color: Colors.white54,
                                    ),
                                  ),
                                  const Icon(
                                    Icons.arrow_drop_down,
                                    color: Colors.white54,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 48), // Bottom padding
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
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
                ),
              ),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      // Navigate back to catalog
                      context.pop();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: Text(
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
  }

  Widget _buildInputField({
    required String label,
    required String hint,
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
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
              )!.converterRegRequiredValidation; // reusing required validation from previous translation
            }
            return null;
          },
        ),
      ],
    );
  }
}
