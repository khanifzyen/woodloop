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
import 'features/auth/data/datasources/auth_remote_data_source.dart' as _i767;
import 'features/auth/data/repositories/auth_repository_impl.dart' as _i111;
import 'features/auth/domain/repositories/auth_repository.dart' as _i1015;
import 'features/auth/presentation/bloc/auth_bloc.dart' as _i363;
import 'features/profile/data/datasources/user_profile_remote_data_source.dart'
    as _i172;
import 'features/profile/data/repositories/user_profile_repository_impl.dart'
    as _i671;
import 'features/profile/domain/repositories/user_profile_repository.dart'
    as _i142;
import 'features/profile/presentation/bloc/user_profile_bloc.dart' as _i532;

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
    gh.lazySingleton<_i767.AuthRemoteDataSource>(
      () => _i767.AuthRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i172.UserProfileRemoteDataSource>(
      () => _i172.UserProfileRemoteDataSourceImpl(gh<_i169.PocketBase>()),
    );
    gh.lazySingleton<_i1015.AuthRepository>(
      () => _i111.AuthRepositoryImpl(gh<_i767.AuthRemoteDataSource>()),
    );
    gh.lazySingleton<_i142.UserProfileRepository>(
      () => _i671.UserProfileRepositoryImpl(
        gh<_i172.UserProfileRemoteDataSource>(),
      ),
    );
    gh.factory<_i532.UserProfileBloc>(
      () => _i532.UserProfileBloc(gh<_i142.UserProfileRepository>()),
    );
    gh.factory<_i363.AuthBloc>(
      () => _i363.AuthBloc(gh<_i1015.AuthRepository>()),
    );
    return this;
  }
}

class _$SharedPreferencesModule extends _i497.SharedPreferencesModule {}

class _$AppModule extends _i808.AppModule {}
