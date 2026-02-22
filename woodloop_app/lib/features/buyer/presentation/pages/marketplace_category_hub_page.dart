import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class MarketplaceCategoryHubPage extends StatelessWidget {
  const MarketplaceCategoryHubPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Kategori Produk',
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
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            _buildCategoryBanner(
              context: context,
              title: 'Furnitur Besar',
              subtitle:
                  'Sofa, Meja Makan, Lemari dari sisa log dan palet pilihan.',
              icon: Icons.chair_alt,
              color: AppTheme.primaryColor,
              imageUrl: 'assets/images/map_jepara.jpg',
            ),
            const SizedBox(height: 16),
            _buildCategoryBanner(
              context: context,
              title: 'Dekorasi & Kerajinan',
              subtitle: 'Panel dinding, jam meja, ornamen dari potongan kayu.',
              icon: Icons.format_paint_outlined,
              color: Colors.orange,
              imageUrl: 'assets/images/map_jepara.jpg',
            ),
            const SizedBox(height: 16),
            _buildCategoryBanner(
              context: context,
              title: 'Komposit Resin & Serbuk',
              subtitle: 'Tatakan gelas, asbak, meja resin transparan inovatif.',
              icon: Icons.grain,
              color: Colors.blue,
              imageUrl: 'assets/images/map_jepara.jpg',
            ),
            const SizedBox(height: 16),
            _buildCategoryBanner(
              context: context,
              title: 'Aksesoris Harian',
              subtitle: 'Gantungan kunci, penyangga HP, rak buku portabel.',
              icon: Icons.watch_outlined,
              color: Colors.pink,
              imageUrl: 'assets/images/map_jepara.jpg',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryBanner({
    required BuildContext context,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required String imageUrl,
  }) {
    return GestureDetector(
      onTap: () {
        // Typically would pass category ID back or route to filtered view
        context.pop();
      },
      child: Container(
        constraints: const BoxConstraints(minHeight: 160),
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              flex: 3,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(icon, color: color, size: 24),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
              flex: 2,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(24),
                    bottomRight: Radius.circular(24),
                  ),
                  image: DecorationImage(
                    image: AssetImage(imageUrl), // Placeholder
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
