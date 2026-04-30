import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../bloc/generator_product_bloc.dart';
import '../../../../injection_container.dart';

class AddGeneratorProductPage extends StatefulWidget {
  const AddGeneratorProductPage({super.key});

  @override
  State<AddGeneratorProductPage> createState() =>
      _AddGeneratorProductPageState();
}

class _AddGeneratorProductPageState extends State<AddGeneratorProductPage> {
  final _nameController = TextEditingController();
  final _priceController = TextEditingController();
  final _descController = TextEditingController();
  final _stockController = TextEditingController();

  String? _selectedCategory;
  String? _selectedWoodSource;
  Set<String>? _selectedSpecies;

  // Category options matching PocketBase generator_products schema values
  final List<_CategoryOption> _categories = [
    _CategoryOption('furniture', 'Furniture'),
    _CategoryOption('custom_order', 'Custom Order'),
    _CategoryOption('raw_material', 'Raw Material'),
    _CategoryOption('other', 'Other'),
  ];

  // Image placeholder slots
  final List<String?> _images = [null, null, null, null, null];

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    _descController.dispose();
    _stockController.dispose();
    super.dispose();
  }

  void _onSubmit() {
    if (_nameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Product name is required')),
      );
      return;
    }

    final authState = context.read<AuthBloc>().state;
    String? generatorId;
    if (authState is Authenticated) {
      generatorId = authState.user.id;
    }

    if (generatorId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('User not authenticated')),
      );
      return;
    }

    final l10n = AppLocalizations.of(context)!;
    final body = {
      'generator': generatorId,
      'name': _nameController.text.trim(),
      'description': _descController.text.trim(),
      'category': _selectedCategory ?? 'furniture',
      'price': double.tryParse(_priceController.text.trim()) ?? 0,
      'stock': int.tryParse(_stockController.text.trim()) ?? 0,
      'status': 'active',
    };

    context.read<GeneratorProductBloc>().add(CreateGeneratorProduct(body));
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    _selectedCategory ??= _categories.first.value;
    _selectedSpecies ??= {l10n.generatorAddSpeciesTeak};

    final List<String> woodSpecies = [
      l10n.generatorAddSpeciesTeak,
      l10n.generatorAddSpeciesMahogany,
      l10n.generatorAddSpeciesPine,
      l10n.generatorAddSpeciesSonokeling,
    ];
    final List<String> woodSources = [
      l10n.generatorAddSourceMock1,
      l10n.generatorAddSourceMock2,
      l10n.generatorAddSourceMock3,
    ];

    return BlocProvider(
      create: (context) => getIt<GeneratorProductBloc>(),
      child: BlocConsumer<GeneratorProductBloc, GeneratorProductState>(
        listener: (context, state) {
          if (state is GeneratorProductCreated) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(l10n.generatorAddProductSuccessMsg),
                backgroundColor: Colors.green,
              ),
            );
            context.pop();
          } else if (state is GeneratorProductError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.redAccent,
              ),
            );
          }
        },
        builder: (context, state) {
          final isLoading = state is GeneratorProductLoading;

          return Scaffold(
            backgroundColor: AppTheme.background,
            appBar: AppBar(
              leading: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => context.pop(),
              ),
              title: Text(
                l10n.generatorAddProductTitle,
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
            body: Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Photo Upload Section
                        _buildSectionLabel(l10n.generatorAddProductPhoto),
                        const SizedBox(height: 8),
                        SizedBox(
                          height: 100,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: 5,
                            itemBuilder: (context, i) {
                              final hasImage = _images[i] != null;
                              return GestureDetector(
                                onTap: () {
                                  // Future: open image picker
                                },
                                child: Container(
                                  width: 100,
                                  margin: const EdgeInsets.only(right: 12),
                                  decoration: BoxDecoration(
                                    color: hasImage
                                        ? null
                                        : AppTheme.surfaceColor.withValues(
                                            alpha: 0.5,
                                          ),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: Colors.white.withValues(
                                        alpha: 0.15,
                                      ),
                                      style: BorderStyle.solid,
                                    ),
                                  ),
                                  child: hasImage
                                      ? null
                                      : i == 0
                                          ? Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                Icon(
                                                  Icons.add_a_photo_outlined,
                                                  color: AppTheme.primaryColor,
                                                  size: 28,
                                                ),
                                                const SizedBox(height: 6),
                                                Text(
                                                  l10n
                                                      .generatorAddProductAddPhotoBtn,
                                                  style: const TextStyle(
                                                    color:
                                                        AppTheme.primaryColor,
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ],
                                            )
                                          : null,
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          l10n.generatorAddProductPhotoHint,
                          style: const TextStyle(
                              color: Colors.white38, fontSize: 11),
                        ),
                        const SizedBox(height: 24),

                        // Product Name
                        _buildSectionLabel(l10n.generatorAddProductName),
                        const SizedBox(height: 8),
                        _buildTextField(
                          hint: l10n.generatorAddProductNameHint,
                          controller: _nameController,
                        ),
                        const SizedBox(height: 20),

                        // Category
                        _buildSectionLabel(l10n.generatorAddProductCategory),
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
                                            ? 10
                                            : 0,
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 12,
                                      ),
                                      decoration: BoxDecoration(
                                        color: _selectedCategory == cat.value
                                            ? AppTheme.primaryColor.withValues(
                                                alpha: 0.1,
                                              )
                                            : AppTheme.surfaceColor,
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(
                                          color: _selectedCategory == cat.value
                                              ? AppTheme.primaryColor
                                              : Colors.white.withValues(
                                                  alpha: 0.1,
                                                ),
                                        ),
                                      ),
                                      child: Text(
                                        cat.display,
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                          color: _selectedCategory == cat.value
                                              ? AppTheme.primaryColor
                                              : Colors.white70,
                                          fontSize: 13,
                                          fontWeight: _selectedCategory ==
                                                  cat.value
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

                        // Price
                        _buildSectionLabel(l10n.generatorAddProductPrice),
                        const SizedBox(height: 8),
                        Container(
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.1),
                            ),
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
                                  controller: _priceController,
                                  keyboardType: TextInputType.number,
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
                            ],
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Stock
                        _buildSectionLabel('Stock'),
                        const SizedBox(height: 8),
                        _buildTextField(
                          hint: 'Example: 10',
                          keyboardType: TextInputType.number,
                          controller: _stockController,
                        ),
                        const SizedBox(height: 20),

                        // Wood Species Used
                        _buildSectionLabel(
                          l10n.generatorAddProductWoodSpecies,
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            ...woodSpecies.map(
                              (sp) => GestureDetector(
                                onTap: () => setState(() {
                                  if (_selectedSpecies!.contains(sp)) {
                                    _selectedSpecies!.remove(sp);
                                  } else {
                                    _selectedSpecies!.add(sp);
                                  }
                                }),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 14,
                                    vertical: 8,
                                  ),
                                  decoration: BoxDecoration(
                                    color: _selectedSpecies!.contains(sp)
                                        ? AppTheme.primaryColor.withValues(
                                            alpha: 0.1,
                                          )
                                        : AppTheme.surfaceColor,
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: _selectedSpecies!.contains(sp)
                                          ? AppTheme.primaryColor
                                          : Colors.white.withValues(
                                              alpha: 0.15,
                                            ),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        sp,
                                        style: TextStyle(
                                          color: _selectedSpecies!.contains(sp)
                                              ? AppTheme.primaryColor
                                              : Colors.white70,
                                          fontSize: 12,
                                          fontWeight:
                                              _selectedSpecies!.contains(sp)
                                                  ? FontWeight.bold
                                                  : FontWeight.normal,
                                        ),
                                      ),
                                      if (_selectedSpecies!.contains(sp)) ...[
                                        const SizedBox(width: 4),
                                        const Icon(
                                          Icons.check,
                                          color: AppTheme.primaryColor,
                                          size: 14,
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            // "Lainnya" dashed button
                            GestureDetector(
                              onTap: () {},
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 14,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.2),
                                    style: BorderStyle.solid,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                      Icons.add,
                                      color: Colors.white38,
                                      size: 14,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      l10n.generatorAddProductOther,
                                      style: const TextStyle(
                                        color: Colors.white38,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Description
                        _buildSectionLabel(l10n.generatorAddProductDesc),
                        const SizedBox(height: 8),
                        _buildTextField(
                          hint: l10n.generatorAddProductDescHint,
                          maxLines: 4,
                          controller: _descController,
                        ),
                        const SizedBox(height: 20),

                        // Wood Source Section
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor.withValues(alpha: 0.5),
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
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: AppTheme.primaryColor.withValues(
                                        alpha: 0.15,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.forest,
                                      color: AppTheme.primaryColor,
                                      size: 18,
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Text(
                                    l10n.generatorAddProductWoodSource,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                l10n.generatorAddProductWoodSourceSub,
                                style: const TextStyle(
                                  color: Colors.white54,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Container(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 14),
                                decoration: BoxDecoration(
                                  color: AppTheme.background,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.1),
                                  ),
                                ),
                                child: DropdownButtonHideUnderline(
                                  child: DropdownButton<String>(
                                    value: _selectedWoodSource == null ||
                                            _selectedWoodSource!.isEmpty
                                        ? null
                                        : _selectedWoodSource,
                                    hint: Text(
                                      l10n.generatorAddProductWoodSourceHint,
                                      style: const TextStyle(
                                          color: Colors.white54),
                                    ),
                                    isExpanded: true,
                                    dropdownColor: AppTheme.surfaceColor,
                                    iconEnabledColor: Colors.white54,
                                    style: const TextStyle(color: Colors.white),
                                    items: woodSources
                                        .map(
                                          (src) => DropdownMenuItem<String>(
                                            value: src,
                                            child: Text(src),
                                          ),
                                        )
                                        .toList(),
                                    onChanged: (val) => setState(
                                      () => _selectedWoodSource = val ?? '',
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Align(
                                alignment: Alignment.centerRight,
                                child: TextButton.icon(
                                  onPressed: () {},
                                  icon: const Icon(
                                    Icons.add,
                                    color: AppTheme.primaryColor,
                                    size: 14,
                                  ),
                                  label: Text(
                                    l10n.generatorAddProductAddSourceManual,
                                    style: const TextStyle(
                                      color: AppTheme.primaryColor,
                                      fontSize: 11,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 100),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            // Fixed bottom button (Stitch design)
            bottomNavigationBar: Container(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
              decoration: BoxDecoration(
                color: AppTheme.background.withValues(alpha: 0.95),
                border: Border(
                  top: BorderSide(
                    color: Colors.white.withValues(alpha: 0.08),
                  ),
                ),
              ),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: isLoading ? null : _onSubmit,
                  icon: isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            color: AppTheme.background,
                            strokeWidth: 2,
                          ),
                        )
                      : const Icon(Icons.storefront, size: 20),
                  label: Text(
                    l10n.generatorAddProductPublishBtn,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.3,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    foregroundColor: AppTheme.background,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 0,
                    shadowColor: AppTheme.primaryColor.withValues(alpha: 0.4),
                  ),
                ),
              ),
            ),
          );
        },
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

  Widget _buildTextField({
    required String hint,
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
    TextEditingController? controller,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        maxLines: maxLines,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.white38),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 14,
          ),
        ),
      ),
    );
  }
}

class _CategoryOption {
  final String value;
  final String display;

  const _CategoryOption(this.value, this.display);
}
