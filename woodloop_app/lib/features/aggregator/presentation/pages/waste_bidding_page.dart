import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../bloc/bid_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';
import '../../../shared/presentation/widgets/loading_widget.dart';

/// Aggregator bidding page for placing bids on waste listings.
class WasteBiddingPage extends StatefulWidget {
  const WasteBiddingPage({super.key});
  @override
  State<WasteBiddingPage> createState() => _WasteBiddingPageState();
}

class _WasteBiddingPageState extends State<WasteBiddingPage> {
  final _bidController = TextEditingController(text: '650');
  final _noteController = TextEditingController();

  @override
  void dispose() {
    _bidController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  String? _wasteListingId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Try to get waste_listing_id from extra or query parameters
    if (_wasteListingId == null) {
      final extra = GoRouterState.of(context).extra;
      if (extra is Map<String, dynamic>) {
        _wasteListingId = extra['waste_listing_id'] as String?;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final bloc = getIt<BidBloc>();
        final authState = context.read<AuthBloc>().state;
        String? bidderId;
        if (authState is Authenticated) {
          bidderId = authState.user.id;
        }
        bloc.add(LoadBids(
          wasteListingId: _wasteListingId,
          bidderId: bidderId,
        ));
        return bloc;
      },
      child: Scaffold(
        backgroundColor: AppTheme.background,
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
          ),
          title: const Text(
            'Ajukan Penawaran',
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
          child: BlocConsumer<BidBloc, BidState>(
            listener: (context, state) {
              if (state is BidCreated) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('Penawaran berhasil diajukan!'),
                    backgroundColor: AppTheme.primaryColor,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                );
                // Reload bids
                final authState = context.read<AuthBloc>().state;
                String? bidderId;
                if (authState is Authenticated) {
                  bidderId = authState.user.id;
                }
                context.read<BidBloc>().add(LoadBids(
                      wasteListingId: _wasteListingId,
                      bidderId: bidderId,
                    ));
              }
              if (state is BidError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(state.message),
                    backgroundColor: Colors.redAccent,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                );
              }
            },
            builder: (context, state) {
              return Column(
                children: [
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.all(20),
                      children: [
                        // Listing info card
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.08),
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 72,
                                height: 72,
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor.withValues(
                                      alpha: 0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(
                                  Icons.grain,
                                  color: AppTheme.primaryColor,
                                  size: 32,
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
                                        fontSize: 15,
                                      ),
                                    ),
                                    SizedBox(height: 4),
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.location_on_outlined,
                                          color: Colors.white38,
                                          size: 14,
                                        ),
                                        SizedBox(width: 4),
                                        Text(
                                          'Jepara, Central Java',
                                          style: TextStyle(
                                            color: Colors.white54,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 4),
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.scale_outlined,
                                          color: Colors.white38,
                                          size: 14,
                                        ),
                                        SizedBox(width: 4),
                                        Text(
                                          'Volume: 850 Kg',
                                          style: TextStyle(
                                            color: Colors.white54,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Current highest bid - computed from real bids
                        BlocBuilder<BidBloc, BidState>(
                          builder: (context, state) {
                            double highestAmount = 0;
                            int bidCount = 0;
                            if (state is BidsLoaded) {
                              bidCount = state.bids.length;
                              for (final b in state.bids) {
                                if (b.bidAmount > highestAmount) {
                                  highestAmount = b.bidAmount;
                                }
                              }
                            }
                            return Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    AppTheme.primaryColor.withValues(alpha: 0.12),
                                    AppTheme.primaryColor.withValues(alpha: 0.04),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: AppTheme.primaryColor.withValues(
                                      alpha: 0.2),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: AppTheme.primaryColor.withValues(
                                          alpha: 0.2),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(
                                      Icons.trending_up,
                                      color: AppTheme.primaryColor,
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'Penawaran Tertinggi Saat Ini',
                                          style: TextStyle(
                                            color: Colors.white54,
                                            fontSize: 12,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          'Rp ${highestAmount.toStringAsFixed(0)} /Kg',
                                          style: const TextStyle(
                                            color: AppTheme.primaryColor,
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Column(
                                    children: [
                                      Text(
                                        '$bidCount',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const Text(
                                        'Bids',
                                        style: TextStyle(
                                          color: Colors.white54,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 24),

                        // Bid input
                        const Text(
                          'Harga Penawaran Anda (Rp / Kg)',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _bidController,
                          style: const TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          decoration: InputDecoration(
                            prefixText: 'Rp ',
                            prefixStyle: const TextStyle(
                              color: AppTheme.primaryColor,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                            suffixText: '/ Kg',
                            suffixStyle: const TextStyle(
                              color: Colors.white54,
                              fontSize: 14,
                            ),
                            filled: true,
                            fillColor: AppTheme.surfaceColor,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide(
                                color: AppTheme.primaryColor.withValues(
                                    alpha: 0.3),
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide(
                                color: AppTheme.primaryColor.withValues(
                                    alpha: 0.3),
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: const BorderSide(
                                color: AppTheme.primaryColor,
                                width: 2,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Message
                        const Text(
                          'Catatan (Opsional)',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _noteController,
                          style: const TextStyle(color: Colors.white),
                          maxLines: 3,
                          decoration: InputDecoration(
                            hintText:
                                'Contoh: Bisa ambil langsung hari ini...',
                            hintStyle: const TextStyle(color: Colors.white38),
                            filled: true,
                            fillColor: AppTheme.surfaceColor,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide(
                                color: Colors.white.withValues(alpha: 0.1),
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide(
                                color: Colors.white.withValues(alpha: 0.1),
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: const BorderSide(
                                color: AppTheme.primaryColor,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Active bids list
                        const Text(
                          'Penawaran Aktif',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),

                        // Real bids from BLoC
                        BlocBuilder<BidBloc, BidState>(
                          builder: (context, state) {
                            if (state is BidLoading) {
                              return const Padding(
                                padding: EdgeInsets.all(20),
                                child: LoadingWidget(),
                              );
                            }
                            if (state is BidsLoaded) {
                              if (state.bids.isEmpty) {
                                return const Padding(
                                  padding: EdgeInsets.all(20),
                                  child: Center(
                                    child: Text(
                                      'Belum ada penawaran',
                                      style: TextStyle(
                                        color: Colors.white54,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                                );
                              }
                              return Column(
                                children: state.bids.map((bid) {
                                  final highest = state.bids
                                      .fold<double>(
                                          0,
                                          (max, b) =>
                                              b.bidAmount > max
                                                  ? b.bidAmount
                                                  : max);
                                  final isHighest = bid.bidAmount >= highest;
                                  return Padding(
                                    padding: const EdgeInsets.only(bottom: 8),
                                    child: _buildBidItem(
                                      'Bidder #${bid.bidderId.substring(0, 6)}',
                                      'Rp ${bid.bidAmount.toStringAsFixed(0)}/Kg',
                                      _timeAgo(bid.created),
                                      isHighest,
                                    ),
                                  );
                                }).toList(),
                              );
                            }
                            if (state is BidError) {
                              return Padding(
                                padding: const EdgeInsets.all(20),
                                child: Text(
                                  state.message,
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
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),

                  // Submit button
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceColor,
                      border: Border(
                        top: BorderSide(
                            color: Colors.white.withValues(alpha: 0.08)),
                      ),
                    ),
                    child: SafeArea(
                      child: SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            final amount =
                                double.tryParse(_bidController.text) ?? 0;
                            if (amount <= 0) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: const Text(
                                      'Masukkan harga penawaran yang valid'),
                                  backgroundColor: Colors.redAccent,
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                              );
                              return;
                            }
                            final authState =
                                context.read<AuthBloc>().state;
                            if (authState is Authenticated) {
                              context.read<BidBloc>().add(CreateBid({
                                    'bidder': authState.user.id,
                                    'waste_listing': _wasteListingId ?? '',
                                    'bid_amount': amount,
                                    'message': _noteController.text,
                                    'status': 'pending',
                                  }));
                            }
                          },
                          icon: const Icon(Icons.gavel,
                              color: AppTheme.background),
                          label: const Text(
                            'Ajukan Penawaran',
                            style: TextStyle(
                              color: AppTheme.background,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  String _timeAgo(DateTime dateTime) {
    final diff = DateTime.now().difference(dateTime);
    if (diff.inMinutes < 60) {
      return '${diff.inMinutes}m lalu';
    } else if (diff.inHours < 24) {
      return '${diff.inHours}j lalu';
    } else if (diff.inDays < 7) {
      return '${diff.inDays}h lalu';
    }
    return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
  }

  Widget _buildBidItem(
      String name, String price, String time, bool isHighest) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isHighest
            ? AppTheme.primaryColor.withValues(alpha: 0.08)
            : AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isHighest
              ? AppTheme.primaryColor.withValues(alpha: 0.3)
              : Colors.white.withValues(alpha: 0.05),
        ),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor:
                AppTheme.primaryColor.withValues(alpha: 0.15),
            child: Text(
              name[0],
              style: const TextStyle(
                color: AppTheme.primaryColor,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    if (isHighest) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'Tertinggi',
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  time,
                  style: const TextStyle(color: Colors.white38, fontSize: 11),
                ),
              ],
            ),
          ),
          Text(
            price,
            style: TextStyle(
              color: isHighest ? AppTheme.primaryColor : Colors.white70,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
