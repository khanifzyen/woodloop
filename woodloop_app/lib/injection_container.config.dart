// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format width=80

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:pocketbase/pocketbase.dart' as _i169;
import 'package:shared_preferences/shared_preferences.dart' as _i460;

import 'core/di/app_module.dart' as _i808;
import 'core/di/shared_preferences_module.dart' as _i497;
import 'core/presentation/bloc/language/language_cubit.dart' as _i262;
import 'features/aggregator/data/datasources/pickup_remote_data_source.dart'
    as _i883;
import 'features/aggregator/data/datasources/warehouse_remote_data_source.dart'
    as _i549;
import 'features/aggregator/data/repositories/pickup_repository_impl.dart'
    as _i277;
import 'features/aggregator/data/repositories/warehouse_repository_impl.dart'
    as _i994;
import 'features/aggregator/domain/repositories/pickup_repository.dart'
    as _i252;
import 'features/aggregator/domain/repositories/warehouse_repository.dart'
    as _i28;
import 'features/aggregator/presentation/bloc/pickup_bloc.dart' as _i100;
import 'features/aggregator/presentation/bloc/warehouse_bloc.dart' as _i193;
import 'features/auth/data/datasources/auth_remote_data_source.dart' as _i767;
import 'features/auth/data/repositories/auth_repository_impl.dart' as _i111;
import 'features/auth/domain/repositories/auth_repository.dart' as _i1015;
import 'features/auth/presentation/bloc/auth_bloc.dart' as _i363;
import 'features/buyer/data/datasources/cart_remote_data_source.dart' as _i357;
import 'features/buyer/data/datasources/order_remote_data_source.dart' as _i416;
import 'features/buyer/data/repositories/cart_repository_impl.dart' as _i444;
import 'features/buyer/data/repositories/order_repository_impl.dart' as _i541;
import 'features/buyer/domain/repositories/cart_repository.dart' as _i723;
import 'features/buyer/domain/repositories/order_repository.dart' as _i99;
import 'features/buyer/presentation/bloc/cart_bloc.dart' as _i953;
import 'features/buyer/presentation/bloc/order_bloc.dart' as _i39;
import 'features/chat/data/datasources/chat_remote_datasource.dart' as _i343;
import 'features/chat/data/repositories/chat_repository_impl.dart' as _i382;
import 'features/chat/domain/repositories/chat_repository.dart' as _i453;
import 'features/chat/presentation/bloc/chat_bloc.dart' as _i1026;
import 'features/converter/data/datasources/marketplace_remote_data_source.dart'
    as _i11;
import 'features/converter/data/datasources/product_remote_data_source.dart'
    as _i694;
import 'features/converter/data/repositories/marketplace_repository_impl.dart'
    as _i505;
import 'features/converter/data/repositories/product_repository_impl.dart'
    as _i343;
import 'features/converter/domain/repositories/marketplace_repository.dart'
    as _i114;
import 'features/converter/domain/repositories/product_repository.dart'
    as _i412;
import 'features/converter/presentation/bloc/marketplace_bloc.dart' as _i251;
import 'features/converter/presentation/bloc/product_bloc.dart' as _i561;
import 'features/generator/data/datasources/waste_listing_remote_data_source.dart'
    as _i127;
import 'features/generator/data/repositories/waste_listing_repository_impl.dart'
    as _i707;
import 'features/generator/domain/repositories/waste_listing_repository.dart'
    as _i657;
import 'features/generator/presentation/bloc/waste_listing_bloc.dart' as _i981;
import 'features/profile/data/datasources/user_profile_remote_data_source.dart'
    as _i172;
import 'features/profile/data/repositories/user_profile_repository_impl.dart'
    as _i671;
import 'features/profile/domain/repositories/user_profile_repository.dart'
    as _i142;
import 'features/profile/presentation/bloc/user_profile_bloc.dart' as _i532;
import 'features/shared/data/datasources/notification_remote_datasource.dart'
    as _i88;
import 'features/shared/data/datasources/wallet_remote_data_source.dart'
    as _i231;
import 'features/shared/data/repositories/wallet_repository_impl.dart' as _i427;
import 'features/shared/domain/repositories/wallet_repository.dart' as _i525;
import 'features/shared/presentation/bloc/notification_bloc.dart' as _i1036;
import 'features/shared/presentation/bloc/wallet_bloc.dart' as _i678;
import 'features/traceability/data/datasources/traceability_remote_datasource.dart'
    as _i541;
import 'features/traceability/data/repositories/traceability_repository_impl.dart'
    as _i14;
import 'features/traceability/domain/repositories/traceability_repository.dart'
    as _i71;
