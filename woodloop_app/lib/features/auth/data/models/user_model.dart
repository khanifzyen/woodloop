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
    super.bio,
  });

  factory UserModel.fromRecord(RecordModel record) {
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
      isVerified: record.getBoolValue('is_verified'),
      bio: record.getStringValue('bio'),
    );
  }
}
