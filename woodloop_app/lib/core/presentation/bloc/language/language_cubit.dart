import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:equatable/equatable.dart';

part 'language_state.dart';

const String _languagePrefsKey = 'selected_language';

@injectable
class LanguageCubit extends Cubit<LanguageState> {
  final SharedPreferences _prefs;

  LanguageCubit(this._prefs) : super(const LanguageInitial(Locale('id'))) {
    _loadSavedLanguage();
  }

  void _loadSavedLanguage() {
    final savedLang = _prefs.getString(_languagePrefsKey);
    if (savedLang != null) {
      emit(LanguageChanged(Locale(savedLang)));
    } else {
      // Default to Indonesian if no preference is saved
      emit(const LanguageChanged(Locale('id')));
    }
  }

  Future<void> changeLanguage(String languageCode) async {
    final newLocale = Locale(languageCode);
    if (state.locale != newLocale) {
      await _prefs.setString(_languagePrefsKey, languageCode);
      emit(LanguageChanged(newLocale));
    }
  }
}
