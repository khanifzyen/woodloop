import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/wallet_transaction.dart';

class WalletTransactionModel extends WalletTransaction {
  const WalletTransactionModel({
    required super.id,
    required super.userId,
    required super.type,
    required super.amount,
    super.balanceAfter,
    super.description,
    super.referenceType,
    super.referenceId,
    required super.created,
  });

  factory WalletTransactionModel.fromRecord(RecordModel record) {
    return WalletTransactionModel(
      id: record.id,
      userId: record.getStringValue('user'),
      type: record.getStringValue('type'),
      amount: record.getDoubleValue('amount'),
      balanceAfter: record.getDoubleValue('balance_after'),
      description: record.getStringValue('description'),
      referenceType: record.getStringValue('reference_type'),
      referenceId: record.getStringValue('reference_id'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
    );
  }
}
