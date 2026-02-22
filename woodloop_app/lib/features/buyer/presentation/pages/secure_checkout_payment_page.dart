import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class SecureCheckoutPaymentPage extends StatefulWidget {
  const SecureCheckoutPaymentPage({super.key});

  @override
  State<SecureCheckoutPaymentPage> createState() =>
      _SecureCheckoutPaymentPageState();
}

class _SecureCheckoutPaymentPageState extends State<SecureCheckoutPaymentPage> {
  String _selectedPaymentMethod = 'Virtual Account BCA';

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
          'Checkout',
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
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(24.0),
                children: [
                  // Alamat Pengiriman
                  const Row(
                    children: [
                      Icon(
                        Icons.location_on_outlined,
                        color: AppTheme.primaryColor,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Alamat Pengiriman',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Sarah Wijaya | 081234567890',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Ubah',
                              style: TextStyle(
                                color: AppTheme.primaryColor,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Jl. Jend. Sudirman No. 45, Gedung Graha Lantai 12\nJakarta Pusat, 10210\nIndonesia',
                          style: TextStyle(color: Colors.white54, height: 1.5),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Rincian Pesanan
                  const Row(
                    children: [
                      Icon(
                        Icons.receipt_long_outlined,
                        color: AppTheme.primaryColor,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Rincian Pesanan',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Column(
                      children: [
                        _buildOrderItem(
                          'Kursi Palet Estetik',
                          '1x',
                          'Rp 450.000',
                        ),
                        const SizedBox(height: 12),
                        _buildOrderItem(
                          'Tatakan Gelas Resin Set 4',
                          '2x',
                          'Rp 240.000',
                        ),
                        const SizedBox(height: 16),
                        const Divider(color: Colors.white10),
                        const SizedBox(height: 16),
                        _buildOrderSummaryRow('Subtotal', 'Rp 690.000'),
                        const SizedBox(height: 8),
                        _buildOrderSummaryRow('Biaya Pengiriman', 'Rp 150.000'),
                        const SizedBox(height: 8),
                        _buildOrderSummaryRow(
                          'Diskon Eco-Warrior',
                          '- Rp 25.000',
                          color: AppTheme.primaryColor,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Metode Pembayaran
                  const Row(
                    children: [
                      Icon(
                        Icons.payment_outlined,
                        color: AppTheme.primaryColor,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Metode Pembayaran',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildPaymentMethodOption(
                    'Virtual Account BCA',
                    Icons.account_balance,
                  ),
                  const SizedBox(height: 12),
                  _buildPaymentMethodOption('QRIS', Icons.qr_code_2),
                  const SizedBox(height: 12),
                  _buildPaymentMethodOption(
                    'Kartu Kredit / Debit',
                    Icons.credit_card,
                  ),

                  const SizedBox(height: 48), // Bottom Padding
                ],
              ),
            ),

            // Checkout Button Area
            Container(
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                color: AppTheme.background,
                border: Border(
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
                ),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Total Belanja',
                        style: TextStyle(color: Colors.white54, fontSize: 14),
                      ),
                      Text(
                        'Rp 815.000',
                        style: TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 18,
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
                      onPressed: () {
                        // After success payment, normally show success screen, then to track order
                        context.go('/order-tracking-journey');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Bayar Sekarang',
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
          ],
        ),
      ),
    );
  }

  Widget _buildOrderItem(String title, String qty, String price) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                qty,
                style: const TextStyle(
                  color: Colors.white54,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(color: Colors.white),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
        Text(
          price,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildOrderSummaryRow(String label, String value, {Color? color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.white54)),
        Text(
          value,
          style: TextStyle(
            color: color ?? Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildPaymentMethodOption(String title, IconData icon) {
    bool isSelected = _selectedPaymentMethod == title;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedPaymentMethod = title;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor.withValues(alpha: 0.1)
              : AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected
                ? AppTheme.primaryColor
                : Colors.white.withValues(alpha: 0.1),
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? AppTheme.primaryColor : Colors.white54,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  color: isSelected ? AppTheme.primaryColor : Colors.white,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: AppTheme.primaryColor)
            else
              const Icon(Icons.radio_button_unchecked, color: Colors.white24),
          ],
        ),
      ),
    );
  }
}