import 'features/traceability/presentation/bloc/traceability_bloc.dart'
    as _i322;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  Future<_i174.GetIt> init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) async {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    final sharedPreferencesModule = _$SharedPreferencesModule();
    final appModule = _$AppModule();
    await gh.factoryAsync<_i460.SharedPreferences>(
      () => sharedPreferencesModule.prefs,
      preResolve: true,
    );
    gh.factory<_i262.LanguageCubit>(
      () => _i262.LanguageCubit(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i169.PocketBase>(
      () => appModule.pocketBase(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i883.PickupRemoteDataSource>(
      () => _i883.PickupRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i88.NotificationRemoteDataSource>(
      () => _i88.NotificationRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.factory<_i1036.NotificationBloc>(
      () => _i1036.NotificationBloc(gh<_i88.NotificationRemoteDataSource>()),
    );
    gh.lazySingleton<_i541.TraceabilityRemoteDataSource>(
      () => _i541.TraceabilityRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i343.ChatRemoteDataSource>(
      () => _i343.ChatRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i71.TraceabilityRepository>(
      () => _i14.TraceabilityRepositoryImpl(
        gh<_i541.TraceabilityRemoteDataSource>(),
      ),
    );
    gh.lazySingleton<_i252.PickupRepository>(
      () => _i277.PickupRepositoryImpl(gh<_i883.PickupRemoteDataSource>()),
    );
    gh.factory<_i322.TraceabilityBloc>(
      () => _i322.TraceabilityBloc(gh<_i71.TraceabilityRepository>()),
    );
    gh.factory<_i100.PickupBloc>(
      () => _i100.PickupBloc(gh<_i252.PickupRepository>()),
    );
    gh.lazySingleton<_i453.ChatRepository>(
      () => _i382.ChatRepositoryImpl(gh<_i343.ChatRemoteDataSource>()),
    );
    gh.lazySingleton<_i549.WarehouseRemoteDataSource>(
      () => _i549.WarehouseRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i127.WasteListingRemoteDataSource>(
      () => _i127.WasteListingRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i28.WarehouseRepository>(
      () =>
          _i994.WarehouseRepositoryImpl(gh<_i549.WarehouseRemoteDataSource>()),
    );
    gh.lazySingleton<_i694.ProductRemoteDataSource>(
      () => _i694.ProductRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i11.MarketplaceRemoteDataSource>(
      () => _i11.MarketplaceRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i231.WalletRemoteDataSource>(
      () => _i231.WalletRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i357.CartRemoteDataSource>(
      () => _i357.CartRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i767.AuthRemoteDataSource>(
      () => _i767.AuthRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i657.WasteListingRepository>(
      () => _i707.WasteListingRepositoryImpl(
        gh<_i127.WasteListingRemoteDataSource>(),
      ),
    );
    gh.lazySingleton<_i172.UserProfileRemoteDataSource>(
      () => _i172.UserProfileRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i416.OrderRemoteDataSource>(
      () => _i416.OrderRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.factory<_i193.WarehouseBloc>(
      () => _i193.WarehouseBloc(gh<_i28.WarehouseRepository>()),
    );
    gh.factory<_i981.WasteListingBloc>(
      () => _i981.WasteListingBloc(gh<_i657.WasteListingRepository>()),
    );
    gh.lazySingleton<_i1015.AuthRepository>(
      () => _i111.AuthRepositoryImpl(gh<_i767.AuthRemoteDataSource>()),
    );
    gh.lazySingleton<_i142.UserProfileRepository>(
      () => _i671.UserProfileRepositoryImpl(
        gh<_i172.UserProfileRemoteDataSource>(),
      ),
    );
    gh.lazySingleton<_i114.MarketplaceRepository>(
      () => _i505.MarketplaceRepositoryImpl(
        gh<_i11.MarketplaceRemoteDataSource>(),
      ),
    );
    gh.factory<_i1026.ChatBloc>(
      () => _i1026.ChatBloc(gh<_i453.ChatRepository>()),
    );
    gh.lazySingleton<_i723.CartRepository>(
      () => _i444.CartRepositoryImpl(gh<_i357.CartRemoteDataSource>()),
    );
    gh.lazySingleton<_i525.WalletRepository>(
      () => _i427.WalletRepositoryImpl(gh<_i231.WalletRemoteDataSource>()),
    );
    gh.factory<_i251.MarketplaceBloc>(
      () => _i251.MarketplaceBloc(gh<_i114.MarketplaceRepository>()),
    );
    gh.lazySingleton<_i412.ProductRepository>(
      () => _i343.ProductRepositoryImpl(gh<_i694.ProductRemoteDataSource>()),
    );
    gh.factory<_i678.WalletBloc>(
      () => _i678.WalletBloc(gh<_i525.WalletRepository>()),
    );
    gh.lazySingleton<_i99.OrderRepository>(
      () => _i541.OrderRepositoryImpl(gh<_i416.OrderRemoteDataSource>()),
    );
    gh.factory<_i532.UserProfileBloc>(
      () => _i532.UserProfileBloc(gh<_i142.UserProfileRepository>()),
    );
    gh.factory<_i363.AuthBloc>(
      () => _i363.AuthBloc(gh<_i1015.AuthRepository>()),
    );
    gh.factory<_i561.ProductBloc>(
      () => _i561.ProductBloc(gh<_i412.ProductRepository>()),
    );
    gh.factory<_i953.CartBloc>(
      () => _i953.CartBloc(gh<_i723.CartRepository>()),
    );
    gh.factory<_i39.OrderBloc>(
      () => _i39.OrderBloc(gh<_i99.OrderRepository>()),
    );
    return this;
  }
}

class _$SharedPreferencesModule extends _i497.SharedPreferencesModule {}

class _$AppModule extends _i808.AppModule {}
