import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class AddGeneratorProductPage extends StatelessWidget {
  const AddGeneratorProductPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Tambah Produk',
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Detail Produk',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            _buildInputField(
              label: 'Nama Produk',
              hint: 'Contoh: Serbuk Kayu Mahoni',
            ),
            const SizedBox(height: 16),
            _buildInputField(
              label: 'Kategori',
              hint: 'Pilih Kategori',
              isDropdown: true,
            ),
            const SizedBox(height: 16),
            _buildInputField(
              label: 'Harga (Rp)',
              hint: '0',
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            _buildInputField(
              label: 'Stok',
              hint: 'Kuantitas tersedia',
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            _buildInputField(
              label: 'Deskripsi',
              hint: 'Deskripsikan kondisi produk...',
              maxLines: 4,
            ),
            const SizedBox(height: 16),
            // Upload Photo Placeholder
            const Text(
              'Foto Produk',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              height: 120,
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.add_a_photo_outlined,
                    color: Colors.white54,
                    size: 32,
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Unggah Foto (Maks 5MB)',
                    style: TextStyle(color: Colors.white54, fontSize: 12),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  // Simulate upload then pop
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Produk berhasil ditambahkan'),
                    ),
                  );
                  context.pop();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Simpan Produk',
                  style: TextStyle(
                    color: AppTheme.background,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
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
    bool isDropdown = false,
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
          ),
          child: isDropdown
              ? ListTile(
                  title: Text(
                    hint,
                    style: const TextStyle(color: Colors.white38),
                  ),
                  trailing: const Icon(
                    Icons.keyboard_arrow_down,
                    color: Colors.white38,
                  ),
                )
              : TextField(
                  maxLines: maxLines,
                  keyboardType: keyboardType,
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
        ),
      ],
    );
  }
}
