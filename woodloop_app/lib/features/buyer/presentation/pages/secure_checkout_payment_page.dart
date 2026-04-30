import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../presentation/bloc/cart_bloc.dart';
import '../../presentation/bloc/order_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';

class SecureCheckoutPaymentPage extends StatefulWidget {
  const SecureCheckoutPaymentPage({super.key});

  @override
  State<SecureCheckoutPaymentPage> createState() =>
      _SecureCheckoutPaymentPageState();
}

class _SecureCheckoutPaymentPageState extends State<SecureCheckoutPaymentPage> {
  String _selectedPaymentMethod = 'BCA Virtual Account';
  bool _isCreatingOrder = false;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) {
            final bloc = getIt<CartBloc>();
            final authState = context.read<AuthBloc>().state;
            if (authState is Authenticated) {
              bloc.add(LoadCart(authState.user.id));
            }
            return bloc;
          },
        ),
        BlocProvider(create: (context) => getIt<OrderBloc>()),
      ],
      child: BlocListener<OrderBloc, OrderState>(
        listener: (context, state) {
          if (state is OrderCreated) {
            setState(() => _isCreatingOrder = false);
            context.go('/order-tracking-journey', extra: state.order.id);
          }
          if (state is OrderError) {
            setState(() => _isCreatingOrder = false);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.redAccent,
              ),
            );
          }
          if (state is OrderLoading) {
            setState(() => _isCreatingOrder = true);
          }
        },
        child: _buildCheckoutContent(l10n),
      ),
    );
  }

  Widget _buildCheckoutContent(AppLocalizations l10n) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.buyerCheckoutTitle,
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
      body: Stack(
        children: [
          SafeArea(
            child: Column(
              children: [
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(24.0),
                    children: [
                      // Alamat Pengiriman
                      BlocBuilder<AuthBloc, AuthState>(
                        builder: (context, authState) {
                          final user = authState is Authenticated
                              ? authState.user
                              : null;
                          final userName = user?.name ?? '-';
                          final userPhone = user?.phone ?? '';
                          final userAddress = user?.address ??
                              'Alamat belum diatur';

                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Icon(
                                    Icons.location_on_outlined,
                                    color: AppTheme.primaryColor,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    l10n.buyerCheckoutShippingAddress,
                                    style: const TextStyle(
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
                                    color:
                                        Colors.white.withValues(alpha: 0.1),
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          userPhone.isNotEmpty
                                              ? '$userName | $userPhone'
                                              : userName,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Text(
                                          l10n.buyerCheckoutBtnChange,
                                          style: const TextStyle(
                                            color: AppTheme.primaryColor,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      userAddress,
                                      style: const TextStyle(
                                        color: Colors.white54,
                                        height: 1.5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                      const SizedBox(height: 32),

                      // Rincian Pesanan
                      Row(
                        children: [
                          const Icon(
                            Icons.receipt_long_outlined,
                            color: AppTheme.primaryColor,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            l10n.buyerCheckoutOrderDetails,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      BlocBuilder<CartBloc, CartState>(
                        builder: (context, cartState) {
                          if (cartState is CartLoading) {
                            return Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppTheme.surfaceColor,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color:
                                      Colors.white.withValues(alpha: 0.1),
                                ),
                              ),
                              child: const Center(
                                child: SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    color: AppTheme.primaryColor,
                                    strokeWidth: 2,
                                  ),
                                ),
                              ),
                            );
                          }
                          if (cartState is CartLoaded) {
                            final items = cartState.items;
                            final totalPrice = cartState.totalPrice;
                            const shippingFee = 150000.0; // Fixed shipping fee

                            return Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppTheme.surfaceColor,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: Colors.white
                                      .withValues(alpha: 0.1),
                                ),
                              ),
                              child: Column(
                                children: [
                                  ...items.map(
                                    (item) => Padding(
                                      padding: const EdgeInsets.only(
                                          bottom: 12),
                                      child: _buildOrderItem(
                                        item.productName ??
                                            'Produk',
                                        '${item.quantity}x',
                                        'Rp ${(item.productPrice ?? 0).toStringAsFixed(0)}',
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  const Divider(color: Colors.white10),
                                  const SizedBox(height: 16),
                                  _buildOrderSummaryRow(
                                    l10n.buyerCheckoutSubtotal,
                                    'Rp ${totalPrice.toStringAsFixed(0)}',
                                  ),
                                  const SizedBox(height: 8),
                                  _buildOrderSummaryRow(
                                    l10n.buyerCheckoutShippingFee,
                                    'Rp ${shippingFee.toStringAsFixed(0)}',
                                  ),
                                ],
                              ),
                            );
                          }
                          if (cartState is CartError) {
                            return Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppTheme.surfaceColor,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color:
                                      Colors.white.withValues(alpha: 0.1),
                                ),
                              ),
                              child: Text(
                                cartState.message,
                                style: const TextStyle(
                                  color: Colors.redAccent,
                                  fontSize: 12,
                                ),
                              ),
                            );
                          }
                          return const SizedBox.shrink();
                        },
                      ),
                      const SizedBox(height: 32),

                      // Metode Pembayaran
                      Row(
                        children: [
                          const Icon(
                            Icons.payment_outlined,
                            color: AppTheme.primaryColor,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            l10n.buyerCheckoutPaymentMethod,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      _buildPaymentMethodOption(
                        l10n.buyerCheckoutPaymentBCA,
                        Icons.account_balance,
                      ),
                      const SizedBox(height: 12),
                      _buildPaymentMethodOption(
                        l10n.buyerCheckoutPaymentQRIS,
                        Icons.qr_code_2,
                      ),
                      const SizedBox(height: 12),
                      _buildPaymentMethodOption(
                        l10n.buyerCheckoutPaymentCard,
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
                      top: BorderSide(
                          color: Colors.white.withValues(alpha: 0.05)),
                    ),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      BlocBuilder<CartBloc, CartState>(
                        builder: (context, cartState) {
                          final totalPrice = cartState is CartLoaded
                              ? cartState.totalPrice + 150000.0
                              : 0.0;
                          return Row(
                            mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                l10n.buyerCheckoutTotal,
                                style: const TextStyle(
                                  color: Colors.white54,
                                  fontSize: 14,
                                ),
                              ),
                              Text(
                                'Rp ${totalPrice.toStringAsFixed(0)}',
                                style: const TextStyle(
                                  color: AppTheme.primaryColor,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: _isCreatingOrder
                              ? null
                              : () => _createOrder(context),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            elevation: 0,
                          ),
                          child: _isCreatingOrder
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    color: AppTheme.background,
                                    strokeWidth: 2,
                                  ),
                                )
                              : Text(
                                  l10n.buyerCheckoutBtnPay,
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
        ],
      ),
    );
  }

  void _createOrder(BuildContext context) {
    final authState = context.read<AuthBloc>().state;
    final cartState = context.read<CartBloc>().state;

    if (authState is! Authenticated || cartState is! CartLoaded) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Silakan login terlebih dahulu'),
          backgroundColor: Colors.orangeAccent,
        ),
      );
      return;
    }

    final items = cartState.items;
    if (items.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Keranjang belanja kosong'),
          backgroundColor: Colors.orangeAccent,
        ),
      );
      return;
    }

    final user = authState.user;
    final firstItem = items.first;

    // Map payment method to PocketBase-compatible value
    String paymentMethodValue;
    if (_selectedPaymentMethod.contains('QRIS')) {
      paymentMethodValue = 'qris';
    } else if (_selectedPaymentMethod.contains('Card') ||
        _selectedPaymentMethod.contains('Kartu')) {
      paymentMethodValue = 'card';
    } else {
      paymentMethodValue = 'bank_transfer';
    }

    final body = <String, dynamic>{
      'buyer': user.id,
      'product': firstItem.productId,
      'quantity': items.fold<int>(
          0, (sum, item) => sum + item.quantity),
      'total_price': cartState.totalPrice + 150000.0, // including shipping
      'shipping_address': user.address ?? '',
      'status': 'payment_pending',
      'payment_method': paymentMethodValue,
    };

    context.read<OrderBloc>().add(CreateOrder(body));
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
                  fontWeight:
                      isSelected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: AppTheme.primaryColor)
            else
              const Icon(Icons.radio_button_unchecked,
                  color: Colors.white24),
          ],
        ),
      ),
    );
  }
}
