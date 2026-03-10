import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/repositories/supplier_repository.dart';

abstract class WoodTypesState {}

class WoodTypesInitial extends WoodTypesState {}

class WoodTypesLoading extends WoodTypesState {}

class WoodTypesLoaded extends WoodTypesState {
  final List<Map<String, dynamic>> woodTypes;

  WoodTypesLoaded(this.woodTypes);
}

class WoodTypesError extends WoodTypesState {
  final String message;

  WoodTypesError(this.message);
}

@injectable
class WoodTypesCubit extends Cubit<WoodTypesState> {
  final SupplierRepository repository;

  WoodTypesCubit(this.repository) : super(WoodTypesInitial());

  Future<void> loadWoodTypes() async {
    try {
      if (state is! WoodTypesLoaded) {
        emit(WoodTypesLoading());
      }
      final result = await repository.getWoodTypes();
      emit(WoodTypesLoaded(result));
    } catch (e) {
      emit(WoodTypesError(e.toString()));
    }
  }
}
