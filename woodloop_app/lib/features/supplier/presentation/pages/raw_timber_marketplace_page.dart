import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class RawTimberMarketplacePage extends StatefulWidget {
  const RawTimberMarketplacePage({super.key});

  @override
  State<RawTimberMarketplacePage> createState() =>
      _RawTimberMarketplacePageState();
}

class _RawTimberMarketplacePageState extends State<RawTimberMarketplacePage> {
  String _selectedFilter = 'All';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Column(
          children: [
            // Header Section
            Container(
              padding: const EdgeInsets.only(
                top: 24,
                bottom: 8,
                left: 16,
                right: 16,
              ),
              decoration: BoxDecoration(
                color: AppTheme.background.withValues(alpha: 0.95),
                border: Border(
                  bottom: BorderSide(
                    color: Colors.white.withValues(alpha: 0.05),
                  ),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back, color: Colors.white),
                        onPressed: () => context.pop(),
                      ),
                      const Text(
                        'Raw Timber Market',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Row(
                        children: [
                          Stack(
                            alignment: Alignment.center,
                            children: [
                              IconButton(
                                icon: const Icon(
                                  Icons.notifications_outlined,
                                  color: Colors.white,
                                ),
                                onPressed: () {},
                              ),
                              Positioned(
                                right: 12,
                                top: 12,
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: AppTheme.primaryColor,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(
                              Icons.shopping_cart_outlined,
                              color: Colors.white,
                            ),
                            onPressed: () {},
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Search Bar
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          height: 48,
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: TextField(
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              hintText: 'Search logs, ID, or species...',
                              hintStyle: const TextStyle(
                                color: Colors.white54,
                                fontSize: 14,
                              ),
                              prefixIcon: const Icon(
                                Icons.search,
                                color: Colors.white54,
                              ),
                              suffixIcon: IconButton(
                                icon: const Icon(
                                  Icons.qr_code_scanner,
                                  color: AppTheme.primaryColor,
                                ),
                                onPressed: () {},
                              ),
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(
                                vertical: 14,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        height: 48,
                        width: 48,
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.tune, color: Colors.white),
                          onPressed: () {},
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Scrollable Content
            Expanded(
              child: Stack(
                children: [
                  CustomScrollView(
                    slivers: [
                      // Filter Pills (Sticky-like behavior achieved by placing it right after appbar equivalent)
                      SliverToBoxAdapter(
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.background.withValues(alpha: 0.95),
                            border: Border(
                              bottom: BorderSide(
                                color: Colors.white.withValues(alpha: 0.05),
                              ),
                            ),
                          ),
                          child: SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: [
                                _buildFilterPill('All', true),
                                _buildFilterPill('Teak (Jati)', false),
                                _buildFilterPill('Mahogany', false),
                                _buildFilterPill('Logs', false),
                                _buildFilterPill('FSC Only', false),
                              ],
                            ),
                          ),
                        ),
                      ),

                      // Stats/Context Banner
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Available Stock',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Row(
                                    children: [
                                      const Text(
                                        'Sort by: ',
                                        style: TextStyle(
                                          color: Colors.white54,
                                          fontSize: 12,
                                        ),
                                      ),
                                      const Text(
                                        'Volume (High)',
                                        style: TextStyle(
                                          color: AppTheme.primaryColor,
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(width: 2),
                                      const Icon(
                                        Icons.expand_more,
                                        color: AppTheme.primaryColor,
                                        size: 16,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Showing 142 listings from verified suppliers in Jepara',
                                style: TextStyle(
                                  color: Colors.white54,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Listings Grid
                      SliverPadding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16.0,
                          vertical: 8.0,
                        ),
                        sliver: SliverList(
                          delegate: SliverChildListDelegate([
                            _buildTimberCard(
                              imageUrl:
                                  'assets/images/map_jepara.jpg', // Placeholder
                              title: 'Perhutani Teak Logs',
                              supplier: 'CV. Berkah Alam Jepara',
                              price: 'Rp 15.000k',
                              unit: '/m³',
                              minOrder: '5 m³',
                              id: 'TK-2948-JEP',
                              badge1Text: 'SVLK',
                              badge1Icon: Icons.verified,
                              badge2Text: 'Grade A',
                              thickness: '40',
                              width: '40',
                              process: 'Raw',
                              volumeLeft: '45 m³ Left',
                              volumePercent: 0.75,
                            ),
                            const SizedBox(height: 16),
                            _buildTimberCard(
                              imageUrl:
                                  'assets/images/map_jepara.jpg', // Placeholder
                              title: 'Mahogany Planks (Sawn)',
                              supplier: 'PT. Kayu Lestari',
                              price: 'Rp 8.500k',
                              unit: '/m³',
                              minOrder: '10 m³',
                              id: 'MG-1102-KLT',
                              badge1Text: 'FSC 100%',
                              badge1Icon: Icons.eco,
                              badge2Text: 'Kiln Dried',
                              thickness: '5',
                              width: '20',
                              process: 'KD',
                              volumeLeft: '120 m³ Left',
                              volumePercent: 0.4,
                            ),
                            const SizedBox(height: 16),
                            _buildOutOfStockCard(
                              imageUrl:
                                  'assets/images/map_jepara.jpg', // Placeholder
                              title: 'Teak Square Logs',
                              supplier: 'CV. Jati Makmur',
                              price: 'Rp 12.000k',
                              unit: '/m³',
                              badge1Text: 'SVLK',
                            ),
                            const SizedBox(
                              height: 100,
                            ), // Spacing for bottom nav & FAB
                          ]),
                        ),
                      ),
                    ],
                  ),

                  // Floating Action Button
                  Positioned(
                    bottom: 16,
                    right: 16,
                    child: ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(
                        Icons.edit_note,
                        color: AppTheme.background,
                      ),
                      label: const Text(
                        'Bulk Inquiry',
                        style: TextStyle(
                          color: AppTheme.background,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 16,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 8,
                        shadowColor: AppTheme.primaryColor.withValues(
                          alpha: 0.5,
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
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: AppTheme.surfaceColor,
        selectedItemColor: AppTheme.primaryColor,
        unselectedItemColor: Colors.white54,
        type: BottomNavigationBarType.fixed,
        currentIndex: 1, // Market is selected
        onTap: (index) {
          switch (index) {
            case 0:
              context.pushNamed('supplier_dashboard');
              break;
            case 1:
              // Already here
              break;
            case 2:
              context.pushNamed('supplier_sales_history');
              break;
            case 3:
              context.pushNamed('messages_list');
              break;
            case 4:
              context.pushNamed('b2b_profile');
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.storefront_outlined),
            activeIcon: Icon(Icons.storefront),
            label: 'Market',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.inventory_2_outlined),
            activeIcon: Icon(Icons.inventory_2),
            label: 'Inventory',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline),
            activeIcon: Icon(Icons.chat_bubble),
            label: 'Messages',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildFilterPill(String text, bool isSelected) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedFilter = text;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primaryColor : AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppTheme.primaryColor
                : Colors.white.withValues(alpha: 0.05),
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppTheme.primaryColor.withValues(alpha: 0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            if (isSelected) ...[
              const Icon(Icons.check, color: AppTheme.background, size: 16),
              const SizedBox(width: 4),
            ],
            Text(
              text,
              style: TextStyle(
                color: isSelected ? AppTheme.background : Colors.white54,
                fontSize: 14,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimberCard({
    required String imageUrl,
    required String title,
    required String supplier,
    required String price,
    required String unit,
    required String minOrder,
    required String id,
    required String badge1Text,
    required IconData badge1Icon,
    required String badge2Text,
    required String thickness,
    required String width,
    required String process,
    required String volumeLeft,
    required double volumePercent,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // Image Area
          SizedBox(
            height: 160,
            width: double.infinity,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.asset(imageUrl, fit: BoxFit.cover),
                // Gradients
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        Colors.black.withValues(alpha: 0.8),
                        Colors.transparent,
                      ],
                      stops: const [0.0, 0.5],
                    ),
                  ),
                ),
                // Badges Top Left
                Positioned(
                  top: 12,
                  left: 12,
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              badge1Icon,
                              color: AppTheme.background,
                              size: 12,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              badge1Text,
                              style: const TextStyle(
                                color: AppTheme.background,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.6),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                        child: Text(
                          badge2Text,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                // ID Bottom Left
                Positioned(
                  bottom: 12,
                  left: 12,
                  child: Text(
                    'ID: $id',
                    style: const TextStyle(
                      color: AppTheme.primaryColor,
                      fontSize: 10,
                      fontFamily: 'monospace',
                      letterSpacing: 1.0,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Content Area
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
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
                            'Supplier: $supplier',
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Text(
                              price,
                              style: const TextStyle(
                                color: AppTheme.primaryColor,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              unit,
                              style: const TextStyle(
                                color: Colors.white54,
                                fontSize: 10,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Min. Order: $minOrder',
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Technical Grid
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.05),
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'THICK',
                              style: TextStyle(
                                color: Colors.white54,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.5,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.baseline,
                              textBaseline: TextBaseline.alphabetic,
                              children: [
                                Text(
                                  thickness,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const Text(
                                  ' cm',
                                  style: TextStyle(
                                    color: Colors.white54,
                                    fontSize: 10,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      Container(
                        width: 1,
                        height: 24,
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(left: 12.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'WIDTH',
                                style: TextStyle(
                                  color: Colors.white54,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.baseline,
                                textBaseline: TextBaseline.alphabetic,
                                children: [
                                  Text(
                                    width,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const Text(
                                    ' cm',
                                    style: TextStyle(
                                      color: Colors.white54,
                                      fontSize: 10,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      Container(
                        width: 1,
                        height: 24,
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(left: 12.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'PROCESS',
                                style: TextStyle(
                                  color: Colors.white54,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.baseline,
                                textBaseline: TextBaseline.alphabetic,
                                children: [
                                  Text(
                                    process,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  if (process == 'KD')
                                    const Text(
                                      ' Dry',
                                      style: TextStyle(
                                        color: Colors.white54,
                                        fontSize: 10,
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
                ),

                const SizedBox(height: 16),

                // Volume & Action
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Available Volume',
                          style: TextStyle(color: Colors.white54, fontSize: 10),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          width: 100,
                          height: 6,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(3),
                          ),
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: volumePercent,
                            child: Container(
                              decoration: BoxDecoration(
                                color: AppTheme.primaryColor,
                                borderRadius: BorderRadius.circular(3),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          volumeLeft,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        foregroundColor: AppTheme.background,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Add to Quote',
                        style: TextStyle(fontWeight: FontWeight.bold),
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

  Widget _buildOutOfStockCard({
    required String imageUrl,
    required String title,
    required String supplier,
    required String price,
    required String unit,
    required String badge1Text,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Opacity(
        opacity: 0.8,
        child: Column(
          children: [
            // Image Area
            SizedBox(
              height: 160,
              width: double.infinity,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  ColorFiltered(
                    colorFilter: const ColorFilter.mode(
                      Colors.grey,
                      BlendMode.saturation,
                    ),
                    child: Image.asset(imageUrl, fit: BoxFit.cover),
                  ),
                  Container(color: Colors.black.withValues(alpha: 0.4)),
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'Out of Stock',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                      child: Text(
                        badge1Text,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Content Area
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              title,
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.6),
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Supplier: $supplier',
                              style: const TextStyle(
                                color: Colors.white54,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            price,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.6),
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            unit,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () {},
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white54,
                        side: BorderSide(
                          color: Colors.white.withValues(alpha: 0.2),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Notify When Available'),
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
}
