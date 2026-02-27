part of 'waste_listing_bloc.dart';

abstract class WasteListingState extends Equatable {
  const WasteListingState();

  @override
  List<Object?> get props => [];
}

class WasteListingInitial extends WasteListingState {}

class WasteListingLoading extends WasteListingState {}

class WasteListingsLoaded extends WasteListingState {
  final List<WasteListing> listings;

  const WasteListingsLoaded(this.listings);

  @override
  List<Object?> get props => [listings];
}

class WasteListingDetailLoaded extends WasteListingState {
  final WasteListing listing;

  const WasteListingDetailLoaded(this.listing);

  @override
  List<Object?> get props => [listing];
}

class WasteListingCreated extends WasteListingState {
  final WasteListing listing;

  const WasteListingCreated(this.listing);

  @override
  List<Object?> get props => [listing];
}

class WasteListingUpdated extends WasteListingState {
  final WasteListing listing;

  const WasteListingUpdated(this.listing);

  @override
  List<Object?> get props => [listing];
}

class WasteListingDeleted extends WasteListingState {}

class WasteListingError extends WasteListingState {
  final String message;

  const WasteListingError(this.message);

  @override
  List<Object?> get props => [message];
}
