import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class MarketplaceCategoryHubPage extends StatelessWidget {
  const MarketplaceCategoryHubPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.buyerMarketCatTitle,
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
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            _buildCategoryBanner(
              context: context,
              title: l10n.buyerMarketCat1Title,
              subtitle: l10n.buyerMarketCat1Subtitle,
              icon: Icons.chair_alt,
              color: AppTheme.primaryColor,
              imageUrl: 'assets/images/map_jepara.jpg',
            ),
            const SizedBox(height: 16),
            _buildCategoryBanner(
              context: context,
              title: l10n.buyerMarketCat2Title,
              subtitle: l10n.buyerMarketCat2Subtitle,
              icon: Icons.format_paint_outlined,
              color: Colors.orange,
              imageUrl: 'assets/images/map_jepara.jpg',
            ),
            const SizedBox(height: 16),
            _buildCategoryBanner(
              context: context,
              title: l10n.buyerMarketCat3Title,
              subtitle: l10n.buyerMarketCat3Subtitle,
              icon: Icons.grain,
              color: Colors.blue,
              imageUrl: 'assets/images/map_jepara.jpg',
            ),
            const SizedBox(height: 16),
            _buildCategoryBanner(
              context: context,
              title: l10n.buyerMarketCat4Title,
              subtitle: l10n.buyerMarketCat4Subtitle,
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
        child: IntrinsicHeight(
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
      ),
    );
  }
}
