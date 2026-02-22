import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class AddGeneratorProductPage extends StatefulWidget {
  const AddGeneratorProductPage({super.key});

  @override
  State<AddGeneratorProductPage> createState() =>
      _AddGeneratorProductPageState();
}

class _AddGeneratorProductPageState extends State<AddGeneratorProductPage> {
  String _selectedCategory = 'Furniture';
  String _selectedWoodSource = '';
  final Set<String> _selectedSpecies = {'Teak (Jati)'};

  final List<String> _categories = ['Furniture', 'Souvenir', 'Decor'];
  final List<String> _woodSpecies = [
    'Teak (Jati)',
    'Mahogany',
    'Pine (Pinus)',
    'Sonokeling',
  ];
  final List<String> _woodSources = [
    'Log #TR-204 – Teak dari Perhutani',
    'Log #TR-198 – Mahogany dari Blora',
    'Log #TR-155 – Pine dari Lembang',
  ];

  // Image placeholder slots
  final List<String?> _images = [null, null, null, null, null];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Tambah Produk Baru',
          style: TextStyle(
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
                  _buildSectionLabel('Foto Produk'),
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
                                color: Colors.white.withValues(alpha: 0.15),
                                style: BorderStyle.solid,
                              ),
                            ),
                            child: hasImage
                                ? null
                                : i == 0
                                ? Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.add_a_photo_outlined,
                                        color: AppTheme.primaryColor,
                                        size: 28,
                                      ),
                                      const SizedBox(height: 6),
                                      const Text(
                                        'Tambah',
                                        style: TextStyle(
                                          color: AppTheme.primaryColor,
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
                  const Text(
                    'Unggah foto berkualitas tinggi. Maks 5 gambar.',
                    style: TextStyle(color: Colors.white38, fontSize: 11),
                  ),
                  const SizedBox(height: 24),

                  // Product Name
                  _buildSectionLabel('Nama Produk'),
                  const SizedBox(height: 8),
                  _buildTextField(
                    hint: 'Contoh: Meja Kopi Kayu Jati Reclaimed',
                  ),
                  const SizedBox(height: 20),

                  // Category
                  _buildSectionLabel('Kategori'),
                  const SizedBox(height: 10),
                  Row(
                    children: _categories
                        .map(
                          (cat) => Expanded(
                            child: GestureDetector(
                              onTap: () =>
                                  setState(() => _selectedCategory = cat),
                              child: Container(
                                margin: EdgeInsets.only(
                                  right: cat != _categories.last ? 10 : 0,
                                ),
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                decoration: BoxDecoration(
                                  color: _selectedCategory == cat
                                      ? AppTheme.primaryColor.withValues(
                                          alpha: 0.1,
                                        )
                                      : AppTheme.surfaceColor,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: _selectedCategory == cat
                                        ? AppTheme.primaryColor
                                        : Colors.white.withValues(alpha: 0.1),
                                  ),
                                ),
                                child: Text(
                                  cat,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: _selectedCategory == cat
                                        ? AppTheme.primaryColor
                                        : Colors.white70,
                                    fontSize: 13,
                                    fontWeight: _selectedCategory == cat
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
                  _buildSectionLabel('Harga'),
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
                        const Expanded(
                          child: TextField(
                            keyboardType: TextInputType.number,
                            style: TextStyle(color: Colors.white),
                            decoration: InputDecoration(
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

                  // Wood Species Used
                  _buildSectionLabel('Jenis Kayu yang Digunakan'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      ..._woodSpecies.map(
                        (sp) => GestureDetector(
                          onTap: () => setState(() {
                            if (_selectedSpecies.contains(sp)) {
                              _selectedSpecies.remove(sp);
                            } else {
                              _selectedSpecies.add(sp);
                            }
                          }),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: _selectedSpecies.contains(sp)
                                  ? AppTheme.primaryColor.withValues(alpha: 0.1)
                                  : AppTheme.surfaceColor,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: _selectedSpecies.contains(sp)
                                    ? AppTheme.primaryColor
                                    : Colors.white.withValues(alpha: 0.15),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  sp,
                                  style: TextStyle(
                                    color: _selectedSpecies.contains(sp)
                                        ? AppTheme.primaryColor
                                        : Colors.white70,
                                    fontSize: 12,
                                    fontWeight: _selectedSpecies.contains(sp)
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                  ),
                                ),
                                if (_selectedSpecies.contains(sp)) ...[
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
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.add, color: Colors.white38, size: 14),
                              SizedBox(width: 4),
                              Text(
                                'Lainnya',
                                style: TextStyle(
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
                  _buildSectionLabel('Deskripsi'),
                  const SizedBox(height: 8),
                  _buildTextField(
                    hint:
                        'Deskripsikan keahlian pengerjaan, finishing, dan dimensi...',
                    maxLines: 4,
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
                            const Text(
                              'Sumber Kayu',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Pilih dari Riwayat Pembelian',
                          style: TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          decoration: BoxDecoration(
                            color: AppTheme.background,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.1),
                            ),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _selectedWoodSource.isEmpty
                                  ? null
                                  : _selectedWoodSource,
                              hint: const Text(
                                'Pilih sumber kayu...',
                                style: TextStyle(color: Colors.white54),
                              ),
                              isExpanded: true,
                              dropdownColor: AppTheme.surfaceColor,
                              iconEnabledColor: Colors.white54,
                              style: const TextStyle(color: Colors.white),
                              items: _woodSources
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
                            label: const Text(
                              'Tambah Sumber Manual',
                              style: TextStyle(
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
            top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
          ),
        ),
        child: SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Produk berhasil diterbitkan ke Marketplace!'),
                ),
              );
              context.pop();
            },
            icon: const Icon(Icons.storefront, size: 20),
            label: const Text(
              'Terbitkan ke Marketplace',
              style: TextStyle(
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

  Widget _buildTextField({required String hint, int maxLines = 1}) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: TextField(
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
