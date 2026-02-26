import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class WasteCheckoutPage extends StatefulWidget {
  const WasteCheckoutPage({super.key});
  @override
  State<WasteCheckoutPage> createState() => _WasteCheckoutPageState();
}

class _WasteCheckoutPageState extends State<WasteCheckoutPage> {
  double _quantity = 100;
  final double _pricePerKg = 600;
  int _selectedDelivery = 0;
  int _selectedPayment = 0;

  double get _subtotal => _quantity * _pricePerKg;
  double get _deliveryFee => _selectedDelivery == 0 ? 50000 : 0;
  double get _total => _subtotal + _deliveryFee;

  String _fmt(double n) => n.toInt().toString().replaceAllMapped(
    RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
    (m) => '${m[1]}.',
  );

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
          'Checkout Bahan',
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
                padding: const EdgeInsets.all(20),
                children: [
                  // Order Summary
                  _buildSection(
                    children: [
                      const Text(
                        'Ringkasan Pesanan',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              width: 64,
                              height: 64,
                              color: AppTheme.surfaceColor,
                              child: const Icon(
                                Icons.grain,
                                color: AppTheme.primaryColor,
                                size: 28,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Serbuk Kayu Jati Murni',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Budi Logistics (Aggregator)',
                                  style: TextStyle(
                                    color: Colors.white54,
                                    fontSize: 12,
                                  ),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Rp 600 / Kg',
                                  style: TextStyle(
                                    color: AppTheme.primaryColor,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'Kuantitas (Kg)',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              color: AppTheme.background,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.1),
                              ),
                            ),
                            child: Text(
                              '${_quantity.toInt()} Kg',
                              style: const TextStyle(
                                color: AppTheme.primaryColor,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: SliderTheme(
                              data: SliderTheme.of(context).copyWith(
                                activeTrackColor: AppTheme.primaryColor,
                                inactiveTrackColor: Colors.white.withValues(
                                  alpha: 0.1,
                                ),
                                thumbColor: AppTheme.primaryColor,
                              ),
                              child: Slider(
                                value: _quantity,
                                min: 50,
                                max: 850,
                                divisions: 16,
                                onChanged: (v) => setState(() => _quantity = v),
                              ),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        'Stok tersedia: 850 Kg',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.3),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Delivery
                  _buildSection(
                    children: [
                      const Text(
                        'Metode Pengiriman',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildRadioOption(
                        0,
                        _selectedDelivery,
                        Icons.local_shipping,
                        'Antar ke Studio',
                        'Estimasi 1-2 hari (+ Rp 50.000)',
                        (i) => setState(() => _selectedDelivery = i),
                      ),
                      const SizedBox(height: 8),
                      _buildRadioOption(
                        1,
                        _selectedDelivery,
                        Icons.warehouse,
                        'Ambil Sendiri',
                        'Gudang Budi Logistics, Jepara',
                        (i) => setState(() => _selectedDelivery = i),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Payment
                  _buildSection(
                    children: [
                      const Text(
                        'Metode Pembayaran',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildRadioOption(
                        0,
                        _selectedPayment,
                        Icons.account_balance_wallet_outlined,
                        'Saldo WoodLoop',
                        'Saldo: Rp 500.000',
                        (i) => setState(() => _selectedPayment = i),
                      ),
                      const SizedBox(height: 8),
                      _buildRadioOption(
                        1,
                        _selectedPayment,
                        Icons.handshake_outlined,
                        'COD (Bayar di Tempat)',
                        'Bayar saat pengambilan',
                        (i) => setState(() => _selectedPayment = i),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Price
                  _buildSection(
                    children: [
                      _priceRow(
                        'Subtotal (${_quantity.toInt()} Kg)',
                        'Rp ${_fmt(_subtotal)}',
                      ),
                      const SizedBox(height: 8),
                      _priceRow(
                        'Ongkos Kirim',
                        _deliveryFee > 0
                            ? 'Rp ${_fmt(_deliveryFee)}'
                            : 'Gratis',
                      ),
                      const SizedBox(height: 12),
                      Divider(color: Colors.white.withValues(alpha: 0.08)),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Rp ${_fmt(_total)}',
                            style: const TextStyle(
                              color: AppTheme.primaryColor,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),

            // Confirm button
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                border: Border(
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
                ),
              ),
              child: SafeArea(
                child: SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: const Text('Pesanan berhasil dibuat! 🎉'),
                          backgroundColor: AppTheme.primaryColor,
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      );
                      context.pop();
                      context.pop();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.check_circle_outline,
                          color: AppTheme.background,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Konfirmasi Pembelian',
                          style: TextStyle(
                            color: AppTheme.background,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
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

  Widget _buildSection({required List<Widget> children}) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: AppTheme.surfaceColor,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    ),
  );

  Widget _buildRadioOption(
    int index,
    int selected,
    IconData icon,
    String title,
    String subtitle,
    ValueChanged<int> onTap,
  ) {
    final s = selected == index;
    return GestureDetector(
      onTap: () => onTap(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: s
              ? AppTheme.primaryColor.withValues(alpha: 0.08)
              : AppTheme.background,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: s
                ? AppTheme.primaryColor
                : Colors.white.withValues(alpha: 0.1),
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: s ? AppTheme.primaryColor : Colors.white54,
              size: 22,
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: s ? Colors.white : Colors.white70,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Colors.white38, fontSize: 12),
                  ),
                ],
              ),
            ),
            Icon(
              s ? Icons.check_circle : Icons.radio_button_unchecked,
              color: s ? AppTheme.primaryColor : Colors.white24,
              size: 22,
            ),
          ],
        ),
      ),
    );
  }

  Widget _priceRow(String label, String value) => Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      Text(label, style: const TextStyle(color: Colors.white54, fontSize: 14)),
      Text(
        value,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ],
  );
}
