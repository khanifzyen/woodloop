import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/raw_timber_order.dart';
import '../../domain/repositories/raw_timber_order_repository.dart';

part 'raw_timber_order_event.dart';
part 'raw_timber_order_state.dart';

@injectable
class RawTimberOrderBloc extends Bloc<RawTimberOrderEvent, RawTimberOrderState> {
  final RawTimberOrderRepository _repo;
  RawTimberOrderBloc(this._repo) : super(RawTimberOrderInitial()) {
    on<LoadRawTimberOrders>(_onLoad);
    on<CreateRawTimberOrder>(_onCreate);
    on<UpdateRawTimberOrderStatus>(_onUpdate);
  }

  Future<void> _onLoad(LoadRawTimberOrders e, Emitter<RawTimberOrderState> emit) async {
    emit(RawTimberOrderLoading());
    try {
      final orders = await _repo.getOrders(buyerId: e.buyerId, sellerId: e.sellerId, status: e.status);
      emit(RawTimberOrdersLoaded(orders));
    } catch (err) {
      emit(RawTimberOrderError(err.toString()));
    }
  }

  Future<void> _onCreate(CreateRawTimberOrder e, Emitter<RawTimberOrderState> emit) async {
    emit(RawTimberOrderLoading());
    try {
      final order = await _repo.createOrder(e.body);
      emit(RawTimberOrderCreated(order));
    } catch (err) {
      emit(RawTimberOrderError(err.toString()));
    }
  }

  Future<void> _onUpdate(UpdateRawTimberOrderStatus e, Emitter<RawTimberOrderState> emit) async {
    emit(RawTimberOrderLoading());
    try {
      final order = await _repo.updateOrder(e.id, e.body);
      emit(RawTimberOrderUpdated(order));
    } catch (err) {
      emit(RawTimberOrderError(err.toString()));
    }
  }
}
