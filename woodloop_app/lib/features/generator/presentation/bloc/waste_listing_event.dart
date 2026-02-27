part of 'waste_listing_bloc.dart';

abstract class WasteListingEvent extends Equatable {
  const WasteListingEvent();

  @override
  List<Object?> get props => [];
}

/// Load all waste listings, optionally filtered by generator or status
class LoadWasteListings extends WasteListingEvent {
  final String? generatorId;
  final String? status;

  const LoadWasteListings({this.generatorId, this.status});

  @override
  List<Object?> get props => [generatorId, status];
}

/// Load a single waste listing by ID
class LoadWasteListingDetail extends WasteListingEvent {
  final String id;

  const LoadWasteListingDetail(this.id);

  @override
  List<Object?> get props => [id];
}

/// Create a new waste listing
class CreateWasteListing extends WasteListingEvent {
  final Map<String, dynamic> body;

  const CreateWasteListing(this.body);

  @override
  List<Object?> get props => [body];
}

/// Update an existing waste listing
class UpdateWasteListing extends WasteListingEvent {
  final String id;
  final Map<String, dynamic> body;

  const UpdateWasteListing({required this.id, required this.body});

  @override
  List<Object?> get props => [id, body];
}

/// Delete a waste listing
class DeleteWasteListing extends WasteListingEvent {
  final String id;

  const DeleteWasteListing(this.id);

  @override
  List<Object?> get props => [id];
}
