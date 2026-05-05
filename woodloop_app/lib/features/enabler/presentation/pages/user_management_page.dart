import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../cubit/user_management_cubit.dart';
import '../../../../injection_container.dart';

class UserManagementPage extends StatelessWidget {
  const UserManagementPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<UserManagementCubit>()..loadUsers(),
      child: const _UserManagementView(),
    );
  }
}

class _UserManagementView extends StatelessWidget {
  const _UserManagementView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: const Text('Verifikasi Pengguna',
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: BlocBuilder<UserManagementCubit, UserManagementState>(
        builder: (context, state) {
          if (state is UserManagementLoading) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor));
          }
          if (state is UserManagementError) {
            return Center(
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.error_outline, color: Colors.redAccent, size: 48),
                const SizedBox(height: 16),
                Text(state.message, style: const TextStyle(color: Colors.redAccent)),
              ]),
            );
          }
          if (state is UserManagementLoaded) {
            return _LoadedView(state: state);
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}

class _LoadedView extends StatelessWidget {
  final UserManagementLoaded state;
  const _LoadedView({required this.state});

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      // Stats bar
      _StatsBar(
        total: state.totalUsers,
        verified: state.verifiedCount,
        unverified: state.unverifiedCount,
      ),
      const SizedBox(height: 8),
      // Role filter chips
      _RoleFilter(
        activeFilter: state.activeFilter,
        onFilter: (role) => context.read<UserManagementCubit>().loadUsers(roleFilter: role),
      ),
      const SizedBox(height: 8),
      // User list
      Expanded(
        child: state.users.isEmpty
            ? const Center(child: Text('Tidak ada pengguna', style: TextStyle(color: Colors.white54)))
            : ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: state.users.length,
                itemBuilder: (context, index) {
                  final user = state.users[index];
                  return _UserCard(
                    user: user,
                    onToggle: (val) => context.read<UserManagementCubit>().toggleVerification(user.id, val),
                  );
                },
              ),
      ),
    ]);
  }
}

class _StatsBar extends StatelessWidget {
  final int total, verified, unverified;
  const _StatsBar({required this.total, required this.verified, required this.unverified});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(children: [
        _StatCard(label: 'Total', value: total.toString(), color: Colors.blue),
        const SizedBox(width: 12),
        _StatCard(label: 'Verified', value: verified.toString(), color: Colors.green),
        const SizedBox(width: 12),
        _StatCard(label: 'Pending', value: unverified.toString(), color: Colors.orange),
      ]),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label, value;
  final Color color;
  const _StatCard({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Column(children: [
          Text(value, style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(color: color.withValues(alpha: 0.7), fontSize: 11)),
        ]),
      ),
    );
  }
}

class _RoleFilter extends StatelessWidget {
  final String? activeFilter;
  final Function(String?) onFilter;
  const _RoleFilter({required this.activeFilter, required this.onFilter});

  static const _roles = ['supplier', 'generator', 'aggregator', 'converter', 'buyer', 'enabler'];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(children: [
        _FilterChip(label: 'Semua', selected: activeFilter == null, onTap: () => onFilter(null)),
        ..._roles.map((r) => _FilterChip(
          label: r[0].toUpperCase() + r.substring(1),
          selected: activeFilter == r,
          onTap: () => onFilter(r),
        )),
      ]),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const _FilterChip({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: selected ? AppTheme.primaryColor : AppTheme.surfaceColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: selected ? AppTheme.primaryColor : Colors.white24),
          ),
          child: Text(label,
            style: TextStyle(color: selected ? AppTheme.background : Colors.white70, fontSize: 12, fontWeight: FontWeight.w600)),
        ),
      ),
    );
  }
}

class _UserCard extends StatelessWidget {
  final UserSummary user;
  final Function(bool) onToggle;
  const _UserCard({required this.user, required this.onToggle});

  Color _roleColor(String role) {
    const colors = {
      'supplier': Colors.brown, 'generator': Colors.teal, 'aggregator': Colors.blue,
      'converter': Colors.purple, 'buyer': Colors.pink, 'enabler': Colors.amber,
    };
    return colors[role] ?? Colors.grey;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(children: [
        // Avatar circle
        CircleAvatar(
          radius: 24,
          backgroundColor: _roleColor(user.role).withValues(alpha: 0.2),
          child: Text(user.name[0].toUpperCase(),
            style: TextStyle(color: _roleColor(user.role), fontWeight: FontWeight.bold, fontSize: 20)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Expanded(child: Text(user.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15))),
              _RoleBadge(role: user.role),
            ]),
            const SizedBox(height: 4),
            Text(user.email, style: const TextStyle(color: Colors.white54, fontSize: 12)),
            if (user.workshopName != null && user.workshopName!.isNotEmpty)
              Text(user.workshopName!, style: const TextStyle(color: Colors.white38, fontSize: 11)),
          ]),
        ),
        const SizedBox(width: 8),
        // Verification toggle
        Column(children: [
          Switch(
            value: user.isVerified,
            onChanged: onToggle,
            activeThumbColor: AppTheme.primaryColor,
          ),
          Text(user.isVerified ? 'Verified' : 'Pending',
            style: TextStyle(
              color: user.isVerified ? Colors.green : Colors.orange,
              fontSize: 9, fontWeight: FontWeight.bold)),
        ]),
      ]),
    );
  }
}

class _RoleBadge extends StatelessWidget {
  final String role;
  const _RoleBadge({required this.role});

  @override
  Widget build(BuildContext context) {
    final colors = {
      'supplier': Colors.brown, 'generator': Colors.teal, 'aggregator': Colors.blue,
      'converter': Colors.purple, 'buyer': Colors.pink, 'enabler': Colors.amber,
    };
    final labels = {
      'supplier': 'Supplier', 'generator': 'Generator', 'aggregator': 'Aggregator',
      'converter': 'Converter', 'buyer': 'Buyer', 'enabler': 'Enabler',
    };
    final color = colors[role] ?? Colors.grey;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(labels[role] ?? role,
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }
}
