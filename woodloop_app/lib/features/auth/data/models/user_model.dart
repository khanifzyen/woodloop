import '../../domain/entities/user.dart';
import 'package:pocketbase/pocketbase.dart';

class UserModel extends User {
  const UserModel({
    required super.id,
    required super.email,
    required super.name,
    required super.role,
    super.workshopName,
    super.address,
    super.locationLat,
    super.locationLng,
    super.phone,
    super.isVerified,
    super.isAdminVerified,
    super.bio,
    super.avatar,
  });

  factory UserModel.fromRecord(RecordModel record) {
    // `is_verified` = custom admin approval field.
    // getBoolValue() returns false for BOTH null and false — we can't distinguish.
    // Use raw data: null means admin hasn't decided yet → allow login (true).
    // Only block if admin explicitly set it to false.
    final rawAdminVerified = record.data['is_verified'];
    final isAdminVerified = rawAdminVerified == null
        ? true
        : (rawAdminVerified as bool? ?? true);

    return UserModel(
      id: record.id,
      email: record.getStringValue('email'),
      name: record.getStringValue('name'),
      role: record.getStringValue('role'),
      workshopName: record.getStringValue('workshop_name'),
      address: record.getStringValue('address'),
      locationLat: record.getDoubleValue('location_lat'),
      locationLng: record.getDoubleValue('location_lng'),
      phone: record.getStringValue('phone'),
      isVerified: record.getBoolValue('verified'),
      isAdminVerified: isAdminVerified,
      bio: record.getStringValue('bio'),
      avatar: record.getStringValue('avatar'),
    );
  }
}
