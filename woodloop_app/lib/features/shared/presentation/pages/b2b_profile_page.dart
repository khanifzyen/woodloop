import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class B2BProfilePage extends StatelessWidget {
  const B2BProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    // Determine placeholder role based on current state/mock for now
    // Since this is a shared page, we'll design it to be flexible.
    // In a real app, this would be fetched from auth bloc.
    const String companyName = 'WoodLoop Partner';
    const String roleName = 'Business Account';
    const String email = 'contact@partner.woodloop.id';

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: Text(
          l10n.b2bProfileTitle,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Colors.white),
            onPressed: () {
              // Navigate to settings
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            // Profile Header
            Center(
              child: Column(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppTheme.primaryColor,
                        width: 3,
                      ),
                      image: const DecorationImage(
                        image: AssetImage('assets/images/supplier_profile.jpg'),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    companyName,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    email,
                    style: const TextStyle(color: Colors.white54, fontSize: 14),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: AppTheme.primaryColor.withValues(alpha: 0.3),
                      ),
                    ),
                    child: const Text(
                      roleName,
                      style: TextStyle(
                        color: AppTheme.primaryColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Profile Stats
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      l10n.b2bProfileActivity,
                      '128',
                      Icons.insights,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard(
                      l10n.b2bProfileCertification,
                      l10n.b2bProfileComplete,
                      Icons.verified_outlined,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Menu Items
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
              ),
              child: Column(
                children: [
                  _buildMenuItem(
                    icon: Icons.business_outlined,
                    title: l10n.b2bProfileCompanyInfo,
                    onTap: () {},
                  ),
                  _buildDivider(),
                  _buildMenuItem(
                    icon: Icons.account_balance_wallet_outlined,
                    title: l10n.b2bProfileDigitalWallet,
                    onTap: () {
                      context.pushNamed('woodloop_digital_wallet');
                    },
                  ),
                  _buildDivider(),
                  _buildMenuItem(
                    icon: Icons.document_scanner_outlined,
                    title: l10n.b2bProfileLegalDocs,
                    onTap: () {},
                  ),
                  _buildDivider(),
                  _buildMenuItem(
                    icon: Icons.security_outlined,
                    title: l10n.b2bProfileAccountSecurity,
                    onTap: () {},
                  ),
                  _buildDivider(),
                  _buildMenuItem(
                    icon: Icons.help_outline,
                    title: l10n.b2bProfileHelpCenter,
                    onTap: () {},
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Logout Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: OutlinedButton(
                  onPressed: () {
                    // Handle Logout
                    context.go('/role-selection');
                  },
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.red),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.logout, color: Colors.red),
                      const SizedBox(width: 8),
                      Text(
                        l10n.b2bProfileLogout,
                        style: const TextStyle(
                          color: Colors.red,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.white54, size: 24),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(color: Colors.white54, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white54, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Divider(
      height: 1,
      thickness: 1,
      color: Colors.white.withValues(alpha: 0.05),
      indent: 56,
    );
  }
}
