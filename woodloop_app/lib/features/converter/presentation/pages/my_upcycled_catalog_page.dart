import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class MyUpcycledCatalogPage extends StatelessWidget {
  const MyUpcycledCatalogPage({super.key});

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
          l10n.converterCatalogTitle,
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
            // Status Summary
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 8.0,
              ),
              child: Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard(
                      '12',
                      l10n.converterCatalogStatusActive,
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      '3',
                      l10n.converterCatalogStatusSoldOut,
                      Colors.orange,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Item Grid
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.75, // Adjust height-width ratio
                children: [
                  _buildCatalogGridItem(
                    context: context,
                    title: l10n.converterCatalogMockTitle1,
                    price: 'Rp 450.000',
                    stock: l10n.converterCatalogStock('5'),
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                  _buildCatalogGridItem(
                    context: context,
                    title: l10n.converterCatalogMockTitle2,
                    price: 'Rp 1.200.000',
                    stock: l10n.converterCatalogStock('2'),
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                  _buildCatalogGridItem(
                    context: context,
                    title: l10n.converterCatalogMockTitle3,
                    price: 'Rp 45.000',
                    stock: l10n.converterCatalogStock('12'),
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                  _buildCatalogGridItem(
                    context: context,
                    title: l10n.converterCatalogMockTitle4,
                    price: 'Rp 180.000',
                    stock: l10n.converterCatalogStock('0'),
                    isSoldOut: true,
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          context.pushNamed('create_upcycled_product');
        },
        backgroundColor: AppTheme.primaryColor,
        icon: const Icon(Icons.add, color: AppTheme.background),
        label: Text(
          l10n.converterCatalogBtnAdd,
          style: const TextStyle(
            color: AppTheme.background,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryCard(String count, String label, Color indicatorColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: indicatorColor,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                count,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(color: Colors.white54, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildCatalogGridItem({
    required BuildContext context,
    required String title,
    required String price,
    required String stock,
    required String imageUrl,
    bool isSoldOut = false,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(20),
                  topRight: Radius.circular(20),
                ),
                image: DecorationImage(
                  image: AssetImage(imageUrl),
                  fit: BoxFit.cover,
                  colorFilter: isSoldOut
                      ? ColorFilter.mode(
                          Colors.black.withValues(alpha: 0.6),
                          BlendMode.darken,
                        )
                      : null,
                ),
              ),
              child: isSoldOut
                  ? Center(
                      child: Text(
                        AppLocalizations.of(
                          context,
                        )!.converterCatalogStatusSoldOutBadge,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 2,
                        ),
                      ),
                    )
                  : null,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  price,
                  style: TextStyle(
                    color: isSoldOut ? Colors.white54 : AppTheme.primaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      stock,
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                    const Icon(
                      Icons.edit_outlined,
                      color: Colors.white54,
                      size: 16,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
