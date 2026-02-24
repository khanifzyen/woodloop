import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class DesignerConsultantProfilePage extends StatelessWidget {
  const DesignerConsultantProfilePage({super.key});

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
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.share_outlined), onPressed: () {}),
        ],
      ),
      extendBodyBehindAppBar: true,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Cover Image
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                image: const DecorationImage(
                  image: AssetImage(
                    'assets/images/map_jepara.jpg',
                  ), // Placeholder
                  fit: BoxFit.cover,
                ),
                color: AppTheme.surfaceColor,
              ),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, AppTheme.background],
                    stops: const [0.5, 1.0],
                  ),
                ),
              ),
            ),

            // Profile Info
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppTheme.primaryColor,
                            width: 2,
                          ),
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.person,
                            color: Colors.white70,
                            size: 40,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Jepara Eco Art',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(
                                  Icons.star,
                                  color: Colors.orange,
                                  size: 16,
                                ),
                                const SizedBox(width: 4),
                                const Text(
                                  '4.9',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  l10n.designerReviews('120'),
                                  style: const TextStyle(color: Colors.white54),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Spesialis memadukan limbah palet jati dengan resin epoxy untuk furnitur modern minimalis. Berpengalaman 5 tahun dalam upcycle kayu.',
                    style: TextStyle(color: Colors.white70, height: 1.5),
                  ),
                  const SizedBox(height: 24),

                  // Stats
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatItem(l10n.designerStatProducts, '45'),
                      ),
                      Container(width: 1, height: 30, color: Colors.white10),
                      Expanded(
                        child: _buildStatItem(
                          l10n.designerStatSaved,
                          '2.5 Ton',
                        ),
                      ),
                      Container(width: 1, height: 30, color: Colors.white10),
                      Expanded(
                        child: _buildStatItem(
                          l10n.designerStatCustomProjects,
                          '12',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Actions
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            context.pushNamed('direct_message_conversation');
                          },
                          icon: const Icon(
                            Icons.chat_bubble_outline,
                            color: AppTheme.background,
                            size: 18,
                          ),
                          label: Text(
                            l10n.designerConsultButton,
                            style: const TextStyle(
                              color: AppTheme.background,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                        child: IconButton(
                          icon: const Icon(
                            Icons.bookmark_border,
                            color: Colors.white,
                          ),
                          onPressed: () {},
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Portfolio Grid Header
                  Text(
                    l10n.designerPortfolioTitle,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),

            // Grid
            GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.0, // Square cells
              ),
              itemCount: 4, // Mock
              itemBuilder: (context, index) {
                return Container(
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceColor,
                    borderRadius: BorderRadius.circular(16),
                    image: const DecorationImage(
                      image: AssetImage(
                        'assets/images/map_jepara.jpg',
                      ), // Placeholder
                      fit: BoxFit.cover,
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(color: Colors.white54, fontSize: 12),
        ),
      ],
    );
  }
}
