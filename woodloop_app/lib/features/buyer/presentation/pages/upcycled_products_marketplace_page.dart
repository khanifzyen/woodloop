import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class UpcycledProductsMarketplacePage extends StatelessWidget {
  const UpcycledProductsMarketplacePage({super.key});

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
          l10n.buyerUpcycledMarketTitle,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart_outlined),
            onPressed: () => context.pushNamed('your_shopping_cart'),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search & Filter
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 8.0,
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                      child: TextField(
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: l10n.buyerUpcycledMarketSearchHint,
                          hintStyle: const TextStyle(color: Colors.white38),
                          prefixIcon: const Icon(
                            Icons.search,
                            color: Colors.white54,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  GestureDetector(
                    onTap: () => context.pushNamed('marketplace_category_hub'),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.tune, color: AppTheme.background),
                    ),
                  ),
                ],
              ),
            ),

            // Highlight Banner
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(20),
                  image: const DecorationImage(
                    image: AssetImage(
                      'assets/images/map_jepara.jpg',
                    ), // Placeholder
                    fit: BoxFit.cover,
                    opacity: 0.4,
                  ),
                  border: Border.all(
                    color: AppTheme.primaryColor.withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        l10n.buyerUpcycledMarketHighlightNew,
                        style: const TextStyle(
                          color: AppTheme.background,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      l10n.buyerUpcycledMarketHighlightTitle,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      l10n.buyerUpcycledMarketHighlightAction,
                      style: const TextStyle(
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Categories Row
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _buildCategoryChip(l10n.buyerUpcycledMarketCatAll, true),
                  const SizedBox(width: 8),
                  _buildCategoryChip(l10n.buyerUpcycledMarketCatDecor, false),
                  const SizedBox(width: 8),
                  _buildCategoryChip(
                    l10n.buyerUpcycledMarketCatFurniture,
                    false,
                  ),
                  const SizedBox(width: 8),
                  _buildCategoryChip(
                    l10n.buyerUpcycledMarketCatAccessories,
                    false,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Product Grid
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.65, // Taller cards to accommodate text
                children: [
                  _buildProductCard(
                    title: l10n.buyerUpcycledMarketMockTitle1,
                    studio: l10n.buyerUpcycledMarketMockStudio1,
                    price: 'Rp 450.000',
                    impact: l10n.buyerUpcycledMarketMockImpact1,
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                  _buildProductCard(
                    title: l10n.buyerUpcycledMarketMockTitle2,
                    studio: l10n.buyerUpcycledMarketMockStudio2,
                    price: 'Rp 1.250.000',
                    impact: l10n.buyerUpcycledMarketMockImpact2,
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                  _buildProductCard(
                    title: l10n.buyerUpcycledMarketMockTitle3,
                    studio: l10n.buyerUpcycledMarketMockStudio3,
                    price: 'Rp 185.000',
                    impact: l10n.buyerUpcycledMarketMockImpact3,
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                  _buildProductCard(
                    title: l10n.buyerUpcycledMarketMockTitle4,
                    studio: l10n.buyerUpcycledMarketMockStudio4,
                    price: 'Rp 320.000',
                    impact: l10n.buyerUpcycledMarketMockImpact4,
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryChip(String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? AppTheme.primaryColor : Colors.white70,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildProductCard({
    required String title,
    required String studio,
    required String price,
    required String impact,
    required String imageUrl,
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
            flex: 3,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(20),
                  topRight: Radius.circular(20),
                ),
                image: DecorationImage(
                  image: AssetImage(imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          Expanded(
            flex: 4,
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      impact,
                      style: const TextStyle(
                        color: AppTheme.primaryColor,
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    studio,
                    style: const TextStyle(color: Colors.white54, fontSize: 10),
                  ),
                  const Spacer(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        price,
                        style: const TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: AppTheme.primaryColor,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.add,
                          color: AppTheme.background,
                          size: 16,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
