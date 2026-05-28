import 'package:equatable/equatable.dart';
import '../../domain/entities/raw_timber_listing.dart';

abstract class RawTimberMarketplaceState extends Equatable {
  const RawTimberMarketplaceState();

  @override
  List<Object?> get props => [];
}

class RawTimberMarketplaceInitial extends RawTimberMarketplaceState {}

class RawTimberMarketplaceLoading extends RawTimberMarketplaceState {}

class RawTimberMarketplaceLoaded extends RawTimberMarketplaceState {
  final List<RawTimberListing> listings;

  const RawTimberMarketplaceLoaded(this.listings);

  @override
  List<Object?> get props => [listings];
}

class RawTimberMarketplaceError extends RawTimberMarketplaceState {
  final String message;

  const RawTimberMarketplaceError(this.message);

  @override
  List<Object?> get props => [message];
}
