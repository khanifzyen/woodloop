import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class ProductStoryTraceabilityPage extends StatelessWidget {
  const ProductStoryTraceabilityPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 250.0,
            floating: false,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.pop(),
            ),
            backgroundColor: AppTheme.background,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text(
                'Kisah Produk Ini',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.asset(
                    'assets/images/map_jepara.jpg', // Placeholder
                    fit: BoxFit.cover,
                    color: Colors.black.withValues(alpha: 0.5),
                    colorBlendMode: BlendMode.darken,
                  ),
                  const Positioned(
                    bottom: 40,
                    left: 20,
                    child: Text(
                      'Kursi Palet Estetik',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Impact Summary
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        const Column(
                          children: [
                            Text(
                              'Rescued Wood',
                              style: TextStyle(
                                color: Colors.white54,
                                fontSize: 12,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              '12 Kg',
                              style: TextStyle(
                                color: AppTheme.primaryColor,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        Container(width: 1, height: 40, color: Colors.white10),
                        const Column(
                          children: [
                            Text(
                              'CO2 Saved',
                              style: TextStyle(
                                color: Colors.white54,
                                fontSize: 12,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              '8.5 Kg',
                              style: TextStyle(
                                color: AppTheme.primaryColor,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  const Text(
                    'Jejak Perjalanan (Traceability)',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Traceability Timeline
                  _buildTraceabilityStep(
                    title: 'Materi Asal: Palet Jati Bekas',
                    actor: 'Dikumpulkan oleh: Budi Logistics (Aggregator)',
                    date: '28 Okt 2023',
                    location: 'Kec. Tahunan, Jepara',
                    icon: Icons.recycling,
                    isFirst: true,
                  ),
                  _buildTraceabilityStep(
                    title: 'Proses Desain & Produksi',
                    actor: 'Dibuat oleh: Jepara Eco Art (Converter Studio)',
                    date: '05 Nov 2023',
                    location: 'Kec. Jepara, Jepara',
                    icon: Icons.handyman_outlined,
                  ),
                  _buildTraceabilityStep(
                    title: 'Sertifikasi Kualitas Eco',
                    actor: 'Sistem WoodLoop',
                    date: '10 Nov 2023',
                    location: 'Digital',
                    icon: Icons.verified_outlined,
                  ),
                  _buildTraceabilityStep(
                    title: 'Dibeli oleh Anda',
                    actor: 'Sarah Wijaya (Buyer)',
                    date: 'Sekarang',
                    location: '-',
                    icon: Icons.person_outline,
                    isLast: true,
                  ),

                  const SizedBox(height: 48), // Bottom padding
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTraceabilityStep({
    required String title,
    required String actor,
    required String date,
    required String location,
    required IconData icon,
    bool isFirst = false,
    bool isLast = false,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Timeline Line & Node
          Column(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppTheme.primaryColor.withValues(alpha: 0.5),
                  ),
                ),
                child: Center(
                  child: Icon(icon, color: AppTheme.primaryColor, size: 20),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: AppTheme.primaryColor.withValues(alpha: 0.3),
                    margin: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),
          // Content
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : 32.0, top: 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    actor,
                    style: const TextStyle(
                      color: AppTheme.primaryColor,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(
                        Icons.calendar_today,
                        color: Colors.white54,
                        size: 12,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        date,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Icon(
                        Icons.location_on,
                        color: Colors.white54,
                        size: 12,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        location,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 12,
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
