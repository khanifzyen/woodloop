import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_id.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('id'),
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'WoodLoop'**
  String get appTitle;

  /// No description provided for @roleSelectionWelcome.
  ///
  /// In en, this message translates to:
  /// **'Connecting the wood industry for a sustainable future. Select your role to begin.'**
  String get roleSelectionWelcome;

  /// No description provided for @roleSupplierTitle.
  ///
  /// In en, this message translates to:
  /// **'Supplier'**
  String get roleSupplierTitle;

  /// No description provided for @roleSupplierSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Timber Trader'**
  String get roleSupplierSubtitle;

  /// No description provided for @roleSupplierDesc.
  ///
  /// In en, this message translates to:
  /// **'Source & sell raw timber materials'**
  String get roleSupplierDesc;

  /// No description provided for @roleGeneratorTitle.
  ///
  /// In en, this message translates to:
  /// **'Generator'**
  String get roleGeneratorTitle;

  /// No description provided for @roleGeneratorSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Furniture Workshop'**
  String get roleGeneratorSubtitle;

  /// No description provided for @roleGeneratorDesc.
  ///
  /// In en, this message translates to:
  /// **'Manage production & wood waste'**
  String get roleGeneratorDesc;

  /// No description provided for @roleAggregatorTitle.
  ///
  /// In en, this message translates to:
  /// **'Aggregator'**
  String get roleAggregatorTitle;

  /// No description provided for @roleAggregatorSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Logistics'**
  String get roleAggregatorSubtitle;

  /// No description provided for @roleAggregatorDesc.
  ///
  /// In en, this message translates to:
  /// **'Collect, transport & store materials'**
  String get roleAggregatorDesc;

  /// No description provided for @roleConverterTitle.
  ///
  /// In en, this message translates to:
  /// **'Converter'**
  String get roleConverterTitle;

  /// No description provided for @roleConverterSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Creative Artisan'**
  String get roleConverterSubtitle;

  /// No description provided for @roleConverterDesc.
  ///
  /// In en, this message translates to:
  /// **'Upcycle waste into value products'**
  String get roleConverterDesc;

  /// No description provided for @roleDesignerTitle.
  ///
  /// In en, this message translates to:
  /// **'Designer'**
  String get roleDesignerTitle;

  /// No description provided for @roleDesignerSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Creative Consultant'**
  String get roleDesignerSubtitle;

  /// No description provided for @roleDesignerDesc.
  ///
  /// In en, this message translates to:
  /// **'Offer design services and waste upcycling consulting'**
  String get roleDesignerDesc;

  /// No description provided for @roleBuyerTitle.
  ///
  /// In en, this message translates to:
  /// **'Buyer / End User'**
  String get roleBuyerTitle;

  /// No description provided for @roleBuyerSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Public Consumer'**
  String get roleBuyerSubtitle;

  /// No description provided for @roleBuyerDesc.
  ///
  /// In en, this message translates to:
  /// **'Purchase unique upcycled wood products'**
  String get roleBuyerDesc;

  /// No description provided for @continueButton.
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get continueButton;

  /// No description provided for @alreadyHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Already have an account? '**
  String get alreadyHaveAccount;

  /// No description provided for @logInButton.
  ///
  /// In en, this message translates to:
  /// **'Log in'**
  String get logInButton;

  /// No description provided for @splashSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Turning Waste into Wealth'**
  String get splashSubtitle;

  /// No description provided for @splashInitializing.
  ///
  /// In en, this message translates to:
  /// **'INITIALIZING...'**
  String get splashInitializing;

  /// No description provided for @onboardingCaptureSellTitle.
  ///
  /// In en, this message translates to:
  /// **'Capture & Sell'**
  String get onboardingCaptureSellTitle;

  /// No description provided for @onboardingCaptureSellSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Simply take a photo of your wood waste to list it on the marketplace. No more burning—turn your leftovers into resources.'**
  String get onboardingCaptureSellSubtitle;

  /// No description provided for @onboardingCaptureSellHighlight.
  ///
  /// In en, this message translates to:
  /// **'Sell'**
  String get onboardingCaptureSellHighlight;

  /// No description provided for @onboardingEfficientCollectionTitle.
  ///
  /// In en, this message translates to:
  /// **'Efficient Collection'**
  String get onboardingEfficientCollectionTitle;

  /// No description provided for @onboardingEfficientCollectionSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Aggregators bridge the gap by collecting waste from various workshops and supplying them to creative converters. We automate the pickup scheduling so you can focus on sorting and selling.'**
  String get onboardingEfficientCollectionSubtitle;

  /// No description provided for @onboardingEfficientCollectionHighlight.
  ///
  /// In en, this message translates to:
  /// **'Collection'**
  String get onboardingEfficientCollectionHighlight;

  /// No description provided for @onboardingTraceableImpactTitle.
  ///
  /// In en, this message translates to:
  /// **'Traceable Impact'**
  String get onboardingTraceableImpactTitle;

  /// No description provided for @onboardingTraceableImpactSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Every piece of wood has a story. Track your environmental impact and showcase the sustainable journey of your products to eco-conscious buyers worldwide.'**
  String get onboardingTraceableImpactSubtitle;

  /// No description provided for @onboardingTraceableImpactHighlight.
  ///
  /// In en, this message translates to:
  /// **'Impact'**
  String get onboardingTraceableImpactHighlight;

  /// No description provided for @onboardingSkip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get onboardingSkip;

  /// No description provided for @onboardingNext.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get onboardingNext;

  /// No description provided for @loginWelcomeBack.
  ///
  /// In en, this message translates to:
  /// **'Welcome Back!'**
  String get loginWelcomeBack;

  /// No description provided for @loginSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Log in to manage your wood cycle.'**
  String get loginSubtitle;

  /// No description provided for @loginEmailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get loginEmailLabel;

  /// No description provided for @loginEmailHint.
  ///
  /// In en, this message translates to:
  /// **'Enter your email'**
  String get loginEmailHint;

  /// No description provided for @loginPasswordLabel.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get loginPasswordLabel;

  /// No description provided for @loginPasswordHint.
  ///
  /// In en, this message translates to:
  /// **'Enter your password'**
  String get loginPasswordHint;

  /// No description provided for @loginForgotPasswordLink.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get loginForgotPasswordLink;

  /// No description provided for @loginButton.
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get loginButton;

  /// No description provided for @loginOrContinueWith.
  ///
  /// In en, this message translates to:
  /// **'Or continue with'**
  String get loginOrContinueWith;

  /// No description provided for @loginGoogle.
  ///
  /// In en, this message translates to:
  /// **'Google'**
  String get loginGoogle;

  /// No description provided for @loginApple.
  ///
  /// In en, this message translates to:
  /// **'Apple'**
  String get loginApple;

  /// No description provided for @loginDontHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account? '**
  String get loginDontHaveAccount;

  /// No description provided for @loginSignUp.
  ///
  /// In en, this message translates to:
  /// **'Sign Up'**
  String get loginSignUp;

  /// No description provided for @forgotPasswordTitle.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get forgotPasswordTitle;

  /// No description provided for @forgotPasswordSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your email address to receive a password reset link.'**
  String get forgotPasswordSubtitle;

  /// No description provided for @forgotPasswordEmailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email Address'**
  String get forgotPasswordEmailLabel;

  /// No description provided for @forgotPasswordEmailHint.
  ///
  /// In en, this message translates to:
  /// **'you@example.com'**
  String get forgotPasswordEmailHint;

  /// No description provided for @forgotPasswordSendLink.
  ///
  /// In en, this message translates to:
  /// **'Send Link'**
  String get forgotPasswordSendLink;

  /// No description provided for @forgotPasswordBackToLogin.
  ///
  /// In en, this message translates to:
  /// **'Back to Login'**
  String get forgotPasswordBackToLogin;

  /// No description provided for @b2bProfileTitle.
  ///
  /// In en, this message translates to:
  /// **'Business Profile'**
  String get b2bProfileTitle;

  /// No description provided for @b2bProfileActivity.
  ///
  /// In en, this message translates to:
  /// **'Activity'**
  String get b2bProfileActivity;

  /// No description provided for @b2bProfileCertification.
  ///
  /// In en, this message translates to:
  /// **'Certification'**
  String get b2bProfileCertification;

  /// No description provided for @b2bProfileComplete.
  ///
  /// In en, this message translates to:
  /// **'Complete'**
  String get b2bProfileComplete;

  /// No description provided for @b2bProfileCompanyInfo.
  ///
  /// In en, this message translates to:
  /// **'Company Information'**
  String get b2bProfileCompanyInfo;

  /// No description provided for @b2bProfileDigitalWallet.
  ///
  /// In en, this message translates to:
  /// **'Digital Wallet'**
  String get b2bProfileDigitalWallet;

  /// No description provided for @b2bProfileLegalDocs.
  ///
  /// In en, this message translates to:
  /// **'Legality Documents'**
  String get b2bProfileLegalDocs;

  /// No description provided for @b2bProfileAccountSecurity.
  ///
  /// In en, this message translates to:
  /// **'Account Security'**
  String get b2bProfileAccountSecurity;

  /// No description provided for @b2bProfileHelpCenter.
  ///
  /// In en, this message translates to:
  /// **'Help Center'**
  String get b2bProfileHelpCenter;

  /// No description provided for @b2bProfileLogout.
  ///
  /// In en, this message translates to:
  /// **'Log Out'**
  String get b2bProfileLogout;

  /// No description provided for @notificationTitle.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notificationTitle;

  /// No description provided for @notificationMarkRead.
  ///
  /// In en, this message translates to:
  /// **'Mark as Read'**
  String get notificationMarkRead;

  /// No description provided for @notificationNew.
  ///
  /// In en, this message translates to:
  /// **'New'**
  String get notificationNew;

  /// No description provided for @notificationEarlier.
  ///
  /// In en, this message translates to:
  /// **'Earlier'**
  String get notificationEarlier;

  /// No description provided for @walletTitle.
  ///
  /// In en, this message translates to:
  /// **'WoodLoop Wallet'**
  String get walletTitle;

  /// No description provided for @walletTotalBalance.
  ///
  /// In en, this message translates to:
  /// **'Total Active Balance'**
  String get walletTotalBalance;

  /// No description provided for @walletTopUp.
  ///
  /// In en, this message translates to:
  /// **'Top Up'**
  String get walletTopUp;

  /// No description provided for @walletTransfer.
  ///
  /// In en, this message translates to:
  /// **'Transfer'**
  String get walletTransfer;

  /// No description provided for @walletWithdraw.
  ///
  /// In en, this message translates to:
  /// **'Withdraw'**
  String get walletWithdraw;

  /// No description provided for @walletHistoryIcon.
  ///
  /// In en, this message translates to:
  /// **'History'**
  String get walletHistoryIcon;

  /// No description provided for @walletRecentTransactions.
  ///
  /// In en, this message translates to:
  /// **'Recent Transactions'**
  String get walletRecentTransactions;

  /// No description provided for @designerReviews.
  ///
  /// In en, this message translates to:
  /// **' ({count} Reviews)'**
  String designerReviews(String count);

  /// No description provided for @designerStatProducts.
  ///
  /// In en, this message translates to:
  /// **'Products'**
  String get designerStatProducts;

  /// No description provided for @designerStatSaved.
  ///
  /// In en, this message translates to:
  /// **'Saved'**
  String get designerStatSaved;

  /// No description provided for @designerStatCustomProjects.
  ///
  /// In en, this message translates to:
  /// **'Custom Projects'**
  String get designerStatCustomProjects;

  /// No description provided for @designerConsultButton.
  ///
  /// In en, this message translates to:
  /// **'Design Consultation'**
  String get designerConsultButton;

  /// No description provided for @designerPortfolioTitle.
  ///
  /// In en, this message translates to:
  /// **'Upcycle Portfolio'**
  String get designerPortfolioTitle;

  /// No description provided for @supplierDashWelcome.
  ///
  /// In en, this message translates to:
  /// **'Welcome back,'**
  String get supplierDashWelcome;

  /// No description provided for @supplierDashOverviewTitle.
  ///
  /// In en, this message translates to:
  /// **'Dashboard Overview'**
  String get supplierDashOverviewTitle;

  /// No description provided for @supplierDashMonthlyRevenue.
  ///
  /// In en, this message translates to:
  /// **'Monthly Revenue'**
  String get supplierDashMonthlyRevenue;

  /// No description provided for @supplierDashTotalStock.
  ///
  /// In en, this message translates to:
  /// **'Total Timber Stock'**
  String get supplierDashTotalStock;

  /// No description provided for @supplierDashActiveListings.
  ///
  /// In en, this message translates to:
  /// **'Active Listings'**
  String get supplierDashActiveListings;

  /// No description provided for @supplierDashListNewTimber.
  ///
  /// In en, this message translates to:
  /// **'List New Timber'**
  String get supplierDashListNewTimber;

  /// No description provided for @supplierDashRecentSales.
  ///
  /// In en, this message translates to:
  /// **'Recent Sales'**
  String get supplierDashRecentSales;

  /// No description provided for @supplierDashViewAll.
  ///
  /// In en, this message translates to:
  /// **'View All'**
  String get supplierDashViewAll;

  /// No description provided for @navDashboard.
  ///
  /// In en, this message translates to:
  /// **'Dashboard'**
  String get navDashboard;

  /// No description provided for @navMarket.
  ///
  /// In en, this message translates to:
  /// **'Market'**
  String get navMarket;

  /// No description provided for @navInventory.
  ///
  /// In en, this message translates to:
  /// **'Inventory'**
  String get navInventory;

  /// No description provided for @navMessages.
  ///
  /// In en, this message translates to:
  /// **'Messages'**
  String get navMessages;

  /// No description provided for @navProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get navProfile;

  /// No description provided for @supplierRegStep1.
  ///
  /// In en, this message translates to:
  /// **'Step 1 of 3'**
  String get supplierRegStep1;

  /// No description provided for @supplierRegTitle.
  ///
  /// In en, this message translates to:
  /// **'Create Supplier Account'**
  String get supplierRegTitle;

  /// No description provided for @supplierRegSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Connect your timber business to WoodLoop.'**
  String get supplierRegSubtitle;

  /// No description provided for @supplierRegFullNameLabel.
  ///
  /// In en, this message translates to:
  /// **'FULL NAME'**
  String get supplierRegFullNameLabel;

  /// No description provided for @supplierRegFullNameHint.
  ///
  /// In en, this message translates to:
  /// **'John Doe'**
  String get supplierRegFullNameHint;

  /// No description provided for @supplierRegCompanyNameLabel.
  ///
  /// In en, this message translates to:
  /// **'COMPANY NAME'**
  String get supplierRegCompanyNameLabel;

  /// No description provided for @supplierRegCompanyNameHint.
  ///
  /// In en, this message translates to:
  /// **'Jepara Teak Mill'**
  String get supplierRegCompanyNameHint;

  /// No description provided for @supplierRegPhoneLabel.
  ///
  /// In en, this message translates to:
  /// **'PHONE NUMBER'**
  String get supplierRegPhoneLabel;

  /// No description provided for @supplierRegAddressLabel.
  ///
  /// In en, this message translates to:
  /// **'BUSINESS ADDRESS'**
  String get supplierRegAddressLabel;

  /// No description provided for @supplierRegMapHint.
  ///
  /// In en, this message translates to:
  /// **'Tap the map to pin your exact mill location.'**
  String get supplierRegMapHint;

  /// No description provided for @supplierRegCertLabel.
  ///
  /// In en, this message translates to:
  /// **'LEGAL CERTIFICATIONS'**
  String get supplierRegCertLabel;

  /// No description provided for @supplierRegCertRequired.
  ///
  /// In en, this message translates to:
  /// **'Required'**
  String get supplierRegCertRequired;

  /// No description provided for @supplierRegUploadTitle.
  ///
  /// In en, this message translates to:
  /// **'Upload SVLK or FSC'**
  String get supplierRegUploadTitle;

  /// No description provided for @supplierRegUploadHint.
  ///
  /// In en, this message translates to:
  /// **'PDF, JPG or PNG (Max 5MB)'**
  String get supplierRegUploadHint;

  /// No description provided for @supplierRegTermsPrefix.
  ///
  /// In en, this message translates to:
  /// **'By registering, you agree to our '**
  String get supplierRegTermsPrefix;

  /// No description provided for @supplierRegTermsLink.
  ///
  /// In en, this message translates to:
  /// **'Terms of Service'**
  String get supplierRegTermsLink;

  /// No description provided for @supplierRegTermsAnd.
  ///
  /// In en, this message translates to:
  /// **'\nand '**
  String get supplierRegTermsAnd;

  /// No description provided for @supplierRegPrivacyLink.
  ///
  /// In en, this message translates to:
  /// **'Privacy Policy'**
  String get supplierRegPrivacyLink;

  /// No description provided for @supplierRegTermsSuffix.
  ///
  /// In en, this message translates to:
  /// **'.'**
  String get supplierRegTermsSuffix;

  /// No description provided for @supplierRegCompleteBtn.
  ///
  /// In en, this message translates to:
  /// **'Complete Registration'**
  String get supplierRegCompleteBtn;

  /// No description provided for @supplierRegAlreadyHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Already have an account? '**
  String get supplierRegAlreadyHaveAccount;

  /// No description provided for @supplierRegLoginLink.
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get supplierRegLoginLink;

  /// No description provided for @supplierSalesHistoryTitle.
  ///
  /// In en, this message translates to:
  /// **'Sales History'**
  String get supplierSalesHistoryTitle;

  /// No description provided for @supplierSalesHistoryFilterAll.
  ///
  /// In en, this message translates to:
  /// **'All Orders'**
  String get supplierSalesHistoryFilterAll;

  /// No description provided for @supplierSalesHistoryFilterCompleted.
  ///
  /// In en, this message translates to:
  /// **'Completed'**
  String get supplierSalesHistoryFilterCompleted;

  /// No description provided for @supplierSalesHistoryFilterProcessing.
  ///
  /// In en, this message translates to:
  /// **'Processing'**
  String get supplierSalesHistoryFilterProcessing;

  /// No description provided for @supplierSalesHistoryFilterShipped.
  ///
  /// In en, this message translates to:
  /// **'Shipped'**
  String get supplierSalesHistoryFilterShipped;

  /// No description provided for @supplierSalesHistoryFilterCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get supplierSalesHistoryFilterCancelled;

  /// No description provided for @supplierSalesHistoryTotalRevenue.
  ///
  /// In en, this message translates to:
  /// **'Total Revenue'**
  String get supplierSalesHistoryTotalRevenue;

  /// No description provided for @supplierSalesHistoryOrdersCompleted.
  ///
  /// In en, this message translates to:
  /// **'Orders Completed'**
  String get supplierSalesHistoryOrdersCompleted;

  /// No description provided for @supplierSalesHistorySearchHint.
  ///
  /// In en, this message translates to:
  /// **'Search orders...'**
  String get supplierSalesHistorySearchHint;

  /// No description provided for @supplierSalesHistoryToday.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get supplierSalesHistoryToday;

  /// No description provided for @supplierSalesHistoryYesterdayMock.
  ///
  /// In en, this message translates to:
  /// **'Yesterday, Oct 24'**
  String get supplierSalesHistoryYesterdayMock;

  /// No description provided for @supplierSalesHistoryDateMock.
  ///
  /// In en, this message translates to:
  /// **'Oct 22, 2023'**
  String get supplierSalesHistoryDateMock;

  /// No description provided for @supplierSalesHistoryVsLastMonth.
  ///
  /// In en, this message translates to:
  /// **' vs last month'**
  String get supplierSalesHistoryVsLastMonth;

  /// No description provided for @supplierSalesHistoryNoOrders.
  ///
  /// In en, this message translates to:
  /// **'No orders found.'**
  String get supplierSalesHistoryNoOrders;

  /// No description provided for @supplierListTimberCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get supplierListTimberCancel;

  /// No description provided for @supplierListTimberTitle.
  ///
  /// In en, this message translates to:
  /// **'New Listing'**
  String get supplierListTimberTitle;

  /// No description provided for @supplierListTimberCaptureTitle.
  ///
  /// In en, this message translates to:
  /// **'Capture Timber'**
  String get supplierListTimberCaptureTitle;

  /// No description provided for @supplierListTimberCaptureSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Tap to add photos of log ends and bark texture'**
  String get supplierListTimberCaptureSubtitle;

  /// No description provided for @supplierListTimberSpecsTitle.
  ///
  /// In en, this message translates to:
  /// **'Specifications'**
  String get supplierListTimberSpecsTitle;

  /// No description provided for @supplierListTimberSpecsSpecies.
  ///
  /// In en, this message translates to:
  /// **'Wood Species'**
  String get supplierListTimberSpecsSpecies;

  /// No description provided for @supplierListTimberSpecsSpeciesHint.
  ///
  /// In en, this message translates to:
  /// **'Select species (e.g. Jati)'**
  String get supplierListTimberSpecsSpeciesHint;

  /// No description provided for @supplierListTimberSpeciesJati.
  ///
  /// In en, this message translates to:
  /// **'Jati (Teak)'**
  String get supplierListTimberSpeciesJati;

  /// No description provided for @supplierListTimberSpeciesMahoni.
  ///
  /// In en, this message translates to:
  /// **'Mahoni (Mahogany)'**
  String get supplierListTimberSpeciesMahoni;

  /// No description provided for @supplierListTimberSpeciesMerbau.
  ///
  /// In en, this message translates to:
  /// **'Merbau'**
  String get supplierListTimberSpeciesMerbau;

  /// No description provided for @supplierListTimberSpeciesSengon.
  ///
  /// In en, this message translates to:
  /// **'Sengon'**
  String get supplierListTimberSpeciesSengon;

  /// No description provided for @supplierListTimberSpeciesUlin.
  ///
  /// In en, this message translates to:
  /// **'Ulin (Ironwood)'**
  String get supplierListTimberSpeciesUlin;

  /// No description provided for @supplierListTimberSpecsGrade.
  ///
  /// In en, this message translates to:
  /// **'Quality Grade'**
  String get supplierListTimberSpecsGrade;

  /// No description provided for @supplierListTimberDimTitle.
  ///
  /// In en, this message translates to:
  /// **'Dimensions'**
  String get supplierListTimberDimTitle;

  /// No description provided for @supplierListTimberDimDiameter.
  ///
  /// In en, this message translates to:
  /// **'Diameter (cm)'**
  String get supplierListTimberDimDiameter;

  /// No description provided for @supplierListTimberDimLength.
  ///
  /// In en, this message translates to:
  /// **'Length (m)'**
  String get supplierListTimberDimLength;

  /// No description provided for @supplierListTimberDimEstVolume.
  ///
  /// In en, this message translates to:
  /// **'EST. VOLUME'**
  String get supplierListTimberDimEstVolume;

  /// No description provided for @supplierListTimberFinTitle.
  ///
  /// In en, this message translates to:
  /// **'Financials'**
  String get supplierListTimberFinTitle;

  /// No description provided for @supplierListTimberFinPrice.
  ///
  /// In en, this message translates to:
  /// **'Price per m³'**
  String get supplierListTimberFinPrice;

  /// No description provided for @supplierListTimberFinTotalApprox.
  ///
  /// In en, this message translates to:
  /// **'Based on volume, total approx: Rp 0'**
  String get supplierListTimberFinTotalApprox;

  /// No description provided for @supplierListTimberCompTitle.
  ///
  /// In en, this message translates to:
  /// **'Compliance'**
  String get supplierListTimberCompTitle;

  /// No description provided for @supplierListTimberCompLegalCert.
  ///
  /// In en, this message translates to:
  /// **'Legal Certification'**
  String get supplierListTimberCompLegalCert;

  /// No description provided for @supplierListTimberCompSvlkorFsc.
  ///
  /// In en, this message translates to:
  /// **'SVLK or FSC Document'**
  String get supplierListTimberCompSvlkorFsc;

  /// No description provided for @supplierListTimberCompUpload.
  ///
  /// In en, this message translates to:
  /// **'Upload PDF / Image'**
  String get supplierListTimberCompUpload;

  /// No description provided for @supplierListTimberPublishBtn.
  ///
  /// In en, this message translates to:
  /// **'Publish to Marketplace'**
  String get supplierListTimberPublishBtn;

  /// No description provided for @supplierListTimberGrade.
  ///
  /// In en, this message translates to:
  /// **'Grade {grade}'**
  String supplierListTimberGrade(String grade);

  /// No description provided for @supplierMarketTitle.
  ///
  /// In en, this message translates to:
  /// **'Raw Timber Market'**
  String get supplierMarketTitle;

  /// No description provided for @supplierMarketSearchHint.
  ///
  /// In en, this message translates to:
  /// **'Search logs, ID, or species...'**
  String get supplierMarketSearchHint;

  /// No description provided for @supplierMarketFilterAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get supplierMarketFilterAll;

  /// No description provided for @supplierMarketFilterTeak.
  ///
  /// In en, this message translates to:
  /// **'Teak (Jati)'**
  String get supplierMarketFilterTeak;

  /// No description provided for @supplierMarketFilterMahogany.
  ///
  /// In en, this message translates to:
  /// **'Mahogany'**
  String get supplierMarketFilterMahogany;

  /// No description provided for @supplierMarketFilterLogs.
  ///
  /// In en, this message translates to:
  /// **'Logs'**
  String get supplierMarketFilterLogs;

  /// No description provided for @supplierMarketFilterFsc.
  ///
  /// In en, this message translates to:
  /// **'FSC Only'**
  String get supplierMarketFilterFsc;

  /// No description provided for @supplierMarketAvailableStock.
  ///
  /// In en, this message translates to:
  /// **'Available Stock'**
  String get supplierMarketAvailableStock;

  /// No description provided for @supplierMarketSortBy.
  ///
  /// In en, this message translates to:
  /// **'Sort by: '**
  String get supplierMarketSortBy;

  /// No description provided for @supplierMarketSortVolumeHigh.
  ///
  /// In en, this message translates to:
  /// **'Volume (High)'**
  String get supplierMarketSortVolumeHigh;

  /// No description provided for @supplierMarketShowingListings.
  ///
  /// In en, this message translates to:
  /// **'Showing 142 listings from verified suppliers in Jepara'**
  String get supplierMarketShowingListings;

  /// No description provided for @supplierMarketBulkInquiry.
  ///
  /// In en, this message translates to:
  /// **'Bulk Inquiry'**
  String get supplierMarketBulkInquiry;

  /// No description provided for @supplierMarketNavMarket.
  ///
  /// In en, this message translates to:
  /// **'Market'**
  String get supplierMarketNavMarket;

  /// No description provided for @supplierMarketNavInventory.
  ///
  /// In en, this message translates to:
  /// **'Inventory'**
  String get supplierMarketNavInventory;

  /// No description provided for @supplierMarketNavMessages.
  ///
  /// In en, this message translates to:
  /// **'Messages'**
  String get supplierMarketNavMessages;

  /// No description provided for @supplierMarketNavProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get supplierMarketNavProfile;

  /// No description provided for @supplierMarketSupplierPrefix.
  ///
  /// In en, this message translates to:
  /// **'Supplier: {supplier}'**
  String supplierMarketSupplierPrefix(String supplier);

  /// No description provided for @supplierMarketMinOrder.
  ///
  /// In en, this message translates to:
  /// **'Min. Order: {minOrder}'**
  String supplierMarketMinOrder(String minOrder);

  /// No description provided for @supplierMarketSpecThick.
  ///
  /// In en, this message translates to:
  /// **'THICK'**
  String get supplierMarketSpecThick;

  /// No description provided for @supplierMarketSpecWidth.
  ///
  /// In en, this message translates to:
  /// **'WIDTH'**
  String get supplierMarketSpecWidth;

  /// No description provided for @supplierMarketSpecProcess.
  ///
  /// In en, this message translates to:
  /// **'PROCESS'**
  String get supplierMarketSpecProcess;

  /// No description provided for @supplierMarketSpecDry.
  ///
  /// In en, this message translates to:
  /// **' Dry'**
  String get supplierMarketSpecDry;

  /// No description provided for @supplierMarketAvailableVol.
  ///
  /// In en, this message translates to:
  /// **'Available Volume'**
  String get supplierMarketAvailableVol;

  /// No description provided for @supplierMarketAddToQuote.
  ///
  /// In en, this message translates to:
  /// **'Add to Quote'**
  String get supplierMarketAddToQuote;

  /// No description provided for @supplierMarketOutOfStock.
  ///
  /// In en, this message translates to:
  /// **'Out of Stock'**
  String get supplierMarketOutOfStock;

  /// No description provided for @supplierMarketNotifyAvailable.
  ///
  /// In en, this message translates to:
  /// **'Notify When Available'**
  String get supplierMarketNotifyAvailable;

  /// No description provided for @generatorRegStep.
  ///
  /// In en, this message translates to:
  /// **'Step 1 of 2'**
  String get generatorRegStep;

  /// No description provided for @generatorRegTitle.
  ///
  /// In en, this message translates to:
  /// **'Register Workshop'**
  String get generatorRegTitle;

  /// No description provided for @generatorRegSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your workshop information to join the circular economy network.'**
  String get generatorRegSubtitle;

  /// No description provided for @generatorRegWorkshopName.
  ///
  /// In en, this message translates to:
  /// **'WORKSHOP NAME'**
  String get generatorRegWorkshopName;

  /// No description provided for @generatorRegWorkshopHint.
  ///
  /// In en, this message translates to:
  /// **'Jepara Artisans'**
  String get generatorRegWorkshopHint;

  /// No description provided for @generatorRegOwnerName.
  ///
  /// In en, this message translates to:
  /// **'OWNER FULL NAME'**
  String get generatorRegOwnerName;

  /// No description provided for @generatorRegOwnerHint.
  ///
  /// In en, this message translates to:
  /// **'Budi Santoso'**
  String get generatorRegOwnerHint;

  /// No description provided for @generatorRegPhone.
  ///
  /// In en, this message translates to:
  /// **'PHONE NUMBER'**
  String get generatorRegPhone;

  /// No description provided for @generatorRegPhoneHint.
  ///
  /// In en, this message translates to:
  /// **'812 3456 7890'**
  String get generatorRegPhoneHint;

  /// No description provided for @generatorRegLocation.
  ///
  /// In en, this message translates to:
  /// **'WORKSHOP LOCATION'**
  String get generatorRegLocation;

  /// No description provided for @generatorRegSetMap.
  ///
  /// In en, this message translates to:
  /// **'Set Exact Location via Map'**
  String get generatorRegSetMap;

  /// No description provided for @generatorRegMapSub.
  ///
  /// In en, this message translates to:
  /// **'For pickup route optimization'**
  String get generatorRegMapSub;

  /// No description provided for @generatorRegWasteFocus.
  ///
  /// In en, this message translates to:
  /// **'Typical Waste Output'**
  String get generatorRegWasteFocus;

  /// No description provided for @generatorRegWasteSub.
  ///
  /// In en, this message translates to:
  /// **'Select all that apply to your production'**
  String get generatorRegWasteSub;

  /// No description provided for @generatorRegWasteSawdust.
  ///
  /// In en, this message translates to:
  /// **'Sawdust (Serbuk)'**
  String get generatorRegWasteSawdust;

  /// No description provided for @generatorRegWasteOffcuts.
  ///
  /// In en, this message translates to:
  /// **'Offcuts (Potongan)'**
  String get generatorRegWasteOffcuts;

  /// No description provided for @generatorRegWasteChips.
  ///
  /// In en, this message translates to:
  /// **'Wood Chips'**
  String get generatorRegWasteChips;

  /// No description provided for @generatorRegWastePallets.
  ///
  /// In en, this message translates to:
  /// **'Pallets'**
  String get generatorRegWastePallets;

  /// No description provided for @generatorRegWasteBark.
  ///
  /// In en, this message translates to:
  /// **'Bark'**
  String get generatorRegWasteBark;

  /// No description provided for @generatorRegVolLabel.
  ///
  /// In en, this message translates to:
  /// **'EST. MONTHLY VOLUME (KG)'**
  String get generatorRegVolLabel;

  /// No description provided for @generatorRegVolHint.
  ///
  /// In en, this message translates to:
  /// **'e.g. 500'**
  String get generatorRegVolHint;

  /// No description provided for @generatorRegCompleteBtn.
  ///
  /// In en, this message translates to:
  /// **'Complete Registration'**
  String get generatorRegCompleteBtn;

  /// No description provided for @generatorDashWelcome.
  ///
  /// In en, this message translates to:
  /// **'WELCOME BACK'**
  String get generatorDashWelcome;

  /// No description provided for @generatorDashTotalWaste.
  ///
  /// In en, this message translates to:
  /// **'Total Waste Recycled'**
  String get generatorDashTotalWaste;

  /// No description provided for @generatorDashProductsSold.
  ///
  /// In en, this message translates to:
  /// **'PRODUCTS SOLD'**
  String get generatorDashProductsSold;

  /// No description provided for @generatorDashConversion.
  ///
  /// In en, this message translates to:
  /// **'CONVERSION'**
  String get generatorDashConversion;

  /// No description provided for @generatorDashRevenue.
  ///
  /// In en, this message translates to:
  /// **'Revenue'**
  String get generatorDashRevenue;

  /// No description provided for @generatorDashPickup.
  ///
  /// In en, this message translates to:
  /// **'Pickups'**
  String get generatorDashPickup;

  /// No description provided for @generatorDashRawMatStock.
  ///
  /// In en, this message translates to:
  /// **'Raw Material Stock'**
  String get generatorDashRawMatStock;

  /// No description provided for @generatorDashHardwood.
  ///
  /// In en, this message translates to:
  /// **'Hardwood'**
  String get generatorDashHardwood;

  /// No description provided for @generatorDashSoftwood.
  ///
  /// In en, this message translates to:
  /// **'Softwood'**
  String get generatorDashSoftwood;

  /// No description provided for @generatorDashManageOutput.
  ///
  /// In en, this message translates to:
  /// **'Manage Your Output'**
  String get generatorDashManageOutput;

  /// No description provided for @generatorDashManageOutputSub.
  ///
  /// In en, this message translates to:
  /// **'List waste for collectors to pick up or add finished products to the marketplace.'**
  String get generatorDashManageOutputSub;

  /// No description provided for @generatorDashReportWasteBtn.
  ///
  /// In en, this message translates to:
  /// **'Report / Sell Waste'**
  String get generatorDashReportWasteBtn;

  /// No description provided for @generatorDashAddProductBtn.
  ///
  /// In en, this message translates to:
  /// **'Add New Product'**
  String get generatorDashAddProductBtn;

  /// No description provided for @generatorDashFinishedProducts.
  ///
  /// In en, this message translates to:
  /// **'Finished Products'**
  String get generatorDashFinishedProducts;

  /// No description provided for @generatorDashSeeAll.
  ///
  /// In en, this message translates to:
  /// **'See All'**
  String get generatorDashSeeAll;

  /// No description provided for @generatorDashRecentWaste.
  ///
  /// In en, this message translates to:
  /// **'Recent Waste Postings'**
  String get generatorDashRecentWaste;

  /// No description provided for @generatorDashStatusPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get generatorDashStatusPending;

  /// No description provided for @generatorDashStatusPickedUp.
  ///
  /// In en, this message translates to:
  /// **'Picked Up'**
  String get generatorDashStatusPickedUp;

  /// No description provided for @generatorDashStatusSold.
  ///
  /// In en, this message translates to:
  /// **'Sold'**
  String get generatorDashStatusSold;

  /// No description provided for @generatorDashInStock.
  ///
  /// In en, this message translates to:
  /// **'In Stock'**
  String get generatorDashInStock;

  /// No description provided for @generatorAddProductTitle.
  ///
  /// In en, this message translates to:
  /// **'Add New Product'**
  String get generatorAddProductTitle;

  /// No description provided for @generatorAddProductPhoto.
  ///
  /// In en, this message translates to:
  /// **'Product Photos'**
  String get generatorAddProductPhoto;

  /// No description provided for @generatorAddProductAddPhotoBtn.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get generatorAddProductAddPhotoBtn;

  /// No description provided for @generatorAddProductPhotoHint.
  ///
  /// In en, this message translates to:
  /// **'Upload high-quality photos. Max 5 images.'**
  String get generatorAddProductPhotoHint;

  /// No description provided for @generatorAddProductName.
  ///
  /// In en, this message translates to:
  /// **'Product Name'**
  String get generatorAddProductName;

  /// No description provided for @generatorAddProductNameHint.
  ///
  /// In en, this message translates to:
  /// **'Example: Reclaimed Teak Coffee Table'**
  String get generatorAddProductNameHint;

  /// No description provided for @generatorAddProductCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get generatorAddProductCategory;

  /// No description provided for @generatorAddProductPrice.
  ///
  /// In en, this message translates to:
  /// **'Price'**
  String get generatorAddProductPrice;

  /// No description provided for @generatorAddProductWoodSpecies.
  ///
  /// In en, this message translates to:
  /// **'Wood Species Used'**
  String get generatorAddProductWoodSpecies;

  /// No description provided for @generatorAddProductOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get generatorAddProductOther;

  /// No description provided for @generatorAddProductDesc.
  ///
  /// In en, this message translates to:
  /// **'Description'**
  String get generatorAddProductDesc;

  /// No description provided for @generatorAddProductDescHint.
  ///
  /// In en, this message translates to:
  /// **'Describe craftsmanship, finishing, and dimensions...'**
  String get generatorAddProductDescHint;

  /// No description provided for @generatorAddProductWoodSource.
  ///
  /// In en, this message translates to:
  /// **'Wood Source'**
  String get generatorAddProductWoodSource;

  /// No description provided for @generatorAddProductWoodSourceSub.
  ///
  /// In en, this message translates to:
  /// **'Select from Purchase History'**
  String get generatorAddProductWoodSourceSub;

  /// No description provided for @generatorAddProductWoodSourceHint.
  ///
  /// In en, this message translates to:
  /// **'Select wood source...'**
  String get generatorAddProductWoodSourceHint;

  /// No description provided for @generatorAddProductAddSourceManual.
  ///
  /// In en, this message translates to:
  /// **'Add Source Manually'**
  String get generatorAddProductAddSourceManual;

  /// No description provided for @generatorAddProductPublishBtn.
  ///
  /// In en, this message translates to:
  /// **'Publish to Marketplace'**
  String get generatorAddProductPublishBtn;

  /// No description provided for @generatorAddProductSuccessMsg.
  ///
  /// In en, this message translates to:
  /// **'Product successfully published to Marketplace!'**
  String get generatorAddProductSuccessMsg;

  /// No description provided for @generatorAddCategoryFurniture.
  ///
  /// In en, this message translates to:
  /// **'Furniture'**
  String get generatorAddCategoryFurniture;

  /// No description provided for @generatorAddCategorySouvenir.
  ///
  /// In en, this message translates to:
  /// **'Souvenir'**
  String get generatorAddCategorySouvenir;

  /// No description provided for @generatorAddCategoryDecor.
  ///
  /// In en, this message translates to:
  /// **'Decor'**
  String get generatorAddCategoryDecor;

  /// No description provided for @generatorAddSpeciesTeak.
  ///
  /// In en, this message translates to:
  /// **'Teak (Jati)'**
  String get generatorAddSpeciesTeak;

  /// No description provided for @generatorAddSpeciesMahogany.
  ///
  /// In en, this message translates to:
  /// **'Mahogany'**
  String get generatorAddSpeciesMahogany;

  /// No description provided for @generatorAddSpeciesPine.
  ///
  /// In en, this message translates to:
  /// **'Pine (Pinus)'**
  String get generatorAddSpeciesPine;

  /// No description provided for @generatorAddSpeciesSonokeling.
  ///
  /// In en, this message translates to:
  /// **'Sonokeling'**
  String get generatorAddSpeciesSonokeling;

  /// No description provided for @generatorAddSourceMock1.
  ///
  /// In en, this message translates to:
  /// **'Log #TR-204 – Teak from Perhutani'**
  String get generatorAddSourceMock1;

  /// No description provided for @generatorAddSourceMock2.
  ///
  /// In en, this message translates to:
  /// **'Log #TR-198 – Mahogany from Blora'**
  String get generatorAddSourceMock2;

  /// No description provided for @generatorAddSourceMock3.
  ///
  /// In en, this message translates to:
  /// **'Log #TR-155 – Pine from Lembang'**
  String get generatorAddSourceMock3;

  /// No description provided for @generatorReportTitle.
  ///
  /// In en, this message translates to:
  /// **'Log Wood Waste'**
  String get generatorReportTitle;

  /// No description provided for @generatorReportCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get generatorReportCancel;

  /// No description provided for @generatorReportStep1.
  ///
  /// In en, this message translates to:
  /// **'1'**
  String get generatorReportStep1;

  /// No description provided for @generatorReportStep1Title.
  ///
  /// In en, this message translates to:
  /// **'Capture Waste'**
  String get generatorReportStep1Title;

  /// No description provided for @generatorReportUploadPhoto.
  ///
  /// In en, this message translates to:
  /// **'Upload photo for verification'**
  String get generatorReportUploadPhoto;

  /// No description provided for @generatorReportStep2.
  ///
  /// In en, this message translates to:
  /// **'2'**
  String get generatorReportStep2;

  /// No description provided for @generatorReportStep2Title.
  ///
  /// In en, this message translates to:
  /// **'Waste Information'**
  String get generatorReportStep2Title;

  /// No description provided for @generatorReportWasteForm.
  ///
  /// In en, this message translates to:
  /// **'Waste Form'**
  String get generatorReportWasteForm;

  /// No description provided for @generatorReportFormOffcut.
  ///
  /// In en, this message translates to:
  /// **'Offcut'**
  String get generatorReportFormOffcut;

  /// No description provided for @generatorReportFormSawdust.
  ///
  /// In en, this message translates to:
  /// **'Sawdust'**
  String get generatorReportFormSawdust;

  /// No description provided for @generatorReportFormShaving.
  ///
  /// In en, this message translates to:
  /// **'Shaving'**
  String get generatorReportFormShaving;

  /// No description provided for @generatorReportFormLogEnd.
  ///
  /// In en, this message translates to:
  /// **'Log End'**
  String get generatorReportFormLogEnd;

  /// No description provided for @generatorReportWoodCondition.
  ///
  /// In en, this message translates to:
  /// **'Wood Condition'**
  String get generatorReportWoodCondition;

  /// No description provided for @generatorReportConditionDry.
  ///
  /// In en, this message translates to:
  /// **'Dry'**
  String get generatorReportConditionDry;

  /// No description provided for @generatorReportConditionWet.
  ///
  /// In en, this message translates to:
  /// **'Wet'**
  String get generatorReportConditionWet;

  /// No description provided for @generatorReportConditionMixed.
  ///
  /// In en, this message translates to:
  /// **'Mixed'**
  String get generatorReportConditionMixed;

  /// No description provided for @generatorReportStep3.
  ///
  /// In en, this message translates to:
  /// **'3'**
  String get generatorReportStep3;

  /// No description provided for @generatorReportStep3Title.
  ///
  /// In en, this message translates to:
  /// **'Waste Details'**
  String get generatorReportStep3Title;

  /// No description provided for @generatorReportQuantity.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get generatorReportQuantity;

  /// No description provided for @generatorReportUnit.
  ///
  /// In en, this message translates to:
  /// **'Unit'**
  String get generatorReportUnit;

  /// No description provided for @generatorReportDensityHint.
  ///
  /// In en, this message translates to:
  /// **'Estimated density for teak is ~650kg/m³'**
  String get generatorReportDensityHint;

  /// No description provided for @generatorReportStep4.
  ///
  /// In en, this message translates to:
  /// **'4'**
  String get generatorReportStep4;

  /// No description provided for @generatorReportStep4Title.
  ///
  /// In en, this message translates to:
  /// **'Pickup Location'**
  String get generatorReportStep4Title;

  /// No description provided for @generatorReportCurrentLocation.
  ///
  /// In en, this message translates to:
  /// **'Current Location'**
  String get generatorReportCurrentLocation;

  /// No description provided for @generatorReportMockLocation.
  ///
  /// In en, this message translates to:
  /// **'Jepara Workshop A, Jl. Pemuda No. 45'**
  String get generatorReportMockLocation;

  /// No description provided for @generatorReportEstValue.
  ///
  /// In en, this message translates to:
  /// **'EST. VALUE (IDR)'**
  String get generatorReportEstValue;

  /// No description provided for @generatorReportCurrency.
  ///
  /// In en, this message translates to:
  /// **'Rp'**
  String get generatorReportCurrency;

  /// No description provided for @generatorReportPoints.
  ///
  /// In en, this message translates to:
  /// **'POINTS'**
  String get generatorReportPoints;

  /// No description provided for @generatorReportSubmitBtn.
  ///
  /// In en, this message translates to:
  /// **'Submit to Marketplace'**
  String get generatorReportSubmitBtn;

  /// No description provided for @generatorReportSuccessMsg.
  ///
  /// In en, this message translates to:
  /// **'Waste successfully reported to Marketplace!'**
  String get generatorReportSuccessMsg;

  /// No description provided for @generatorOrderMgmtTitle.
  ///
  /// In en, this message translates to:
  /// **'Manage Orders & History'**
  String get generatorOrderMgmtTitle;

  /// No description provided for @generatorOrderMgmtTabActive.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get generatorOrderMgmtTabActive;

  /// No description provided for @generatorOrderMgmtTabCompleted.
  ///
  /// In en, this message translates to:
  /// **'Completed'**
  String get generatorOrderMgmtTabCompleted;

  /// No description provided for @generatorOrderMgmtStatusWaiting.
  ///
  /// In en, this message translates to:
  /// **'Waiting Pickup'**
  String get generatorOrderMgmtStatusWaiting;

  /// No description provided for @generatorOrderMgmtStatusEnRoute.
  ///
  /// In en, this message translates to:
  /// **'En Route'**
  String get generatorOrderMgmtStatusEnRoute;

  /// No description provided for @generatorOrderMgmtScanQRBtn.
  ///
  /// In en, this message translates to:
  /// **'Scan Aggregator QR'**
  String get generatorOrderMgmtScanQRBtn;

  /// No description provided for @aggregatorRegStepInfo.
  ///
  /// In en, this message translates to:
  /// **'Step 1 of 2'**
  String get aggregatorRegStepInfo;

  /// No description provided for @aggregatorRegTitle.
  ///
  /// In en, this message translates to:
  /// **'Register as Aggregator'**
  String get aggregatorRegTitle;

  /// No description provided for @aggregatorRegSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your personal and vehicle details to start collecting waste and earning profit.'**
  String get aggregatorRegSubtitle;

  /// No description provided for @aggregatorRegFullName.
  ///
  /// In en, this message translates to:
  /// **'FULL NAME'**
  String get aggregatorRegFullName;

  /// No description provided for @aggregatorRegFullNameHint.
  ///
  /// In en, this message translates to:
  /// **'Budi Logistics'**
  String get aggregatorRegFullNameHint;

  /// No description provided for @aggregatorRegIdCard.
  ///
  /// In en, this message translates to:
  /// **'ID CARD NUMBER (NIK)'**
  String get aggregatorRegIdCard;

  /// No description provided for @aggregatorRegIdCardHint.
  ///
  /// In en, this message translates to:
  /// **'3320...'**
  String get aggregatorRegIdCardHint;

  /// No description provided for @aggregatorRegPhone.
  ///
  /// In en, this message translates to:
  /// **'PHONE NUMBER'**
  String get aggregatorRegPhone;

  /// No description provided for @aggregatorRegPhoneHint.
  ///
  /// In en, this message translates to:
  /// **'812 3456 7890'**
  String get aggregatorRegPhoneHint;

  /// No description provided for @aggregatorRegVehicleType.
  ///
  /// In en, this message translates to:
  /// **'Vehicle Type'**
  String get aggregatorRegVehicleType;

  /// No description provided for @aggregatorRegVehicleTypeHint.
  ///
  /// In en, this message translates to:
  /// **'Select the main vehicle you use'**
  String get aggregatorRegVehicleTypeHint;

  /// No description provided for @aggregatorRegVehicleMotorcart.
  ///
  /// In en, this message translates to:
  /// **'Motorcart'**
  String get aggregatorRegVehicleMotorcart;

  /// No description provided for @aggregatorRegVehicleMotorcartCap.
  ///
  /// In en, this message translates to:
  /// **'< 100 kg'**
  String get aggregatorRegVehicleMotorcartCap;

  /// No description provided for @aggregatorRegVehiclePickup.
  ///
  /// In en, this message translates to:
  /// **'Pick-up Truck'**
  String get aggregatorRegVehiclePickup;

  /// No description provided for @aggregatorRegVehiclePickupCap.
  ///
  /// In en, this message translates to:
  /// **'100 - 800 kg'**
  String get aggregatorRegVehiclePickupCap;

  /// No description provided for @aggregatorRegVehicleTruck.
  ///
  /// In en, this message translates to:
  /// **'Light Truck'**
  String get aggregatorRegVehicleTruck;

  /// No description provided for @aggregatorRegVehicleTruckCap.
  ///
  /// In en, this message translates to:
  /// **'> 800 kg'**
  String get aggregatorRegVehicleTruckCap;

  /// No description provided for @aggregatorRegLicensePlate.
  ///
  /// In en, this message translates to:
  /// **'VEHICLE LICENSE PLATE'**
  String get aggregatorRegLicensePlate;

  /// No description provided for @aggregatorRegLicensePlateHint.
  ///
  /// In en, this message translates to:
  /// **'K 1234 XY'**
  String get aggregatorRegLicensePlateHint;

  /// No description provided for @aggregatorRegSubmitBtn.
  ///
  /// In en, this message translates to:
  /// **'Complete Registration'**
  String get aggregatorRegSubmitBtn;

  /// No description provided for @aggregatorDashGreeting.
  ///
  /// In en, this message translates to:
  /// **'Good Morning,'**
  String get aggregatorDashGreeting;

  /// No description provided for @aggregatorDashEstIncome.
  ///
  /// In en, this message translates to:
  /// **'Estimated Income Today'**
  String get aggregatorDashEstIncome;

  /// No description provided for @aggregatorDashTaskCount.
  ///
  /// In en, this message translates to:
  /// **'Tasks'**
  String get aggregatorDashTaskCount;

  /// No description provided for @aggregatorDashRouteMap.
  ///
  /// In en, this message translates to:
  /// **'Route Map'**
  String get aggregatorDashRouteMap;

  /// No description provided for @aggregatorDashWarehouse.
  ///
  /// In en, this message translates to:
  /// **'Warehouse'**
  String get aggregatorDashWarehouse;

  /// No description provided for @aggregatorDashPickupSchedule.
  ///
  /// In en, this message translates to:
  /// **'Pickup Schedule'**
  String get aggregatorDashPickupSchedule;

  /// No description provided for @aggregatorDashViewAll.
  ///
  /// In en, this message translates to:
  /// **'View All'**
  String get aggregatorDashViewAll;

  /// No description provided for @aggregatorDashNavHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get aggregatorDashNavHome;

  /// No description provided for @aggregatorDashNavTransaction.
  ///
  /// In en, this message translates to:
  /// **'Transactions'**
  String get aggregatorDashNavTransaction;

  /// No description provided for @aggregatorDashNavProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get aggregatorDashNavProfile;

  /// No description provided for @aggregatorDashMockName.
  ///
  /// In en, this message translates to:
  /// **'Budi Logistics'**
  String get aggregatorDashMockName;

  /// No description provided for @aggregatorDashMockDate.
  ///
  /// In en, this message translates to:
  /// **'09 Nov 2023'**
  String get aggregatorDashMockDate;

  /// No description provided for @aggregatorDashMockIncome.
  ///
  /// In en, this message translates to:
  /// **'Rp 650.000'**
  String get aggregatorDashMockIncome;

  /// No description provided for @aggregatorDashMockRouteDesc1Title.
  ///
  /// In en, this message translates to:
  /// **'Jepara Artisans'**
  String get aggregatorDashMockRouteDesc1Title;

  /// No description provided for @aggregatorDashMockRouteDesc1Sub.
  ///
  /// In en, this message translates to:
  /// **'Teak Sawdust • 50 Kg'**
  String get aggregatorDashMockRouteDesc1Sub;

  /// No description provided for @aggregatorDashMockRouteDesc2Title.
  ///
  /// In en, this message translates to:
  /// **'Pak Slamet Workshop'**
  String get aggregatorDashMockRouteDesc2Title;

  /// No description provided for @aggregatorDashMockRouteDesc2Sub.
  ///
  /// In en, this message translates to:
  /// **'Mahogany Offcuts • 120 Kg'**
  String get aggregatorDashMockRouteDesc2Sub;

  /// No description provided for @aggregatorDashMockRouteDesc3Title.
  ///
  /// In en, this message translates to:
  /// **'UD. Kayu Makmur'**
  String get aggregatorDashMockRouteDesc3Title;

  /// No description provided for @aggregatorDashMockRouteDesc3Sub.
  ///
  /// In en, this message translates to:
  /// **'Used Pallets • 15 Pcs'**
  String get aggregatorDashMockRouteDesc3Sub;

  /// No description provided for @aggregatorMapLocation.
  ///
  /// In en, this message translates to:
  /// **'Jepara, ID'**
  String get aggregatorMapLocation;

  /// No description provided for @aggregatorMapMockTitle.
  ///
  /// In en, this message translates to:
  /// **'Teak Sawdust'**
  String get aggregatorMapMockTitle;

  /// No description provided for @aggregatorMapMockGenerator.
  ///
  /// In en, this message translates to:
  /// **'Generator: Jepara Artisans'**
  String get aggregatorMapMockGenerator;

  /// No description provided for @aggregatorMapMockDistance.
  ///
  /// In en, this message translates to:
  /// **'2.5 km'**
  String get aggregatorMapMockDistance;

  /// No description provided for @aggregatorMapEstWeight.
  ///
  /// In en, this message translates to:
  /// **'EST. WEIGHT'**
  String get aggregatorMapEstWeight;

  /// No description provided for @aggregatorMapMockWeight.
  ///
  /// In en, this message translates to:
  /// **'50 Kg'**
  String get aggregatorMapMockWeight;

  /// No description provided for @aggregatorMapEstProfit.
  ///
  /// In en, this message translates to:
  /// **'POTENTIAL PROFIT'**
  String get aggregatorMapEstProfit;

  /// No description provided for @aggregatorMapMockProfit.
  ///
  /// In en, this message translates to:
  /// **'Rp 25.000'**
  String get aggregatorMapMockProfit;

  /// No description provided for @aggregatorMapTakeTaskBtn.
  ///
  /// In en, this message translates to:
  /// **'Take Pickup Task'**
  String get aggregatorMapTakeTaskBtn;

  /// No description provided for @aggregatorPickupTitle.
  ///
  /// In en, this message translates to:
  /// **'Confirm Pickup'**
  String get aggregatorPickupTitle;

  /// No description provided for @aggregatorPickupCameraHint.
  ///
  /// In en, this message translates to:
  /// **'Point camera to Generator\'s QR\nto confirm'**
  String get aggregatorPickupCameraHint;

  /// No description provided for @aggregatorPickupDetailInfo.
  ///
  /// In en, this message translates to:
  /// **'Pickup Details'**
  String get aggregatorPickupDetailInfo;

  /// No description provided for @aggregatorPickupTicketCode.
  ///
  /// In en, this message translates to:
  /// **'Ticket Code'**
  String get aggregatorPickupTicketCode;

  /// No description provided for @aggregatorPickupMockTicket.
  ///
  /// In en, this message translates to:
  /// **'PKP-8921-A'**
  String get aggregatorPickupMockTicket;

  /// No description provided for @aggregatorPickupGenerator.
  ///
  /// In en, this message translates to:
  /// **'Generator'**
  String get aggregatorPickupGenerator;

  /// No description provided for @aggregatorPickupMockGenName.
  ///
  /// In en, this message translates to:
  /// **'Jepara Artisans'**
  String get aggregatorPickupMockGenName;

  /// No description provided for @aggregatorPickupMaterial.
  ///
  /// In en, this message translates to:
  /// **'Material'**
  String get aggregatorPickupMaterial;

  /// No description provided for @aggregatorPickupMockMaterial.
  ///
  /// In en, this message translates to:
  /// **'Teak Sawdust'**
  String get aggregatorPickupMockMaterial;

  /// No description provided for @aggregatorPickupEstWeight.
  ///
  /// In en, this message translates to:
  /// **'Estimated Weight'**
  String get aggregatorPickupEstWeight;

  /// No description provided for @aggregatorPickupMockWeight.
  ///
  /// In en, this message translates to:
  /// **'50.0 Kg'**
  String get aggregatorPickupMockWeight;

  /// No description provided for @aggregatorPickupEstPayment.
  ///
  /// In en, this message translates to:
  /// **'Potential Payment'**
  String get aggregatorPickupEstPayment;

  /// No description provided for @aggregatorPickupMockPayment.
  ///
  /// In en, this message translates to:
  /// **'Rp 25.000'**
  String get aggregatorPickupMockPayment;

  /// No description provided for @aggregatorPickupManualInput.
  ///
  /// In en, this message translates to:
  /// **'Manual Input/Edit Actual Weight'**
  String get aggregatorPickupManualInput;

  /// No description provided for @aggregatorPickupConfirmBtn.
  ///
  /// In en, this message translates to:
  /// **'Complete Confirmation'**
  String get aggregatorPickupConfirmBtn;

  /// No description provided for @aggregatorWarehouseTitle.
  ///
  /// In en, this message translates to:
  /// **'Aggregator Warehouse'**
  String get aggregatorWarehouseTitle;

  /// No description provided for @aggregatorWarehouseCapacity.
  ///
  /// In en, this message translates to:
  /// **'Warehouse Capacity'**
  String get aggregatorWarehouseCapacity;

  /// No description provided for @aggregatorWarehouseMockCapacity.
  ///
  /// In en, this message translates to:
  /// **'850 Kg / 2000 Kg'**
  String get aggregatorWarehouseMockCapacity;

  /// No description provided for @aggregatorWarehouseFilterAll.
  ///
  /// In en, this message translates to:
  /// **'All Materials'**
  String get aggregatorWarehouseFilterAll;

  /// No description provided for @aggregatorWarehouseFilterSawdust.
  ///
  /// In en, this message translates to:
  /// **'Sawdust'**
  String get aggregatorWarehouseFilterSawdust;

  /// No description provided for @aggregatorWarehouseFilterOffcuts.
  ///
  /// In en, this message translates to:
  /// **'Offcuts'**
  String get aggregatorWarehouseFilterOffcuts;

  /// No description provided for @aggregatorWarehouseFilterPallets.
  ///
  /// In en, this message translates to:
  /// **'Used Pallets'**
  String get aggregatorWarehouseFilterPallets;

  /// No description provided for @aggregatorWarehouseMockItem1Title.
  ///
  /// In en, this message translates to:
  /// **'Mixed Sawdust'**
  String get aggregatorWarehouseMockItem1Title;

  /// No description provided for @aggregatorWarehouseMockItem1Sub.
  ///
  /// In en, this message translates to:
  /// **'Mainly Teak & Mahogany'**
  String get aggregatorWarehouseMockItem1Sub;

  /// No description provided for @aggregatorWarehouseMockItem1Weight.
  ///
  /// In en, this message translates to:
  /// **'500 Kg'**
  String get aggregatorWarehouseMockItem1Weight;

  /// No description provided for @aggregatorWarehouseMockItem2Title.
  ///
  /// In en, this message translates to:
  /// **'Mahogany Offcuts'**
  String get aggregatorWarehouseMockItem2Title;

  /// No description provided for @aggregatorWarehouseMockItem2Sub.
  ///
  /// In en, this message translates to:
  /// **'Small blocks ex-furniture'**
  String get aggregatorWarehouseMockItem2Sub;

  /// No description provided for @aggregatorWarehouseMockItem2Weight.
  ///
  /// In en, this message translates to:
  /// **'250 Kg'**
  String get aggregatorWarehouseMockItem2Weight;

  /// No description provided for @aggregatorWarehouseMockItem3Title.
  ///
  /// In en, this message translates to:
  /// **'Broken Pallet'**
  String get aggregatorWarehouseMockItem3Title;

  /// No description provided for @aggregatorWarehouseMockItem3Sub.
  ///
  /// In en, this message translates to:
  /// **'Pine ex-packaging'**
  String get aggregatorWarehouseMockItem3Sub;

  /// No description provided for @aggregatorWarehouseMockItem3Weight.
  ///
  /// In en, this message translates to:
  /// **'100 Kg'**
  String get aggregatorWarehouseMockItem3Weight;

  /// No description provided for @aggregatorWarehouseSellBtn.
  ///
  /// In en, this message translates to:
  /// **'Sell to Factory (Converter)'**
  String get aggregatorWarehouseSellBtn;

  /// No description provided for @converterRegTitle.
  ///
  /// In en, this message translates to:
  /// **'Register as Converter'**
  String get converterRegTitle;

  /// No description provided for @converterRegHeader.
  ///
  /// In en, this message translates to:
  /// **'Your Studio/Factory Profile'**
  String get converterRegHeader;

  /// No description provided for @converterRegSubHeader.
  ///
  /// In en, this message translates to:
  /// **'Complete data to start looking for wood waste supply or selling your upcycled products.'**
  String get converterRegSubHeader;

  /// No description provided for @converterRegStudioName.
  ///
  /// In en, this message translates to:
  /// **'Studio / Business Name'**
  String get converterRegStudioName;

  /// No description provided for @converterRegStudioNameHint.
  ///
  /// In en, this message translates to:
  /// **'Example: Jepara Eco Art'**
  String get converterRegStudioNameHint;

  /// No description provided for @converterRegOwnerName.
  ///
  /// In en, this message translates to:
  /// **'Owner / PIC Name'**
  String get converterRegOwnerName;

  /// No description provided for @converterRegOwnerNameHint.
  ///
  /// In en, this message translates to:
  /// **'Example: Budi Santoso'**
  String get converterRegOwnerNameHint;

  /// No description provided for @converterRegWhatsApp.
  ///
  /// In en, this message translates to:
  /// **'Active WhatsApp Number'**
  String get converterRegWhatsApp;

  /// No description provided for @converterRegWhatsAppHint.
  ///
  /// In en, this message translates to:
  /// **'081234567890'**
  String get converterRegWhatsAppHint;

  /// No description provided for @converterRegLocation.
  ///
  /// In en, this message translates to:
  /// **'Target Workshop / Warehouse Location'**
  String get converterRegLocation;

  /// No description provided for @converterRegSpecialty.
  ///
  /// In en, this message translates to:
  /// **'Processing Focus / Specialty'**
  String get converterRegSpecialty;

  /// No description provided for @converterRegSpecEcoFurniture.
  ///
  /// In en, this message translates to:
  /// **'Eco-Friendly Furniture'**
  String get converterRegSpecEcoFurniture;

  /// No description provided for @converterRegSpecHandicraft.
  ///
  /// In en, this message translates to:
  /// **'Handicraft & Arts'**
  String get converterRegSpecHandicraft;

  /// No description provided for @converterRegSpecBriquette.
  ///
  /// In en, this message translates to:
  /// **'Wood Briquette / Pellet'**
  String get converterRegSpecBriquette;

  /// No description provided for @converterRegSpecCompost.
  ///
  /// In en, this message translates to:
  /// **'Compost / Agriculture'**
  String get converterRegSpecCompost;

  /// No description provided for @converterRegSpecOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get converterRegSpecOther;

  /// No description provided for @converterRegRawMaterialNeed.
  ///
  /// In en, this message translates to:
  /// **'Raw Material Need (Kg/Month)'**
  String get converterRegRawMaterialNeed;

  /// No description provided for @converterRegRawMaterialHint.
  ///
  /// In en, this message translates to:
  /// **'Example: 1000'**
  String get converterRegRawMaterialHint;

  /// No description provided for @converterRegSubmitBtn.
  ///
  /// In en, this message translates to:
  /// **'Register & Enter Studio'**
  String get converterRegSubmitBtn;

  /// No description provided for @converterRegRequiredValidation.
  ///
  /// In en, this message translates to:
  /// **'This field is required'**
  String get converterRegRequiredValidation;

  /// No description provided for @converterDashActiveStudio.
  ///
  /// In en, this message translates to:
  /// **'Active Studio,'**
  String get converterDashActiveStudio;

  /// No description provided for @converterDashMockStudioName.
  ///
  /// In en, this message translates to:
  /// **'Jepara Eco Art'**
  String get converterDashMockStudioName;

  /// No description provided for @converterDashRevenueThisMonth.
  ///
  /// In en, this message translates to:
  /// **'This Month\'s Revenue'**
  String get converterDashRevenueThisMonth;

  /// No description provided for @converterDashMockMonth.
  ///
  /// In en, this message translates to:
  /// **'Nov 2023'**
  String get converterDashMockMonth;

  /// No description provided for @converterDashMockRevenue.
  ///
  /// In en, this message translates to:
  /// **'Rp 12.450.000'**
  String get converterDashMockRevenue;

  /// No description provided for @converterDashSoldLabel.
  ///
  /// In en, this message translates to:
  /// **'Sold'**
  String get converterDashSoldLabel;

  /// No description provided for @converterDashMockSold.
  ///
  /// In en, this message translates to:
  /// **'14'**
  String get converterDashMockSold;

  /// No description provided for @converterDashProcessedLabel.
  ///
  /// In en, this message translates to:
  /// **'Kg Processed'**
  String get converterDashProcessedLabel;

  /// No description provided for @converterDashMockProcessed.
  ///
  /// In en, this message translates to:
  /// **'350'**
  String get converterDashMockProcessed;

  /// No description provided for @converterDashMenuMarketplace.
  ///
  /// In en, this message translates to:
  /// **'Raw Material\nMarketplace'**
  String get converterDashMenuMarketplace;

  /// No description provided for @converterDashMenuCatalog.
  ///
  /// In en, this message translates to:
  /// **'My Product\nCatalog'**
  String get converterDashMenuCatalog;

  /// No description provided for @converterDashMenuClinic.
  ///
  /// In en, this message translates to:
  /// **'Design\nClinic'**
  String get converterDashMenuClinic;

  /// No description provided for @converterDashNewProducts.
  ///
  /// In en, this message translates to:
  /// **'New Products on Shelf'**
  String get converterDashNewProducts;

  /// No description provided for @converterDashSeeAll.
  ///
  /// In en, this message translates to:
  /// **'See All'**
  String get converterDashSeeAll;

  /// No description provided for @converterDashMockProd1Title.
  ///
  /// In en, this message translates to:
  /// **'Teak Pallet Lounge Chair'**
  String get converterDashMockProd1Title;

  /// No description provided for @converterDashMockProd1Sub.
  ///
  /// In en, this message translates to:
  /// **'100% Upcycled Used Pallets'**
  String get converterDashMockProd1Sub;

  /// No description provided for @converterDashMockProd1Price.
  ///
  /// In en, this message translates to:
  /// **'Rp 450.000'**
  String get converterDashMockProd1Price;

  /// No description provided for @converterDashMockProd1Sales.
  ///
  /// In en, this message translates to:
  /// **'3'**
  String get converterDashMockProd1Sales;

  /// No description provided for @converterDashMockProd2Title.
  ///
  /// In en, this message translates to:
  /// **'Resin & Sawdust Coffee Table'**
  String get converterDashMockProd2Title;

  /// No description provided for @converterDashMockProd2Sub.
  ///
  /// In en, this message translates to:
  /// **'Raw Material: Mixed Sawdust'**
  String get converterDashMockProd2Sub;

  /// No description provided for @converterDashMockProd2Price.
  ///
  /// In en, this message translates to:
  /// **'Rp 1.200.000'**
  String get converterDashMockProd2Price;

  /// No description provided for @converterDashMockProd2Sales.
  ///
  /// In en, this message translates to:
  /// **'1'**
  String get converterDashMockProd2Sales;

  /// No description provided for @converterDashSalesCount.
  ///
  /// In en, this message translates to:
  /// **'{sales} Sold'**
  String converterDashSalesCount(String sales);

  /// No description provided for @converterDashNavStudio.
  ///
  /// In en, this message translates to:
  /// **'Studio'**
  String get converterDashNavStudio;

  /// No description provided for @converterDashNavMarketplace.
  ///
  /// In en, this message translates to:
  /// **'Marketplace'**
  String get converterDashNavMarketplace;

  /// No description provided for @converterDashNavOrders.
  ///
  /// In en, this message translates to:
  /// **'Orders'**
  String get converterDashNavOrders;

  /// No description provided for @converterDashNavProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get converterDashNavProfile;

  /// No description provided for @converterAddProductTitle.
  ///
  /// In en, this message translates to:
  /// **'Add Upcycled Product'**
  String get converterAddProductTitle;

  /// No description provided for @converterAddProductMainPhoto.
  ///
  /// In en, this message translates to:
  /// **'Main Product Photo'**
  String get converterAddProductMainPhoto;

  /// No description provided for @converterAddProductAddPhoto.
  ///
  /// In en, this message translates to:
  /// **'Add Photo'**
  String get converterAddProductAddPhoto;

  /// No description provided for @converterAddProductPhotoSlot2.
  ///
  /// In en, this message translates to:
  /// **'Photo Slot 2\n(Optional)'**
  String get converterAddProductPhotoSlot2;

  /// No description provided for @converterAddProductName.
  ///
  /// In en, this message translates to:
  /// **'Product Name'**
  String get converterAddProductName;

  /// No description provided for @converterAddProductNameHint.
  ///
  /// In en, this message translates to:
  /// **'Example: Minimalist Chair Ex-Pallet'**
  String get converterAddProductNameHint;

  /// No description provided for @converterAddProductDesc.
  ///
  /// In en, this message translates to:
  /// **'Product Description & Impact Story'**
  String get converterAddProductDesc;

  /// No description provided for @converterAddProductDescHint.
  ///
  /// In en, this message translates to:
  /// **'Tell the upcycle process...'**
  String get converterAddProductDescHint;

  /// No description provided for @converterAddProductPrice.
  ///
  /// In en, this message translates to:
  /// **'Selling Price (Rp)'**
  String get converterAddProductPrice;

  /// No description provided for @converterAddProductPriceHint.
  ///
  /// In en, this message translates to:
  /// **'Example: 450000'**
  String get converterAddProductPriceHint;

  /// No description provided for @converterAddProductStock.
  ///
  /// In en, this message translates to:
  /// **'Available Stock'**
  String get converterAddProductStock;

  /// No description provided for @converterAddProductStockHint.
  ///
  /// In en, this message translates to:
  /// **'Example: 5'**
  String get converterAddProductStockHint;

  /// No description provided for @converterAddProductTraceability.
  ///
  /// In en, this message translates to:
  /// **'Traceability / Raw Material'**
  String get converterAddProductTraceability;

  /// No description provided for @converterAddProductTraceabilityDesc.
  ///
  /// In en, this message translates to:
  /// **'Select the wood waste transaction you used for this product. This will create a Traceability QR Code for the buyer.'**
  String get converterAddProductTraceabilityDesc;

  /// No description provided for @converterAddProductSelectTransaction.
  ///
  /// In en, this message translates to:
  /// **'Select Supply Transaction...'**
  String get converterAddProductSelectTransaction;

  /// No description provided for @converterAddProductSubmitBtn.
  ///
  /// In en, this message translates to:
  /// **'Save & Publish Product'**
  String get converterAddProductSubmitBtn;

  /// No description provided for @converterClinicTitle.
  ///
  /// In en, this message translates to:
  /// **'Design Clinic & Inspiration'**
  String get converterClinicTitle;

  /// No description provided for @converterClinicTabGlobal.
  ///
  /// In en, this message translates to:
  /// **'Global Trends'**
  String get converterClinicTabGlobal;

  /// No description provided for @converterClinicTabPallet.
  ///
  /// In en, this message translates to:
  /// **'Pallet Ideas'**
  String get converterClinicTabPallet;

  /// No description provided for @converterClinicTabResin.
  ///
  /// In en, this message translates to:
  /// **'Sawdust & Resin'**
  String get converterClinicTabResin;

  /// No description provided for @converterClinicTabStructure.
  ///
  /// In en, this message translates to:
  /// **'Structural Schemes'**
  String get converterClinicTabStructure;

  /// No description provided for @converterClinicMockAuthor1.
  ///
  /// In en, this message translates to:
  /// **'DesignLab Global'**
  String get converterClinicMockAuthor1;

  /// No description provided for @converterClinicMockTime1.
  ///
  /// In en, this message translates to:
  /// **'2 hours ago'**
  String get converterClinicMockTime1;

  /// No description provided for @converterClinicMockTitle1.
  ///
  /// In en, this message translates to:
  /// **'Modular Pallet Sofa'**
  String get converterClinicMockTitle1;

  /// No description provided for @converterClinicMockDesc1.
  ///
  /// In en, this message translates to:
  /// **'How to arrange 4 broken pallets into a comfortable minimalist sofa. Perfect for outdoor cafes.'**
  String get converterClinicMockDesc1;

  /// No description provided for @converterClinicMockAuthor2.
  ///
  /// In en, this message translates to:
  /// **'Local Wood Studio'**
  String get converterClinicMockAuthor2;

  /// No description provided for @converterClinicMockTime2.
  ///
  /// In en, this message translates to:
  /// **'5 hours ago'**
  String get converterClinicMockTime2;

  /// No description provided for @converterClinicMockTitle2.
  ///
  /// In en, this message translates to:
  /// **'Wood sawdust pressing method for coasters'**
  String get converterClinicMockTitle2;

  /// No description provided for @converterClinicMockDesc2.
  ///
  /// In en, this message translates to:
  /// **'Using a mixture of sawdust from milling waste with eco-friendly epoxy glue.'**
  String get converterClinicMockDesc2;

  /// No description provided for @converterClinicAskExpertBtn.
  ///
  /// In en, this message translates to:
  /// **'Ask Expert'**
  String get converterClinicAskExpertBtn;

  /// No description provided for @converterCatalogTitle.
  ///
  /// In en, this message translates to:
  /// **'Your Product Catalog'**
  String get converterCatalogTitle;

  /// No description provided for @converterCatalogStatusActive.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get converterCatalogStatusActive;

  /// No description provided for @converterCatalogStatusSoldOut.
  ///
  /// In en, this message translates to:
  /// **'Sold Out'**
  String get converterCatalogStatusSoldOut;

  /// No description provided for @converterCatalogStatusSoldOutBadge.
  ///
  /// In en, this message translates to:
  /// **'SOLD OUT'**
  String get converterCatalogStatusSoldOutBadge;

  /// No description provided for @converterCatalogBtnAdd.
  ///
  /// In en, this message translates to:
  /// **'Add Product'**
  String get converterCatalogBtnAdd;

  /// No description provided for @converterCatalogStock.
  ///
  /// In en, this message translates to:
  /// **'Stock: {count}'**
  String converterCatalogStock(String count);

  /// No description provided for @converterCatalogMockTitle1.
  ///
  /// In en, this message translates to:
  /// **'Teak Pallet Chair'**
  String get converterCatalogMockTitle1;

  /// No description provided for @converterCatalogMockTitle2.
  ///
  /// In en, this message translates to:
  /// **'Sawdust Resin Table'**
  String get converterCatalogMockTitle2;

  /// No description provided for @converterCatalogMockTitle3.
  ///
  /// In en, this message translates to:
  /// **'Mahogany Cutout Ashtray'**
  String get converterCatalogMockTitle3;

  /// No description provided for @converterCatalogMockTitle4.
  ///
  /// In en, this message translates to:
  /// **'Minimalist Flower Rack'**
  String get converterCatalogMockTitle4;

  /// No description provided for @converterMarketTitle.
  ///
  /// In en, this message translates to:
  /// **'Wood Waste Marketplace'**
  String get converterMarketTitle;

  /// No description provided for @converterMarketSearchHint.
  ///
  /// In en, this message translates to:
  /// **'Search waste (e.g. Teak Sawdust)'**
  String get converterMarketSearchHint;

  /// No description provided for @converterMarketTabAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get converterMarketTabAll;

  /// No description provided for @converterMarketTabSawdust.
  ///
  /// In en, this message translates to:
  /// **'Sawdust'**
  String get converterMarketTabSawdust;

  /// No description provided for @converterMarketTabCutout.
  ///
  /// In en, this message translates to:
  /// **'Cutout'**
  String get converterMarketTabCutout;

  /// No description provided for @converterMarketTabPallet.
  ///
  /// In en, this message translates to:
  /// **'Pallet'**
  String get converterMarketTabPallet;

  /// No description provided for @converterMarketTabSort.
  ///
  /// In en, this message translates to:
  /// **'Warehouse Sorting'**
  String get converterMarketTabSort;

  /// No description provided for @converterMarketMockTitle1.
  ///
  /// In en, this message translates to:
  /// **'Pure Teak Sawdust (Warehouse A)'**
  String get converterMarketMockTitle1;

  /// No description provided for @converterMarketMockSeller1.
  ///
  /// In en, this message translates to:
  /// **'Budi Logistics (Aggregator)'**
  String get converterMarketMockSeller1;

  /// No description provided for @converterMarketMockStock1.
  ///
  /// In en, this message translates to:
  /// **'Available: 850 Kg'**
  String get converterMarketMockStock1;

  /// No description provided for @converterMarketMockPrice1.
  ///
  /// In en, this message translates to:
  /// **'Rp 600 / Kg'**
  String get converterMarketMockPrice1;

  /// No description provided for @converterMarketMockTitle2.
  ///
  /// In en, this message translates to:
  /// **'Small Mahogany Cutouts'**
  String get converterMarketMockTitle2;

  /// No description provided for @converterMarketMockSeller2.
  ///
  /// In en, this message translates to:
  /// **'Jepara Artisans (Generator)'**
  String get converterMarketMockSeller2;

  /// No description provided for @converterMarketMockStock2.
  ///
  /// In en, this message translates to:
  /// **'Available: 120 Kg'**
  String get converterMarketMockStock2;

  /// No description provided for @converterMarketMockPrice2.
  ///
  /// In en, this message translates to:
  /// **'Rp 1.500 / Kg'**
  String get converterMarketMockPrice2;

  /// No description provided for @converterMarketMockTitle3.
  ///
  /// In en, this message translates to:
  /// **'Used Imported Pine Pallets'**
  String get converterMarketMockTitle3;

  /// No description provided for @converterMarketMockSeller3.
  ///
  /// In en, this message translates to:
  /// **'WoodLoop Central Warehouse'**
  String get converterMarketMockSeller3;

  /// No description provided for @converterMarketMockStock3.
  ///
  /// In en, this message translates to:
  /// **'Available: 45 Pcs'**
  String get converterMarketMockStock3;

  /// No description provided for @converterMarketMockPrice3.
  ///
  /// In en, this message translates to:
  /// **'Rp 15.000 / Pcs'**
  String get converterMarketMockPrice3;

  /// No description provided for @buyerRegTitle.
  ///
  /// In en, this message translates to:
  /// **'Buyer Registration'**
  String get buyerRegTitle;

  /// No description provided for @buyerRegHeader.
  ///
  /// In en, this message translates to:
  /// **'Join the Circular Economy'**
  String get buyerRegHeader;

  /// No description provided for @buyerRegSubheader.
  ///
  /// In en, this message translates to:
  /// **'Find aesthetic upcycled furniture and crafts while reducing the earth\'s carbon emissions.'**
  String get buyerRegSubheader;

  /// No description provided for @buyerRegNameLabel.
  ///
  /// In en, this message translates to:
  /// **'Full Name'**
  String get buyerRegNameLabel;

  /// No description provided for @buyerRegNameHint.
  ///
  /// In en, this message translates to:
  /// **'According to ID Card'**
  String get buyerRegNameHint;

  /// No description provided for @buyerRegEmailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get buyerRegEmailLabel;

  /// No description provided for @buyerRegEmailHint.
  ///
  /// In en, this message translates to:
  /// **'email@domain.com'**
  String get buyerRegEmailHint;

  /// No description provided for @buyerRegPhoneLabel.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp Number'**
  String get buyerRegPhoneLabel;

  /// No description provided for @buyerRegPhoneHint.
  ///
  /// In en, this message translates to:
  /// **'081234567890'**
  String get buyerRegPhoneHint;

  /// No description provided for @buyerRegPasswordLabel.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get buyerRegPasswordLabel;

  /// No description provided for @buyerRegPasswordHint.
  ///
  /// In en, this message translates to:
  /// **'Minimum 8 characters'**
  String get buyerRegPasswordHint;

  /// No description provided for @buyerRegAddressLabel.
  ///
  /// In en, this message translates to:
  /// **'Main Shipping Address (Optional)'**
  String get buyerRegAddressLabel;

  /// No description provided for @buyerRegAddressHint.
  ///
  /// In en, this message translates to:
  /// **'Home or office address'**
  String get buyerRegAddressHint;

  /// No description provided for @buyerRegBtnSubmit.
  ///
  /// In en, this message translates to:
  /// **'Register & Explore Products'**
  String get buyerRegBtnSubmit;

  /// No description provided for @buyerRegRequiredValidation.
  ///
  /// In en, this message translates to:
  /// **'This field is required'**
  String get buyerRegRequiredValidation;

  /// No description provided for @buyerProfileWelcome.
  ///
  /// In en, this message translates to:
  /// **'Welcome,'**
  String get buyerProfileWelcome;

  /// No description provided for @buyerProfileMockName.
  ///
  /// In en, this message translates to:
  /// **'Sarah Wijaya'**
  String get buyerProfileMockName;

  /// No description provided for @buyerProfileImpactTitle.
  ///
  /// In en, this message translates to:
  /// **'Your Trail of Goodness'**
  String get buyerProfileImpactTitle;

  /// No description provided for @buyerProfileImpactProducts.
  ///
  /// In en, this message translates to:
  /// **'Products\nBought'**
  String get buyerProfileImpactProducts;

  /// No description provided for @buyerProfileImpactWood.
  ///
  /// In en, this message translates to:
  /// **'Kg Wood\nSaved'**
  String get buyerProfileImpactWood;

  /// No description provided for @buyerProfileImpactCO2.
  ///
  /// In en, this message translates to:
  /// **'Kg CO2\nReduced'**
  String get buyerProfileImpactCO2;

  /// No description provided for @buyerProfileMenuStore.
  ///
  /// In en, this message translates to:
  /// **'Upcycle\nStore'**
  String get buyerProfileMenuStore;

  /// No description provided for @buyerProfileMenuTrack.
  ///
  /// In en, this message translates to:
  /// **'Track\nOrder'**
  String get buyerProfileMenuTrack;

  /// No description provided for @buyerProfileMenuFavorites.
  ///
  /// In en, this message translates to:
  /// **'Favorite\nCollection'**
  String get buyerProfileMenuFavorites;

  /// No description provided for @buyerProfileSectionRecent.
  ///
  /// In en, this message translates to:
  /// **'Recent Purchases'**
  String get buyerProfileSectionRecent;

  /// No description provided for @buyerProfileStatusShipping.
  ///
  /// In en, this message translates to:
  /// **'In Delivery'**
  String get buyerProfileStatusShipping;

  /// No description provided for @buyerProfileMockOrderTitle1.
  ///
  /// In en, this message translates to:
  /// **'Sawdust Resin Coffee Table'**
  String get buyerProfileMockOrderTitle1;

  /// No description provided for @buyerProfileMockOrderStore1.
  ///
  /// In en, this message translates to:
  /// **'Jepara Eco Art'**
  String get buyerProfileMockOrderStore1;

  /// No description provided for @buyerProfileStatusDone.
  ///
  /// In en, this message translates to:
  /// **'Completed'**
  String get buyerProfileStatusDone;

  /// No description provided for @buyerProfileMockOrderTitle2.
  ///
  /// In en, this message translates to:
  /// **'Mahogany Wood Ashtray Set'**
  String get buyerProfileMockOrderTitle2;

  /// No description provided for @buyerProfileMockOrderStore2.
  ///
  /// In en, this message translates to:
  /// **'Green Studio'**
  String get buyerProfileMockOrderStore2;

  /// No description provided for @buyerProfileOrderTotal.
  ///
  /// In en, this message translates to:
  /// **'Total Purchase'**
  String get buyerProfileOrderTotal;

  /// No description provided for @buyerProfileNavHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get buyerProfileNavHome;

  /// No description provided for @buyerProfileNavMarket.
  ///
  /// In en, this message translates to:
  /// **'Market'**
  String get buyerProfileNavMarket;

  /// No description provided for @buyerProfileNavOrders.
  ///
  /// In en, this message translates to:
  /// **'Orders'**
  String get buyerProfileNavOrders;

  /// No description provided for @buyerProfileNavProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get buyerProfileNavProfile;

  /// No description provided for @buyerMarketCatTitle.
  ///
  /// In en, this message translates to:
  /// **'Product Categories'**
  String get buyerMarketCatTitle;

  /// No description provided for @buyerMarketCat1Title.
  ///
  /// In en, this message translates to:
  /// **'Large Furniture'**
  String get buyerMarketCat1Title;

  /// No description provided for @buyerMarketCat1Subtitle.
  ///
  /// In en, this message translates to:
  /// **'Sofas, Dining Tables, Cabinets from selected wood logs and pallets.'**
  String get buyerMarketCat1Subtitle;

  /// No description provided for @buyerMarketCat2Title.
  ///
  /// In en, this message translates to:
  /// **'Decor & Crafts'**
  String get buyerMarketCat2Title;

  /// No description provided for @buyerMarketCat2Subtitle.
  ///
  /// In en, this message translates to:
  /// **'Wall panels, desk clocks, ornaments from wood cutouts.'**
  String get buyerMarketCat2Subtitle;

  /// No description provided for @buyerMarketCat3Title.
  ///
  /// In en, this message translates to:
  /// **'Resin & Sawdust Composites'**
  String get buyerMarketCat3Title;

  /// No description provided for @buyerMarketCat3Subtitle.
  ///
  /// In en, this message translates to:
  /// **'Coasters, ashtrays, innovative transparent resin tables.'**
  String get buyerMarketCat3Subtitle;

  /// No description provided for @buyerMarketCat4Title.
  ///
  /// In en, this message translates to:
  /// **'Daily Accessories'**
  String get buyerMarketCat4Title;

  /// No description provided for @buyerMarketCat4Subtitle.
  ///
  /// In en, this message translates to:
  /// **'Keychains, phone stands, portable bookshelves.'**
  String get buyerMarketCat4Subtitle;

  /// No description provided for @buyerOrderTrackTitle.
  ///
  /// In en, this message translates to:
  /// **'Track Delivery'**
  String get buyerOrderTrackTitle;

  /// No description provided for @buyerOrderTrackMockProduct.
  ///
  /// In en, this message translates to:
  /// **'Aesthetic Pallet Chair (+1 other)'**
  String get buyerOrderTrackMockProduct;

  /// No description provided for @buyerOrderTrackMockStore.
  ///
  /// In en, this message translates to:
  /// **'Jepara Eco Art'**
  String get buyerOrderTrackMockStore;

  /// No description provided for @buyerOrderTrackOrigin.
  ///
  /// In en, this message translates to:
  /// **'Track Origin of Wood Waste'**
  String get buyerOrderTrackOrigin;

  /// No description provided for @buyerOrderTrackStatusHeader.
  ///
  /// In en, this message translates to:
  /// **'Delivery Status'**
  String get buyerOrderTrackStatusHeader;

  /// No description provided for @buyerOrderTrackStep1Title.
  ///
  /// In en, this message translates to:
  /// **'Order Received'**
  String get buyerOrderTrackStep1Title;

  /// No description provided for @buyerOrderTrackStep1Desc.
  ///
  /// In en, this message translates to:
  /// **'Payment verified.'**
  String get buyerOrderTrackStep1Desc;

  /// No description provided for @buyerOrderTrackStep2Title.
  ///
  /// In en, this message translates to:
  /// **'Packed by Studio'**
  String get buyerOrderTrackStep2Title;

  /// No description provided for @buyerOrderTrackStep2Desc.
  ///
  /// In en, this message translates to:
  /// **'Waiting for logistics partner pickup.'**
  String get buyerOrderTrackStep2Desc;

  /// No description provided for @buyerOrderTrackStep3Title.
  ///
  /// In en, this message translates to:
  /// **'On the Way to You'**
  String get buyerOrderTrackStep3Title;

  /// No description provided for @buyerOrderTrackStep3Desc.
  ///
  /// In en, this message translates to:
  /// **'Courier is heading to your location (Receipt: WX-998821).'**
  String get buyerOrderTrackStep3Desc;

  /// No description provided for @buyerOrderTrackStep4Title.
  ///
  /// In en, this message translates to:
  /// **'Order Completed'**
  String get buyerOrderTrackStep4Title;

  /// No description provided for @buyerOrderTrackStep4Desc.
  ///
  /// In en, this message translates to:
  /// **'Goods have been received in good condition.'**
  String get buyerOrderTrackStep4Desc;

  /// No description provided for @buyerOrderTrackBtnConfirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm Order Received'**
  String get buyerOrderTrackBtnConfirm;

  /// No description provided for @buyerCheckoutTitle.
  ///
  /// In en, this message translates to:
  /// **'Checkout'**
  String get buyerCheckoutTitle;

  /// No description provided for @buyerCheckoutShippingAddress.
  ///
  /// In en, this message translates to:
  /// **'Shipping Address'**
  String get buyerCheckoutShippingAddress;

  /// No description provided for @buyerCheckoutBtnChange.
  ///
  /// In en, this message translates to:
  /// **'Change'**
  String get buyerCheckoutBtnChange;

  /// No description provided for @buyerCheckoutMockUser.
  ///
  /// In en, this message translates to:
  /// **'Sarah Wijaya | 081234567890'**
  String get buyerCheckoutMockUser;

  /// No description provided for @buyerCheckoutMockAddress.
  ///
  /// In en, this message translates to:
  /// **'Jl. Jend. Sudirman No. 45, Graha Building 12th Floor\nCentral Jakarta, 10210\nIndonesia'**
  String get buyerCheckoutMockAddress;

  /// No description provided for @buyerCheckoutOrderDetails.
  ///
  /// In en, this message translates to:
  /// **'Order Details'**
  String get buyerCheckoutOrderDetails;

  /// No description provided for @buyerCheckoutMockProduct1.
  ///
  /// In en, this message translates to:
  /// **'Aesthetic Pallet Chair'**
  String get buyerCheckoutMockProduct1;

  /// No description provided for @buyerCheckoutMockProduct2.
  ///
  /// In en, this message translates to:
  /// **'Resin Coaster Set of 4'**
  String get buyerCheckoutMockProduct2;

  /// No description provided for @buyerCheckoutSubtotal.
  ///
  /// In en, this message translates to:
  /// **'Subtotal'**
  String get buyerCheckoutSubtotal;

  /// No description provided for @buyerCheckoutShippingFee.
  ///
  /// In en, this message translates to:
  /// **'Shipping Fee'**
  String get buyerCheckoutShippingFee;

  /// No description provided for @buyerCheckoutEcoWarriorDiscount.
  ///
  /// In en, this message translates to:
  /// **'Eco-Warrior Discount'**
  String get buyerCheckoutEcoWarriorDiscount;

  /// No description provided for @buyerCheckoutPaymentMethod.
  ///
  /// In en, this message translates to:
  /// **'Payment Method'**
  String get buyerCheckoutPaymentMethod;

  /// No description provided for @buyerCheckoutPaymentBCA.
  ///
  /// In en, this message translates to:
  /// **'BCA Virtual Account'**
  String get buyerCheckoutPaymentBCA;

  /// No description provided for @buyerCheckoutPaymentQRIS.
  ///
  /// In en, this message translates to:
  /// **'QRIS'**
  String get buyerCheckoutPaymentQRIS;

  /// No description provided for @buyerCheckoutPaymentCard.
  ///
  /// In en, this message translates to:
  /// **'Credit / Debit Card'**
  String get buyerCheckoutPaymentCard;

  /// No description provided for @buyerCheckoutTotal.
  ///
  /// In en, this message translates to:
  /// **'Total Purchase'**
  String get buyerCheckoutTotal;

  /// No description provided for @buyerCheckoutBtnPay.
  ///
  /// In en, this message translates to:
  /// **'Pay Now'**
  String get buyerCheckoutBtnPay;

  /// No description provided for @buyerUpcycledMarketTitle.
  ///
  /// In en, this message translates to:
  /// **'Upcycle Marketplace'**
  String get buyerUpcycledMarketTitle;

  /// No description provided for @buyerUpcycledMarketSearchHint.
  ///
  /// In en, this message translates to:
  /// **'Search aesthetic furniture...'**
  String get buyerUpcycledMarketSearchHint;

  /// No description provided for @buyerUpcycledMarketHighlightNew.
  ///
  /// In en, this message translates to:
  /// **'New Collection'**
  String get buyerUpcycledMarketHighlightNew;

  /// No description provided for @buyerUpcycledMarketHighlightTitle.
  ///
  /// In en, this message translates to:
  /// **'Teak Pallet Aesthetics\nStudio X Collaboration'**
  String get buyerUpcycledMarketHighlightTitle;

  /// No description provided for @buyerUpcycledMarketHighlightAction.
  ///
  /// In en, this message translates to:
  /// **'View Collection ->'**
  String get buyerUpcycledMarketHighlightAction;

  /// No description provided for @buyerUpcycledMarketCatAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get buyerUpcycledMarketCatAll;

  /// No description provided for @buyerUpcycledMarketCatDecor.
  ///
  /// In en, this message translates to:
  /// **'Decor'**
  String get buyerUpcycledMarketCatDecor;

  /// No description provided for @buyerUpcycledMarketCatFurniture.
  ///
  /// In en, this message translates to:
  /// **'Furniture'**
  String get buyerUpcycledMarketCatFurniture;

  /// No description provided for @buyerUpcycledMarketCatAccessories.
  ///
  /// In en, this message translates to:
  /// **'Accessories'**
  String get buyerUpcycledMarketCatAccessories;

  /// No description provided for @buyerUpcycledMarketMockTitle1.
  ///
  /// In en, this message translates to:
  /// **'Aesthetic Pallet Chair'**
  String get buyerUpcycledMarketMockTitle1;

  /// No description provided for @buyerUpcycledMarketMockStudio1.
  ///
  /// In en, this message translates to:
  /// **'Jepara Eco Art'**
  String get buyerUpcycledMarketMockStudio1;

  /// No description provided for @buyerUpcycledMarketMockImpact1.
  ///
  /// In en, this message translates to:
  /// **'🌳 Save 12kg of Wood'**
  String get buyerUpcycledMarketMockImpact1;

  /// No description provided for @buyerUpcycledMarketMockTitle2.
  ///
  /// In en, this message translates to:
  /// **'Sawdust Resin Table'**
  String get buyerUpcycledMarketMockTitle2;

  /// No description provided for @buyerUpcycledMarketMockStudio2.
  ///
  /// In en, this message translates to:
  /// **'Woodie Studio'**
  String get buyerUpcycledMarketMockStudio2;

  /// No description provided for @buyerUpcycledMarketMockImpact2.
  ///
  /// In en, this message translates to:
  /// **'🌳 Save 45kg of Wood'**
  String get buyerUpcycledMarketMockImpact2;

  /// No description provided for @buyerUpcycledMarketMockTitle3.
  ///
  /// In en, this message translates to:
  /// **'Cutout Desk Lamp'**
  String get buyerUpcycledMarketMockTitle3;

  /// No description provided for @buyerUpcycledMarketMockStudio3.
  ///
  /// In en, this message translates to:
  /// **'Local Creations'**
  String get buyerUpcycledMarketMockStudio3;

  /// No description provided for @buyerUpcycledMarketMockImpact3.
  ///
  /// In en, this message translates to:
  /// **'🌳 Save 3kg of Wood'**
  String get buyerUpcycledMarketMockImpact3;

  /// No description provided for @buyerUpcycledMarketMockTitle4.
  ///
  /// In en, this message translates to:
  /// **'Minimalist Bookshelf'**
  String get buyerUpcycledMarketMockTitle4;

  /// No description provided for @buyerUpcycledMarketMockStudio4.
  ///
  /// In en, this message translates to:
  /// **'Jepara Eco Art'**
  String get buyerUpcycledMarketMockStudio4;

  /// No description provided for @buyerUpcycledMarketMockImpact4.
  ///
  /// In en, this message translates to:
  /// **'🌳 Save 8kg of Wood'**
  String get buyerUpcycledMarketMockImpact4;

  /// No description provided for @buyerCartTitle.
  ///
  /// In en, this message translates to:
  /// **'Shopping Cart'**
  String get buyerCartTitle;

  /// No description provided for @buyerCartMockStore1.
  ///
  /// In en, this message translates to:
  /// **'Jepara Eco Art'**
  String get buyerCartMockStore1;

  /// No description provided for @buyerCartMockProduct1.
  ///
  /// In en, this message translates to:
  /// **'Aesthetic Pallet Chair'**
  String get buyerCartMockProduct1;

  /// No description provided for @buyerCartMockStore2.
  ///
  /// In en, this message translates to:
  /// **'Woodie Studio'**
  String get buyerCartMockStore2;

  /// No description provided for @buyerCartMockProduct2.
  ///
  /// In en, this message translates to:
  /// **'Sawdust Resin Coaster (Set of 4)'**
  String get buyerCartMockProduct2;

  /// No description provided for @buyerCartTotalItems.
  ///
  /// In en, this message translates to:
  /// **'Total Items ({count})'**
  String buyerCartTotalItems(String count);

  /// No description provided for @buyerCartTotalImpact.
  ///
  /// In en, this message translates to:
  /// **'Total Positive Impact'**
  String get buyerCartTotalImpact;

  /// No description provided for @buyerCartTotalImpactValueMock.
  ///
  /// In en, this message translates to:
  /// **'13.5 Kg Wood'**
  String get buyerCartTotalImpactValueMock;

  /// No description provided for @buyerCartBtnCheckout.
  ///
  /// In en, this message translates to:
  /// **'Proceed to Checkout'**
  String get buyerCartBtnCheckout;

  /// No description provided for @traceabilityTitle.
  ///
  /// In en, this message translates to:
  /// **'Traceability'**
  String get traceabilityTitle;

  /// No description provided for @traceabilityCategoryMock.
  ///
  /// In en, this message translates to:
  /// **'UPCYCLED TEAK'**
  String get traceabilityCategoryMock;

  /// No description provided for @traceabilityMockProduct.
  ///
  /// In en, this message translates to:
  /// **'Teak Wall Panel'**
  String get traceabilityMockProduct;

  /// No description provided for @traceabilityMockModel.
  ///
  /// In en, this message translates to:
  /// **'Model X-24'**
  String get traceabilityMockModel;

  /// No description provided for @traceabilityInStock.
  ///
  /// In en, this message translates to:
  /// **'In Stock'**
  String get traceabilityInStock;

  /// No description provided for @traceabilityCraftedBy.
  ///
  /// In en, this message translates to:
  /// **'CRAFTED BY'**
  String get traceabilityCraftedBy;

  /// No description provided for @traceabilityMockStudio.
  ///
  /// In en, this message translates to:
  /// **'Sari Studio'**
  String get traceabilityMockStudio;

  /// No description provided for @traceabilityImpactMetrics.
  ///
  /// In en, this message translates to:
  /// **'Impact Metrics'**
  String get traceabilityImpactMetrics;

  /// No description provided for @traceabilityCO2Offset.
  ///
  /// In en, this message translates to:
  /// **'CO2 OFFSET'**
  String get traceabilityCO2Offset;

  /// No description provided for @traceabilityWasteDiverted.
  ///
  /// In en, this message translates to:
  /// **'WASTE DIVERTED'**
  String get traceabilityWasteDiverted;

  /// No description provided for @traceabilityMaterialComposition.
  ///
  /// In en, this message translates to:
  /// **'Material Composition'**
  String get traceabilityMaterialComposition;

  /// No description provided for @traceabilityMaterialMock.
  ///
  /// In en, this message translates to:
  /// **'100% Upcycled Wood'**
  String get traceabilityMaterialMock;

  /// No description provided for @traceabilityJourney.
  ///
  /// In en, this message translates to:
  /// **'Product Journey'**
  String get traceabilityJourney;

  /// No description provided for @traceabilityVerifiedBlockchain.
  ///
  /// In en, this message translates to:
  /// **'Blockchain Verified'**
  String get traceabilityVerifiedBlockchain;

  /// No description provided for @traceabilityStep1Label.
  ///
  /// In en, this message translates to:
  /// **'Origin'**
  String get traceabilityStep1Label;

  /// No description provided for @traceabilityStep1Title.
  ///
  /// In en, this message translates to:
  /// **'Raw Wood Sourcing'**
  String get traceabilityStep1Title;

  /// No description provided for @traceabilityStep1Desc.
  ///
  /// In en, this message translates to:
  /// **'Sourced sustainably from '**
  String get traceabilityStep1Desc;

  /// No description provided for @traceabilityStep1Entity.
  ///
  /// In en, this message translates to:
  /// **'Perhutani Forest'**
  String get traceabilityStep1Entity;

  /// No description provided for @traceabilityStep2Label.
  ///
  /// In en, this message translates to:
  /// **'Waste Gen'**
  String get traceabilityStep2Label;

  /// No description provided for @traceabilityStep2Title.
  ///
  /// In en, this message translates to:
  /// **'Production Scrap'**
  String get traceabilityStep2Title;

  /// No description provided for @traceabilityStep2Desc.
  ///
  /// In en, this message translates to:
  /// **'Offcuts collected from '**
  String get traceabilityStep2Desc;

  /// No description provided for @traceabilityStep2Entity.
  ///
  /// In en, this message translates to:
  /// **'Budi Workshop'**
  String get traceabilityStep2Entity;

  /// No description provided for @traceabilityStep3Label.
  ///
  /// In en, this message translates to:
  /// **'Aggregation'**
  String get traceabilityStep3Label;

  /// No description provided for @traceabilityStep3Title.
  ///
  /// In en, this message translates to:
  /// **'Waste Collection'**
  String get traceabilityStep3Title;

  /// No description provided for @traceabilityStep3Desc.
  ///
  /// In en, this message translates to:
  /// **'Transported and sorted by '**
  String get traceabilityStep3Desc;

  /// No description provided for @traceabilityStep3Entity.
  ///
  /// In en, this message translates to:
  /// **'Mas Joko Logistics'**
  String get traceabilityStep3Entity;

  /// No description provided for @traceabilityStep4Label.
  ///
  /// In en, this message translates to:
  /// **'Final Product'**
  String get traceabilityStep4Label;

  /// No description provided for @traceabilityStep4Title.
  ///
  /// In en, this message translates to:
  /// **'Upcycled Creation'**
  String get traceabilityStep4Title;

  /// No description provided for @traceabilityStep4Desc.
  ///
  /// In en, this message translates to:
  /// **'Handcrafted into panel by '**
  String get traceabilityStep4Desc;

  /// No description provided for @traceabilityStep4Entity.
  ///
  /// In en, this message translates to:
  /// **'Sari Studio'**
  String get traceabilityStep4Entity;

  /// No description provided for @traceabilityVerifiedBadge.
  ///
  /// In en, this message translates to:
  /// **'Verified'**
  String get traceabilityVerifiedBadge;

  /// No description provided for @traceabilityAddToCart.
  ///
  /// In en, this message translates to:
  /// **'Add to Cart'**
  String get traceabilityAddToCart;

  /// No description provided for @traceabilitySelectSourceTitle.
  ///
  /// In en, this message translates to:
  /// **'Select Wood Source'**
  String get traceabilitySelectSourceTitle;

  /// No description provided for @traceabilitySelectSourceSearchHint.
  ///
  /// In en, this message translates to:
  /// **'Search by Batch ID or Type...'**
  String get traceabilitySelectSourceSearchHint;

  /// No description provided for @traceabilitySelectSourceBtnUse.
  ///
  /// In en, this message translates to:
  /// **'Use This Source'**
  String get traceabilitySelectSourceBtnUse;

  /// No description provided for @traceabilitySelectSourceMockDate1.
  ///
  /// In en, this message translates to:
  /// **'10 Nov 2023'**
  String get traceabilitySelectSourceMockDate1;

  /// No description provided for @traceabilitySelectSourceMockType1.
  ///
  /// In en, this message translates to:
  /// **'Teak Sawdust'**
  String get traceabilitySelectSourceMockType1;

  /// No description provided for @traceabilitySelectSourceMockVol1.
  ///
  /// In en, this message translates to:
  /// **'50 Kg'**
  String get traceabilitySelectSourceMockVol1;

  /// No description provided for @traceabilitySelectSourceMockSupplier1.
  ///
  /// In en, this message translates to:
  /// **'UD Sukses Makmur'**
  String get traceabilitySelectSourceMockSupplier1;

  /// No description provided for @traceabilitySelectSourceMockBatch1.
  ///
  /// In en, this message translates to:
  /// **'BATCH-20231110-01'**
  String get traceabilitySelectSourceMockBatch1;

  /// No description provided for @traceabilitySelectSourceMockDate2.
  ///
  /// In en, this message translates to:
  /// **'02 Nov 2023'**
  String get traceabilitySelectSourceMockDate2;

  /// No description provided for @traceabilitySelectSourceMockType2.
  ///
  /// In en, this message translates to:
  /// **'Mango Wood Cutouts'**
  String get traceabilitySelectSourceMockType2;

  /// No description provided for @traceabilitySelectSourceMockVol2.
  ///
  /// In en, this message translates to:
  /// **'120 Kg'**
  String get traceabilitySelectSourceMockVol2;

  /// No description provided for @traceabilitySelectSourceMockSupplier2.
  ///
  /// In en, this message translates to:
  /// **'H. Toni Sawmill'**
  String get traceabilitySelectSourceMockSupplier2;

  /// No description provided for @traceabilitySelectSourceMockBatch2.
  ///
  /// In en, this message translates to:
  /// **'BATCH-20231102-05'**
  String get traceabilitySelectSourceMockBatch2;

  /// No description provided for @traceabilitySelectSourceMockDate3.
  ///
  /// In en, this message translates to:
  /// **'28 Oct 2023'**
  String get traceabilitySelectSourceMockDate3;

  /// No description provided for @traceabilitySelectSourceMockType3.
  ///
  /// In en, this message translates to:
  /// **'Used Pine Pallet'**
  String get traceabilitySelectSourceMockType3;

  /// No description provided for @traceabilitySelectSourceMockVol3.
  ///
  /// In en, this message translates to:
  /// **'85 Kg'**
  String get traceabilitySelectSourceMockVol3;

  /// No description provided for @traceabilitySelectSourceMockSupplier3.
  ///
  /// In en, this message translates to:
  /// **'Maju Jaya Logistics'**
  String get traceabilitySelectSourceMockSupplier3;

  /// No description provided for @traceabilitySelectSourceMockBatch3.
  ///
  /// In en, this message translates to:
  /// **'BATCH-20231028-12'**
  String get traceabilitySelectSourceMockBatch3;

  /// No description provided for @traceabilitySelectSourceIdFormat.
  ///
  /// In en, this message translates to:
  /// **'ID: {batchId}'**
  String traceabilitySelectSourceIdFormat(String batchId);

  /// No description provided for @chatMessagesTitle.
  ///
  /// In en, this message translates to:
  /// **'Messages'**
  String get chatMessagesTitle;

  /// No description provided for @chatMessagesTabAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get chatMessagesTabAll;

  /// No description provided for @chatMessagesTabUnread.
  ///
  /// In en, this message translates to:
  /// **'Unread'**
  String get chatMessagesTabUnread;

  /// No description provided for @chatMessagesTabSystem.
  ///
  /// In en, this message translates to:
  /// **'System'**
  String get chatMessagesTabSystem;

  /// No description provided for @chatMockSender1.
  ///
  /// In en, this message translates to:
  /// **'Budi Logistics (Aggregator)'**
  String get chatMockSender1;

  /// No description provided for @chatMockMessage1.
  ///
  /// In en, this message translates to:
  /// **'Hello, I have arrived at the waste pickup location...'**
  String get chatMockMessage1;

  /// No description provided for @chatMockTime1.
  ///
  /// In en, this message translates to:
  /// **'10:30'**
  String get chatMockTime1;

  /// No description provided for @chatMockSender2.
  ///
  /// In en, this message translates to:
  /// **'Dian (Ekowood Studio)'**
  String get chatMockSender2;

  /// No description provided for @chatMockMessage2.
  ///
  /// In en, this message translates to:
  /// **'Noted, we will revise the pallet chair model according to...'**
  String get chatMockMessage2;

  /// No description provided for @chatMockTime2.
  ///
  /// In en, this message translates to:
  /// **'Yesterday'**
  String get chatMockTime2;

  /// No description provided for @chatMockSender3.
  ///
  /// In en, this message translates to:
  /// **'WoodLoop CS'**
  String get chatMockSender3;

  /// No description provided for @chatMockMessage3.
  ///
  /// In en, this message translates to:
  /// **'[System] Your Supplier account verification was successful...'**
  String get chatMockMessage3;

  /// No description provided for @chatMockTime3.
  ///
  /// In en, this message translates to:
  /// **'Monday'**
  String get chatMockTime3;

  /// No description provided for @chatDmSenderName.
  ///
  /// In en, this message translates to:
  /// **'Budi Logistics'**
  String get chatDmSenderName;

  /// No description provided for @chatDmStatusOnline.
  ///
  /// In en, this message translates to:
  /// **'Online'**
  String get chatDmStatusOnline;

  /// No description provided for @chatDmMessage1.
  ///
  /// In en, this message translates to:
  /// **'Hello, I have arrived at the waste pickup location. Could you point me to the pile?'**
  String get chatDmMessage1;

  /// No description provided for @chatDmTime1.
  ///
  /// In en, this message translates to:
  /// **'10:30'**
  String get chatDmTime1;

  /// No description provided for @chatDmMessage2.
  ///
  /// In en, this message translates to:
  /// **'Sure Mr. Budi. I\'ll be right out.'**
  String get chatDmMessage2;

  /// No description provided for @chatDmTime2.
  ///
  /// In en, this message translates to:
  /// **'10:32'**
  String get chatDmTime2;

  /// No description provided for @chatDmMessage3.
  ///
  /// In en, this message translates to:
  /// **'Here is the pickup booking code: PKP-8921-A'**
  String get chatDmMessage3;

  /// No description provided for @chatDmTime3.
  ///
  /// In en, this message translates to:
  /// **'10:33'**
  String get chatDmTime3;

  /// No description provided for @chatDmToday.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get chatDmToday;

  /// No description provided for @chatDmInputHint.
  ///
  /// In en, this message translates to:
  /// **'Type a message...'**
  String get chatDmInputHint;

  /// No description provided for @enablerAnalyticsTitle.
  ///
  /// In en, this message translates to:
  /// **'Impact Analytics'**
  String get enablerAnalyticsTitle;

  /// No description provided for @enablerAnalyticsRegion.
  ///
  /// In en, this message translates to:
  /// **'Region: Jepara'**
  String get enablerAnalyticsRegion;

  /// No description provided for @enablerAnalyticsFilterMonth.
  ///
  /// In en, this message translates to:
  /// **'This Month'**
  String get enablerAnalyticsFilterMonth;

  /// No description provided for @enablerAnalyticsKpiWaste.
  ///
  /// In en, this message translates to:
  /// **'Waste Saved'**
  String get enablerAnalyticsKpiWaste;

  /// No description provided for @enablerAnalyticsKpiWasteMockValue.
  ///
  /// In en, this message translates to:
  /// **'1,240'**
  String get enablerAnalyticsKpiWasteMockValue;

  /// No description provided for @enablerAnalyticsKpiWasteMockUnit.
  ///
  /// In en, this message translates to:
  /// **'Tons'**
  String get enablerAnalyticsKpiWasteMockUnit;

  /// No description provided for @enablerAnalyticsKpiWasteMockTrend.
  ///
  /// In en, this message translates to:
  /// **'+12%'**
  String get enablerAnalyticsKpiWasteMockTrend;

  /// No description provided for @enablerAnalyticsKpiCarbon.
  ///
  /// In en, this message translates to:
  /// **'Carbon Emission Reduced'**
  String get enablerAnalyticsKpiCarbon;

  /// No description provided for @enablerAnalyticsKpiCarbonMockValue.
  ///
  /// In en, this message translates to:
  /// **'850'**
  String get enablerAnalyticsKpiCarbonMockValue;

  /// No description provided for @enablerAnalyticsKpiCarbonMockUnit.
  ///
  /// In en, this message translates to:
  /// **'kg CO2e'**
  String get enablerAnalyticsKpiCarbonMockUnit;

  /// No description provided for @enablerAnalyticsKpiCarbonMockTrend.
  ///
  /// In en, this message translates to:
  /// **'+5%'**
  String get enablerAnalyticsKpiCarbonMockTrend;

  /// No description provided for @enablerAnalyticsKpiEconomy.
  ///
  /// In en, this message translates to:
  /// **'Economic Multiplier Value'**
  String get enablerAnalyticsKpiEconomy;

  /// No description provided for @enablerAnalyticsKpiEconomyMockValue.
  ///
  /// In en, this message translates to:
  /// **'Rp 45B'**
  String get enablerAnalyticsKpiEconomyMockValue;

  /// No description provided for @enablerAnalyticsKpiEconomyMockTrend.
  ///
  /// In en, this message translates to:
  /// **'+18%'**
  String get enablerAnalyticsKpiEconomyMockTrend;

  /// No description provided for @enablerAnalyticsKpiActiveUsers.
  ///
  /// In en, this message translates to:
  /// **'Active Participants'**
  String get enablerAnalyticsKpiActiveUsers;

  /// No description provided for @enablerAnalyticsKpiActiveUsersMockValue.
  ///
  /// In en, this message translates to:
  /// **'3,402'**
  String get enablerAnalyticsKpiActiveUsersMockValue;

  /// No description provided for @enablerAnalyticsKpiActiveUsersMockUnit.
  ///
  /// In en, this message translates to:
  /// **'Users'**
  String get enablerAnalyticsKpiActiveUsersMockUnit;

  /// No description provided for @enablerAnalyticsKpiActiveUsersMockTrend.
  ///
  /// In en, this message translates to:
  /// **'+2%'**
  String get enablerAnalyticsKpiActiveUsersMockTrend;

  /// No description provided for @enablerAnalyticsChartTitle.
  ///
  /// In en, this message translates to:
  /// **'Documented Wood Volume (Traceability)'**
  String get enablerAnalyticsChartTitle;

  /// No description provided for @enablerAnalyticsChartMockLegend.
  ///
  /// In en, this message translates to:
  /// **'Volume Growth Chart (Mock)'**
  String get enablerAnalyticsChartMockLegend;

  /// No description provided for @enablerAnalyticsTopContributors.
  ///
  /// In en, this message translates to:
  /// **'Top Contributors (This Week)'**
  String get enablerAnalyticsTopContributors;

  /// No description provided for @enablerAnalyticsTopMockName1.
  ///
  /// In en, this message translates to:
  /// **'Budi Logistics (Aggregator)'**
  String get enablerAnalyticsTopMockName1;

  /// No description provided for @enablerAnalyticsTopMockStat1.
  ///
  /// In en, this message translates to:
  /// **'450 Kg Wood Saved'**
  String get enablerAnalyticsTopMockStat1;

  /// No description provided for @enablerAnalyticsTopMockName2.
  ///
  /// In en, this message translates to:
  /// **'Jepara Eco Art (Converter)'**
  String get enablerAnalyticsTopMockName2;

  /// No description provided for @enablerAnalyticsTopMockStat2.
  ///
  /// In en, this message translates to:
  /// **'120 Kg Wood Saved'**
  String get enablerAnalyticsTopMockStat2;

  /// No description provided for @enablerAnalyticsTopMockName3.
  ///
  /// In en, this message translates to:
  /// **'UD Sukses Makmur (Generator)'**
  String get enablerAnalyticsTopMockName3;

  /// No description provided for @enablerAnalyticsTopMockStat3.
  ///
  /// In en, this message translates to:
  /// **'90 Kg Wood Documented'**
  String get enablerAnalyticsTopMockStat3;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'id'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'id':
      return AppLocalizationsId();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
