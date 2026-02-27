import 'package:equatable/equatable.dart';

class WalletTransaction extends Equatable {
  final String id;
  final String userId;
  final String type; // credit or debit
  final double amount;
  final double? balanceAfter;
  final String? description;
  final String? referenceType;
  final String? referenceId;
  final DateTime created;

  const WalletTransaction({
    required this.id,
    required this.userId,
    required this.type,
    required this.amount,
    this.balanceAfter,
    this.description,
    this.referenceType,
    this.referenceId,
    required this.created,
  });

  @override
  List<Object?> get props => [
    id,
    userId,
    type,
    amount,
    balanceAfter,
    description,
    referenceType,
    referenceId,
    created,
  ];
}
