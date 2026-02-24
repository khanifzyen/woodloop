import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class YourShoppingCartPage extends StatelessWidget {
  const YourShoppingCartPage({super.key});

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
          l10n.buyerCartTitle,
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
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  _buildCartStoreHeader(l10n.buyerCartMockStore1),
                  _buildCartItem(
                    title: l10n.buyerCartMockProduct1,
                    price: 'Rp 450.000',
                    quantity: 1,
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                  const SizedBox(height: 16),

                  _buildCartStoreHeader(l10n.buyerCartMockStore2),
                  _buildCartItem(
                    title: l10n.buyerCartMockProduct2,
                    price: 'Rp 120.000',
                    quantity: 2,
                    imageUrl: 'assets/images/map_jepara.jpg',
                  ),
                ],
              ),
            ),

            // Checkout Bottom Sheet Area
            Container(
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(32),
                  topRight: Radius.circular(32),
                ),
                border: Border(
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
                ),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        l10n.buyerCartTotalItems('3'),
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                        ),
                      ),
                      const Text(
                        'Rp 690.000',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.eco,
                            color: AppTheme.primaryColor,
                            size: 16,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            l10n.buyerCartTotalImpact,
                            style: const TextStyle(
                              color: AppTheme.primaryColor,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        l10n.buyerCartTotalImpactValueMock,
                        style: const TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () =>
                          context.pushNamed('secure_checkout_payment'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      child: Text(
                        l10n.buyerCartBtnCheckout,
                        style: const TextStyle(
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
          ],
        ),
      ),
    );
  }

  Widget _buildCartStoreHeader(String storeName) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0, top: 8.0),
      child: Row(
        children: [
          const Icon(Icons.storefront, color: Colors.white54, size: 18),
          const SizedBox(width: 8),
          Text(
            storeName,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCartItem({
    required String title,
    required String price,
    required int quantity,
    required String imageUrl,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          // Checkbox (Visual only)
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: AppTheme.primaryColor,
              borderRadius: BorderRadius.circular(6),
            ),
            child: const Icon(
              Icons.check,
              color: AppTheme.background,
              size: 16,
            ),
          ),
          const SizedBox(width: 12),

          // Image
          Container(
            width: 70,
            height: 70,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              image: DecorationImage(
                image: AssetImage(imageUrl),
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(width: 12),

          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      price,
                      style: const TextStyle(
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    // Quantity Control
                    Container(
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8.0),
                            child: Icon(
                              Icons.remove,
                              color: Colors.white54,
                              size: 16,
                            ),
                          ),
                          Text(
                            quantity.toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8.0),
                            child: Icon(
                              Icons.add,
                              color: AppTheme.primaryColor,
                              size: 16,
                            ),
                          ),
                        ],
                      ),
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
