import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/raw_timber_listing.dart';
import '../../domain/repositories/supplier_repository.dart';

abstract class SupplierInventoryState extends Equatable {
  const SupplierInventoryState();

  @override
  List<Object?> get props => [];
}

class SupplierInventoryInitial extends SupplierInventoryState {}

class SupplierInventoryLoading extends SupplierInventoryState {}

class SupplierInventoryLoaded extends SupplierInventoryState {
  final List<RawTimberListing> allListings;
  final List<RawTimberListing> filteredListings;
  final String activeFilter; // 'all', 'draft', 'available', 'sold'
  final bool isDeleting;

  const SupplierInventoryLoaded({
    required this.allListings,
    required this.filteredListings,
    required this.activeFilter,
    this.isDeleting = false,
  });

  SupplierInventoryLoaded copyWith({
    List<RawTimberListing>? allListings,
    List<RawTimberListing>? filteredListings,
    String? activeFilter,
    bool? isDeleting,
  }) {
    return SupplierInventoryLoaded(
      allListings: allListings ?? this.allListings,
      filteredListings: filteredListings ?? this.filteredListings,
      activeFilter: activeFilter ?? this.activeFilter,
      isDeleting: isDeleting ?? this.isDeleting,
    );
  }

  @override
  List<Object?> get props => [
    allListings,
    filteredListings,
    activeFilter,
    isDeleting,
  ];
}

class SupplierInventoryError extends SupplierInventoryState {
  final String message;

  const SupplierInventoryError(this.message);

  @override
  List<Object?> get props => [message];
}

@injectable
class SupplierInventoryCubit extends Cubit<SupplierInventoryState> {
  final SupplierRepository repository;

  SupplierInventoryCubit(this.repository) : super(SupplierInventoryInitial());

  String _currentSupplierId = '';

  Future<void> loadInventory(String supplierId) async {
    _currentSupplierId = supplierId;
    emit(SupplierInventoryLoading());
    try {
      final listings = await repository.getListingsBySupplier(supplierId);
      emit(
        SupplierInventoryLoaded(
          allListings: listings,
          filteredListings: listings,
          activeFilter: 'all',
        ),
      );
    } catch (e) {
      emit(SupplierInventoryError('Failed to load inventory: $e'));
    }
  }

  void applyFilter(String filter) {
    if (state is SupplierInventoryLoaded) {
      final currentState = state as SupplierInventoryLoaded;
      List<RawTimberListing> filtered;

      if (filter == 'all') {
        filtered = currentState.allListings;
      } else {
        filtered = currentState.allListings
            .where((item) => item.status == filter)
            .toList();
      }

      emit(
        currentState.copyWith(filteredListings: filtered, activeFilter: filter),
      );
    }
  }

  Future<void> deleteListing(String listingId) async {
    if (state is SupplierInventoryLoaded) {
      final currentState = state as SupplierInventoryLoaded;
      emit(currentState.copyWith(isDeleting: true));

      try {
        await repository.deleteListing(listingId);
        // Reload fresh after delete
        if (_currentSupplierId.isNotEmpty) {
          final listings = await repository.getListingsBySupplier(
            _currentSupplierId,
          );
          // Apply current filter to updated list
          List<RawTimberListing> filtered;
          if (currentState.activeFilter == 'all') {
            filtered = listings;
          } else {
            filtered = listings
                .where((item) => item.status == currentState.activeFilter)
                .toList();
          }

          emit(
            SupplierInventoryLoaded(
              allListings: listings,
              filteredListings: filtered,
              activeFilter: currentState.activeFilter,
              isDeleting: false,
            ),
          );
        }
      } catch (e) {
        // Stop deleting indicator and show error (or you could emit an error state briefly)
        emit(currentState.copyWith(isDeleting: false));
        // Better UX: emit error then revert, but for simplicity here's standard handling
      }
    }
  }
}
