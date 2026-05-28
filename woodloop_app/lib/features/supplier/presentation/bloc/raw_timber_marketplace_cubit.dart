import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../domain/usecases/get_all_raw_timber_listings.dart';
import 'raw_timber_marketplace_state.dart';

@injectable
class RawTimberMarketplaceCubit extends Cubit<RawTimberMarketplaceState> {
  final GetAllRawTimberListings getAllRawTimberListings;

  RawTimberMarketplaceCubit(this.getAllRawTimberListings)
      : super(RawTimberMarketplaceInitial());

  Future<void> fetchListings() async {
    emit(RawTimberMarketplaceLoading());
    try {
      final listings = await getAllRawTimberListings();
      emit(RawTimberMarketplaceLoaded(listings));
    } catch (e) {
      emit(RawTimberMarketplaceError(e.toString()));
    }
  }
}
