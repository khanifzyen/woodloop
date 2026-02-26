import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String email;
  final String name;
  final String role;
  final String? workshopName;
  final String? address;
  final double? locationLat;
  final double? locationLng;
  final String? phone;
  final bool isVerified;
  final String? bio;

  const User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.workshopName,
    this.address,
    this.locationLat,
    this.locationLng,
    this.phone,
    this.isVerified = false,
    this.bio,
  });

  @override
  List<Object?> get props => [
    id,
    email,
    name,
    role,
    workshopName,
    address,
    locationLat,
    locationLng,
    phone,
    isVerified,
    bio,
  ];
}
