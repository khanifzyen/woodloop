import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class DesignClinicInspirationPage extends StatelessWidget {
  const DesignClinicInspirationPage({super.key});

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
          'Klinik Desain & Inspirasi',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.bookmark_border), onPressed: () {}),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Featured Tab / Filter
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                children: [
                  _buildTab('Tren Global', true),
                  const SizedBox(width: 8),
                  _buildTab('Ide dari Pallet', false),
                  const SizedBox(width: 8),
                  _buildTab('Serbuk & Resin', false),
                  const SizedBox(width: 8),
                  _buildTab('Skema Struktur', false),
                ],
              ),
            ),

            // Inspiration Feed
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  _buildInspirationCard(
                    author: 'DesignLab Global',
                    time: '2 jam yang lalu',
                    title: 'Modular Pallet Sofa',
                    description:
                        'Cara menyusun 4 palet rusak menjadi sofa minimalis yang nyaman. Sangat cocok untuk cafe outdoor.',
                    likes: '2.4k',
                    comments: '124',
                    imageUrl:
                        'assets/images/map_jepara.jpg', // Placeholder image
                  ),
                  _buildInspirationCard(
                    author: 'Studio Kayu Lokal',
                    time: '5 jam yang lalu',
                    title: 'Metode press serbuk kayu untuk tatakan gelas',
                    description:
                        'Menggunakan campuran serbuk kayu sisa penggergajian dengan lem epoxy ramah lingkungan.',
                    likes: '856',
                    comments: '42',
                    imageUrl:
                        'assets/images/map_jepara.jpg', // Placeholder image
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Open discuss/ask expert logic
        },
        backgroundColor: AppTheme.primaryColor,
        icon: const Icon(Icons.chat_bubble, color: AppTheme.background),
        label: const Text(
          'Tanya Ahli',
          style: TextStyle(
            color: AppTheme.background,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildTab(String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppTheme.primaryColor : Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isSelected
              ? AppTheme.primaryColor
              : Colors.white.withValues(alpha: 0.2),
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? AppTheme.background : Colors.white70,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildInspirationCard({
    required String author,
    required String time,
    required String title,
    required String description,
    required String likes,
    required String comments,
    required String imageUrl,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author Header
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppTheme.primaryColor.withValues(alpha: 0.2),
                  child: const Icon(Icons.person, color: AppTheme.primaryColor),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        author,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        time,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.more_vert, color: Colors.white54),
              ],
            ),
          ),

          // Media Placeholder
          Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage(imageUrl),
                fit: BoxFit.cover,
              ),
            ),
          ),

          // Content
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
                  description,
                  style: const TextStyle(color: Colors.white70, height: 1.5),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    const Icon(
                      Icons.favorite_border,
                      color: AppTheme.primaryColor,
                      size: 20,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      likes,
                      style: const TextStyle(
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Icon(
                      Icons.chat_bubble_outline,
                      color: Colors.white54,
                      size: 20,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      comments,
                      style: const TextStyle(
                        color: Colors.white54,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    const Icon(
                      Icons.share_outlined,
                      color: Colors.white54,
                      size: 20,
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
