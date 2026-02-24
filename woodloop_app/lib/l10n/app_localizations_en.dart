// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'WoodLoop';

  @override
  String get roleSelectionWelcome =>
      'Connecting the wood industry for a sustainable future. Select your role to begin.';

  @override
  String get roleSupplierTitle => 'Supplier';

  @override
  String get roleSupplierSubtitle => 'Timber Trader';

  @override
  String get roleSupplierDesc => 'Source & sell raw timber materials';

  @override
  String get roleGeneratorTitle => 'Generator';

  @override
  String get roleGeneratorSubtitle => 'Furniture Workshop';

  @override
  String get roleGeneratorDesc => 'Manage production & wood waste';

  @override
  String get roleAggregatorTitle => 'Aggregator';

  @override
  String get roleAggregatorSubtitle => 'Logistics';

  @override
  String get roleAggregatorDesc => 'Collect, transport & store materials';

  @override
  String get roleConverterTitle => 'Converter';

  @override
  String get roleConverterSubtitle => 'Creative Artisan';

  @override
  String get roleConverterDesc => 'Upcycle waste into value products';

  @override
  String get roleDesignerTitle => 'Designer';

  @override
  String get roleDesignerSubtitle => 'Creative Consultant';

  @override
  String get roleDesignerDesc =>
      'Offer design services and waste upcycling consulting';

  @override
  String get roleBuyerTitle => 'Buyer / End User';

  @override
  String get roleBuyerSubtitle => 'Public Consumer';

  @override
  String get roleBuyerDesc => 'Purchase unique upcycled wood products';

  @override
  String get continueButton => 'Continue';

  @override
  String get alreadyHaveAccount => 'Already have an account? ';

  @override
  String get logInButton => 'Log in';

  @override
  String get splashSubtitle => 'Turning Waste into Wealth';

  @override
  String get splashInitializing => 'INITIALIZING...';

  @override
  String get onboardingCaptureSellTitle => 'Capture & Sell';

  @override
  String get onboardingCaptureSellSubtitle =>
      'Simply take a photo of your wood waste to list it on the marketplace. No more burning—turn your leftovers into resources.';

  @override
  String get onboardingCaptureSellHighlight => 'Sell';

  @override
  String get onboardingEfficientCollectionTitle => 'Efficient Collection';

  @override
  String get onboardingEfficientCollectionSubtitle =>
      'Aggregators bridge the gap by collecting waste from various workshops and supplying them to creative converters. We automate the pickup scheduling so you can focus on sorting and selling.';

  @override
  String get onboardingEfficientCollectionHighlight => 'Collection';

  @override
  String get onboardingTraceableImpactTitle => 'Traceable Impact';

  @override
  String get onboardingTraceableImpactSubtitle =>
      'Every piece of wood has a story. Track your environmental impact and showcase the sustainable journey of your products to eco-conscious buyers worldwide.';

  @override
  String get onboardingTraceableImpactHighlight => 'Impact';

  @override
  String get onboardingSkip => 'Skip';

  @override
  String get onboardingNext => 'Next';

  @override
  String get loginWelcomeBack => 'Welcome Back!';

  @override
  String get loginSubtitle => 'Log in to manage your wood cycle.';

  @override
  String get loginEmailLabel => 'Email';

  @override
  String get loginEmailHint => 'Enter your email';

  @override
  String get loginPasswordLabel => 'Password';

  @override
  String get loginPasswordHint => 'Enter your password';

  @override
  String get loginForgotPasswordLink => 'Forgot Password?';

  @override
  String get loginButton => 'Login';

  @override
  String get loginOrContinueWith => 'Or continue with';

  @override
  String get loginGoogle => 'Google';

  @override
  String get loginApple => 'Apple';

  @override
  String get loginDontHaveAccount => 'Don\'t have an account? ';

  @override
  String get loginSignUp => 'Sign Up';

  @override
  String get forgotPasswordTitle => 'Forgot Password?';

  @override
  String get forgotPasswordSubtitle =>
      'Enter your email address to receive a password reset link.';

  @override
  String get forgotPasswordEmailLabel => 'Email Address';

  @override
  String get forgotPasswordEmailHint => 'you@example.com';

  @override
  String get forgotPasswordSendLink => 'Send Link';

  @override
  String get forgotPasswordBackToLogin => 'Back to Login';

  @override
  String get b2bProfileTitle => 'Business Profile';

  @override
  String get b2bProfileActivity => 'Activity';

  @override
  String get b2bProfileCertification => 'Certification';

  @override
  String get b2bProfileComplete => 'Complete';

  @override
  String get b2bProfileCompanyInfo => 'Company Information';

  @override
  String get b2bProfileDigitalWallet => 'Digital Wallet';

  @override
  String get b2bProfileLegalDocs => 'Legality Documents';

  @override
  String get b2bProfileAccountSecurity => 'Account Security';

  @override
  String get b2bProfileHelpCenter => 'Help Center';

  @override
  String get b2bProfileLogout => 'Log Out';

  @override
  String get notificationTitle => 'Notifications';

  @override
  String get notificationMarkRead => 'Mark as Read';

  @override
  String get notificationNew => 'New';

  @override
  String get notificationEarlier => 'Earlier';

  @override
  String get walletTitle => 'WoodLoop Wallet';

  @override
  String get walletTotalBalance => 'Total Active Balance';

  @override
  String get walletTopUp => 'Top Up';

  @override
  String get walletTransfer => 'Transfer';

  @override
  String get walletWithdraw => 'Withdraw';

  @override
  String get walletHistoryIcon => 'History';

  @override
  String get walletRecentTransactions => 'Recent Transactions';

  @override
  String designerReviews(String count) {
    return ' ($count Reviews)';
  }

  @override
  String get designerStatProducts => 'Products';

  @override
  String get designerStatSaved => 'Saved';

  @override
  String get designerStatCustomProjects => 'Custom Projects';

  @override
  String get designerConsultButton => 'Design Consultation';

  @override
  String get designerPortfolioTitle => 'Upcycle Portfolio';

  @override
  String get supplierDashWelcome => 'Welcome back,';

  @override
  String get supplierDashOverviewTitle => 'Dashboard Overview';

  @override
  String get supplierDashMonthlyRevenue => 'Monthly Revenue';

  @override
  String get supplierDashTotalStock => 'Total Timber Stock';

  @override
  String get supplierDashActiveListings => 'Active Listings';

  @override
  String get supplierDashListNewTimber => 'List New Timber';

  @override
  String get supplierDashRecentSales => 'Recent Sales';

  @override
  String get supplierDashViewAll => 'View All';

  @override
  String get navDashboard => 'Dashboard';

  @override
  String get navMarket => 'Market';

  @override
  String get navInventory => 'Inventory';

  @override
  String get navMessages => 'Messages';

  @override
  String get navProfile => 'Profile';

  @override
  String get supplierRegStep1 => 'Step 1 of 3';

  @override
  String get supplierRegTitle => 'Create Supplier Account';

  @override
  String get supplierRegSubtitle => 'Connect your timber business to WoodLoop.';

  @override
  String get supplierRegFullNameLabel => 'FULL NAME';

  @override
  String get supplierRegFullNameHint => 'John Doe';

  @override
  String get supplierRegCompanyNameLabel => 'COMPANY NAME';

  @override
  String get supplierRegCompanyNameHint => 'Jepara Teak Mill';

  @override
  String get supplierRegPhoneLabel => 'PHONE NUMBER';

  @override
  String get supplierRegAddressLabel => 'BUSINESS ADDRESS';

  @override
  String get supplierRegMapHint =>
      'Tap the map to pin your exact mill location.';

  @override
  String get supplierRegCertLabel => 'LEGAL CERTIFICATIONS';

  @override
  String get supplierRegCertRequired => 'Required';

  @override
  String get supplierRegUploadTitle => 'Upload SVLK or FSC';

  @override
  String get supplierRegUploadHint => 'PDF, JPG or PNG (Max 5MB)';

  @override
  String get supplierRegTermsPrefix => 'By registering, you agree to our ';

  @override
  String get supplierRegTermsLink => 'Terms of Service';

  @override
  String get supplierRegTermsAnd => '\nand ';

  @override
  String get supplierRegPrivacyLink => 'Privacy Policy';

  @override
  String get supplierRegTermsSuffix => '.';

  @override
  String get supplierRegCompleteBtn => 'Complete Registration';

  @override
  String get supplierRegAlreadyHaveAccount => 'Already have an account? ';

  @override
  String get supplierRegLoginLink => 'Login';

  @override
  String get supplierSalesHistoryTitle => 'Sales History';

  @override
  String get supplierSalesHistoryFilterAll => 'All Orders';

  @override
  String get supplierSalesHistoryFilterCompleted => 'Completed';

  @override
  String get supplierSalesHistoryFilterProcessing => 'Processing';

  @override
  String get supplierSalesHistoryFilterShipped => 'Shipped';

  @override
  String get supplierSalesHistoryFilterCancelled => 'Cancelled';

  @override
  String get supplierSalesHistoryTotalRevenue => 'Total Revenue';

  @override
  String get supplierSalesHistoryOrdersCompleted => 'Orders Completed';

  @override
  String get supplierSalesHistorySearchHint => 'Search orders...';

  @override
  String get supplierSalesHistoryToday => 'Today';

  @override
  String get supplierSalesHistoryYesterdayMock => 'Yesterday, Oct 24';

  @override
  String get supplierSalesHistoryDateMock => 'Oct 22, 2023';

  @override
  String get supplierSalesHistoryVsLastMonth => ' vs last month';

  @override
  String get supplierSalesHistoryNoOrders => 'No orders found.';

  @override
  String get supplierListTimberCancel => 'Cancel';

  @override
  String get supplierListTimberTitle => 'New Listing';

  @override
  String get supplierListTimberCaptureTitle => 'Capture Timber';

  @override
  String get supplierListTimberCaptureSubtitle =>
      'Tap to add photos of log ends and bark texture';

  @override
  String get supplierListTimberSpecsTitle => 'Specifications';

  @override
  String get supplierListTimberSpecsSpecies => 'Wood Species';

  @override
  String get supplierListTimberSpecsSpeciesHint => 'Select species (e.g. Jati)';

  @override
  String get supplierListTimberSpeciesJati => 'Jati (Teak)';

  @override
  String get supplierListTimberSpeciesMahoni => 'Mahoni (Mahogany)';

  @override
  String get supplierListTimberSpeciesMerbau => 'Merbau';

  @override
  String get supplierListTimberSpeciesSengon => 'Sengon';

  @override
  String get supplierListTimberSpeciesUlin => 'Ulin (Ironwood)';

  @override
  String get supplierListTimberSpecsGrade => 'Quality Grade';

  @override
  String get supplierListTimberDimTitle => 'Dimensions';

  @override
  String get supplierListTimberDimDiameter => 'Diameter (cm)';

  @override
  String get supplierListTimberDimLength => 'Length (m)';

  @override
  String get supplierListTimberDimEstVolume => 'EST. VOLUME';

  @override
  String get supplierListTimberFinTitle => 'Financials';

  @override
  String get supplierListTimberFinPrice => 'Price per m³';

  @override
  String get supplierListTimberFinTotalApprox =>
      'Based on volume, total approx: Rp 0';

  @override
  String get supplierListTimberCompTitle => 'Compliance';

  @override
  String get supplierListTimberCompLegalCert => 'Legal Certification';

  @override
  String get supplierListTimberCompSvlkorFsc => 'SVLK or FSC Document';

  @override
  String get supplierListTimberCompUpload => 'Upload PDF / Image';

  @override
  String get supplierListTimberPublishBtn => 'Publish to Marketplace';

  @override
  String supplierListTimberGrade(String grade) {
    return 'Grade $grade';
  }

  @override
  String get supplierMarketTitle => 'Raw Timber Market';

  @override
  String get supplierMarketSearchHint => 'Search logs, ID, or species...';

  @override
  String get supplierMarketFilterAll => 'All';

  @override
  String get supplierMarketFilterTeak => 'Teak (Jati)';

  @override
  String get supplierMarketFilterMahogany => 'Mahogany';

  @override
  String get supplierMarketFilterLogs => 'Logs';

  @override
  String get supplierMarketFilterFsc => 'FSC Only';

  @override
  String get supplierMarketAvailableStock => 'Available Stock';

  @override
  String get supplierMarketSortBy => 'Sort by: ';

  @override
  String get supplierMarketSortVolumeHigh => 'Volume (High)';

  @override
  String get supplierMarketShowingListings =>
      'Showing 142 listings from verified suppliers in Jepara';

  @override
  String get supplierMarketBulkInquiry => 'Bulk Inquiry';

  @override
  String get supplierMarketNavMarket => 'Market';

  @override
  String get supplierMarketNavInventory => 'Inventory';

  @override
  String get supplierMarketNavMessages => 'Messages';

  @override
  String get supplierMarketNavProfile => 'Profile';

  @override
  String supplierMarketSupplierPrefix(String supplier) {
    return 'Supplier: $supplier';
  }

  @override
  String supplierMarketMinOrder(String minOrder) {
    return 'Min. Order: $minOrder';
  }

  @override
  String get supplierMarketSpecThick => 'THICK';

  @override
  String get supplierMarketSpecWidth => 'WIDTH';

  @override
  String get supplierMarketSpecProcess => 'PROCESS';

  @override
  String get supplierMarketSpecDry => ' Dry';

  @override
  String get supplierMarketAvailableVol => 'Available Volume';

  @override
  String get supplierMarketAddToQuote => 'Add to Quote';

  @override
  String get supplierMarketOutOfStock => 'Out of Stock';

  @override
  String get supplierMarketNotifyAvailable => 'Notify When Available';

  @override
  String get generatorRegStep => 'Step 1 of 2';

  @override
  String get generatorRegTitle => 'Register Workshop';

  @override
  String get generatorRegSubtitle =>
      'Enter your workshop information to join the circular economy network.';

  @override
  String get generatorRegWorkshopName => 'WORKSHOP NAME';

  @override
  String get generatorRegWorkshopHint => 'Jepara Artisans';

  @override
  String get generatorRegOwnerName => 'OWNER FULL NAME';

  @override
  String get generatorRegOwnerHint => 'Budi Santoso';

  @override
  String get generatorRegPhone => 'PHONE NUMBER';

  @override
  String get generatorRegPhoneHint => '812 3456 7890';

  @override
  String get generatorRegLocation => 'WORKSHOP LOCATION';

  @override
  String get generatorRegSetMap => 'Set Exact Location via Map';

  @override
  String get generatorRegMapSub => 'For pickup route optimization';

  @override
  String get generatorRegWasteFocus => 'Typical Waste Output';

  @override
  String get generatorRegWasteSub => 'Select all that apply to your production';

  @override
  String get generatorRegWasteSawdust => 'Sawdust (Serbuk)';

  @override
  String get generatorRegWasteOffcuts => 'Offcuts (Potongan)';

  @override
  String get generatorRegWasteChips => 'Wood Chips';

  @override
  String get generatorRegWastePallets => 'Pallets';

  @override
  String get generatorRegWasteBark => 'Bark';

  @override
  String get generatorRegVolLabel => 'EST. MONTHLY VOLUME (KG)';

  @override
  String get generatorRegVolHint => 'e.g. 500';

  @override
  String get generatorRegCompleteBtn => 'Complete Registration';

  @override
  String get generatorDashWelcome => 'WELCOME BACK';

  @override
  String get generatorDashTotalWaste => 'Total Waste Recycled';

  @override
  String get generatorDashProductsSold => 'PRODUCTS SOLD';

  @override
  String get generatorDashConversion => 'CONVERSION';

  @override
  String get generatorDashRevenue => 'Revenue';

  @override
  String get generatorDashPickup => 'Pickups';

  @override
  String get generatorDashRawMatStock => 'Raw Material Stock';

  @override
  String get generatorDashHardwood => 'Hardwood';

  @override
  String get generatorDashSoftwood => 'Softwood';

  @override
  String get generatorDashManageOutput => 'Manage Your Output';

  @override
  String get generatorDashManageOutputSub =>
      'List waste for collectors to pick up or add finished products to the marketplace.';

  @override
  String get generatorDashReportWasteBtn => 'Report / Sell Waste';

  @override
  String get generatorDashAddProductBtn => 'Add New Product';

  @override
  String get generatorDashFinishedProducts => 'Finished Products';

  @override
  String get generatorDashSeeAll => 'See All';

  @override
  String get generatorDashRecentWaste => 'Recent Waste Postings';

  @override
  String get generatorDashStatusPending => 'Pending';

  @override
  String get generatorDashStatusPickedUp => 'Picked Up';

  @override
  String get generatorDashStatusSold => 'Sold';

  @override
  String get generatorDashInStock => 'In Stock';

  @override
  String get generatorAddProductTitle => 'Add New Product';

  @override
  String get generatorAddProductPhoto => 'Product Photos';

  @override
  String get generatorAddProductAddPhotoBtn => 'Add';

  @override
  String get generatorAddProductPhotoHint =>
      'Upload high-quality photos. Max 5 images.';

  @override
  String get generatorAddProductName => 'Product Name';

  @override
  String get generatorAddProductNameHint =>
      'Example: Reclaimed Teak Coffee Table';

  @override
  String get generatorAddProductCategory => 'Category';

  @override
  String get generatorAddProductPrice => 'Price';

  @override
  String get generatorAddProductWoodSpecies => 'Wood Species Used';

  @override
  String get generatorAddProductOther => 'Other';

  @override
  String get generatorAddProductDesc => 'Description';

  @override
  String get generatorAddProductDescHint =>
      'Describe craftsmanship, finishing, and dimensions...';

  @override
  String get generatorAddProductWoodSource => 'Wood Source';

  @override
  String get generatorAddProductWoodSourceSub => 'Select from Purchase History';

  @override
  String get generatorAddProductWoodSourceHint => 'Select wood source...';

  @override
  String get generatorAddProductAddSourceManual => 'Add Source Manually';

  @override
  String get generatorAddProductPublishBtn => 'Publish to Marketplace';

  @override
  String get generatorAddProductSuccessMsg =>
      'Product successfully published to Marketplace!';

  @override
  String get generatorAddCategoryFurniture => 'Furniture';

  @override
  String get generatorAddCategorySouvenir => 'Souvenir';

  @override
  String get generatorAddCategoryDecor => 'Decor';

  @override
  String get generatorAddSpeciesTeak => 'Teak (Jati)';

  @override
  String get generatorAddSpeciesMahogany => 'Mahogany';

  @override
  String get generatorAddSpeciesPine => 'Pine (Pinus)';

  @override
  String get generatorAddSpeciesSonokeling => 'Sonokeling';

  @override
  String get generatorAddSourceMock1 => 'Log #TR-204 – Teak from Perhutani';

  @override
  String get generatorAddSourceMock2 => 'Log #TR-198 – Mahogany from Blora';

  @override
  String get generatorAddSourceMock3 => 'Log #TR-155 – Pine from Lembang';

  @override
  String get generatorReportTitle => 'Log Wood Waste';

  @override
  String get generatorReportCancel => 'Cancel';

  @override
  String get generatorReportStep1 => '1';

  @override
  String get generatorReportStep1Title => 'Capture Waste';

  @override
  String get generatorReportUploadPhoto => 'Upload photo for verification';

  @override
  String get generatorReportStep2 => '2';

  @override
  String get generatorReportStep2Title => 'Waste Information';

  @override
  String get generatorReportWasteForm => 'Waste Form';

  @override
  String get generatorReportFormOffcut => 'Offcut';

  @override
  String get generatorReportFormSawdust => 'Sawdust';

  @override
  String get generatorReportFormShaving => 'Shaving';

  @override
  String get generatorReportFormLogEnd => 'Log End';

  @override
  String get generatorReportWoodCondition => 'Wood Condition';

  @override
  String get generatorReportConditionDry => 'Dry';

  @override
  String get generatorReportConditionWet => 'Wet';

  @override
  String get generatorReportConditionMixed => 'Mixed';

  @override
  String get generatorReportStep3 => '3';

  @override
  String get generatorReportStep3Title => 'Waste Details';

  @override
  String get generatorReportQuantity => 'Quantity';

  @override
  String get generatorReportUnit => 'Unit';

  @override
  String get generatorReportDensityHint =>
      'Estimated density for teak is ~650kg/m³';

  @override
  String get generatorReportStep4 => '4';

  @override
  String get generatorReportStep4Title => 'Pickup Location';

  @override
  String get generatorReportCurrentLocation => 'Current Location';

  @override
  String get generatorReportMockLocation =>
      'Jepara Workshop A, Jl. Pemuda No. 45';

  @override
  String get generatorReportEstValue => 'EST. VALUE (IDR)';

  @override
  String get generatorReportCurrency => 'Rp';

  @override
  String get generatorReportPoints => 'POINTS';

  @override
  String get generatorReportSubmitBtn => 'Submit to Marketplace';

  @override
  String get generatorReportSuccessMsg =>
      'Waste successfully reported to Marketplace!';

  @override
  String get generatorOrderMgmtTitle => 'Manage Orders & History';

  @override
  String get generatorOrderMgmtTabActive => 'Active';

  @override
  String get generatorOrderMgmtTabCompleted => 'Completed';

  @override
  String get generatorOrderMgmtStatusWaiting => 'Waiting Pickup';

  @override
  String get generatorOrderMgmtStatusEnRoute => 'En Route';

  @override
  String get generatorOrderMgmtScanQRBtn => 'Scan Aggregator QR';

  @override
  String get aggregatorRegStepInfo => 'Step 1 of 2';

  @override
  String get aggregatorRegTitle => 'Register as Aggregator';

  @override
  String get aggregatorRegSubtitle =>
      'Enter your personal and vehicle details to start collecting waste and earning profit.';

  @override
  String get aggregatorRegFullName => 'FULL NAME';

  @override
  String get aggregatorRegFullNameHint => 'Budi Logistics';

  @override
  String get aggregatorRegIdCard => 'ID CARD NUMBER (NIK)';

  @override
  String get aggregatorRegIdCardHint => '3320...';

  @override
  String get aggregatorRegPhone => 'PHONE NUMBER';

  @override
  String get aggregatorRegPhoneHint => '812 3456 7890';

  @override
  String get aggregatorRegVehicleType => 'Vehicle Type';

  @override
  String get aggregatorRegVehicleTypeHint => 'Select the main vehicle you use';

  @override
  String get aggregatorRegVehicleMotorcart => 'Motorcart';

  @override
  String get aggregatorRegVehicleMotorcartCap => '< 100 kg';

  @override
  String get aggregatorRegVehiclePickup => 'Pick-up Truck';

  @override
  String get aggregatorRegVehiclePickupCap => '100 - 800 kg';

  @override
  String get aggregatorRegVehicleTruck => 'Light Truck';

  @override
  String get aggregatorRegVehicleTruckCap => '> 800 kg';

  @override
  String get aggregatorRegLicensePlate => 'VEHICLE LICENSE PLATE';

  @override
  String get aggregatorRegLicensePlateHint => 'K 1234 XY';

  @override
  String get aggregatorRegSubmitBtn => 'Complete Registration';

  @override
  String get aggregatorDashGreeting => 'Good Morning,';

  @override
  String get aggregatorDashEstIncome => 'Estimated Income Today';

  @override
  String get aggregatorDashTaskCount => 'Tasks';

  @override
  String get aggregatorDashRouteMap => 'Route Map';

  @override
  String get aggregatorDashWarehouse => 'Warehouse';

  @override
  String get aggregatorDashPickupSchedule => 'Pickup Schedule';

  @override
  String get aggregatorDashViewAll => 'View All';

  @override
  String get aggregatorDashNavHome => 'Home';

  @override
  String get aggregatorDashNavTransaction => 'Transactions';

  @override
  String get aggregatorDashNavProfile => 'Profile';

  @override
  String get aggregatorDashMockName => 'Budi Logistics';

  @override
  String get aggregatorDashMockDate => '09 Nov 2023';

  @override
  String get aggregatorDashMockIncome => 'Rp 650.000';

  @override
  String get aggregatorDashMockRouteDesc1Title => 'Jepara Artisans';

  @override
  String get aggregatorDashMockRouteDesc1Sub => 'Teak Sawdust • 50 Kg';

  @override
  String get aggregatorDashMockRouteDesc2Title => 'Pak Slamet Workshop';

  @override
  String get aggregatorDashMockRouteDesc2Sub => 'Mahogany Offcuts • 120 Kg';

  @override
  String get aggregatorDashMockRouteDesc3Title => 'UD. Kayu Makmur';

  @override
  String get aggregatorDashMockRouteDesc3Sub => 'Used Pallets • 15 Pcs';

  @override
  String get aggregatorMapLocation => 'Jepara, ID';

  @override
  String get aggregatorMapMockTitle => 'Teak Sawdust';

  @override
  String get aggregatorMapMockGenerator => 'Generator: Jepara Artisans';

  @override
  String get aggregatorMapMockDistance => '2.5 km';

  @override
  String get aggregatorMapEstWeight => 'EST. WEIGHT';

  @override
  String get aggregatorMapMockWeight => '50 Kg';

  @override
  String get aggregatorMapEstProfit => 'POTENTIAL PROFIT';

  @override
  String get aggregatorMapMockProfit => 'Rp 25.000';

  @override
  String get aggregatorMapTakeTaskBtn => 'Take Pickup Task';

  @override
  String get aggregatorPickupTitle => 'Confirm Pickup';

  @override
  String get aggregatorPickupCameraHint =>
      'Point camera to Generator\'s QR\nto confirm';

  @override
  String get aggregatorPickupDetailInfo => 'Pickup Details';

  @override
  String get aggregatorPickupTicketCode => 'Ticket Code';

  @override
  String get aggregatorPickupMockTicket => 'PKP-8921-A';

  @override
  String get aggregatorPickupGenerator => 'Generator';

  @override
  String get aggregatorPickupMockGenName => 'Jepara Artisans';

  @override
  String get aggregatorPickupMaterial => 'Material';

  @override
  String get aggregatorPickupMockMaterial => 'Teak Sawdust';

  @override
  String get aggregatorPickupEstWeight => 'Estimated Weight';

  @override
  String get aggregatorPickupMockWeight => '50.0 Kg';

  @override
  String get aggregatorPickupEstPayment => 'Potential Payment';

  @override
  String get aggregatorPickupMockPayment => 'Rp 25.000';

  @override
  String get aggregatorPickupManualInput => 'Manual Input/Edit Actual Weight';

  @override
  String get aggregatorPickupConfirmBtn => 'Complete Confirmation';

  @override
  String get aggregatorWarehouseTitle => 'Aggregator Warehouse';

  @override
  String get aggregatorWarehouseCapacity => 'Warehouse Capacity';

  @override
  String get aggregatorWarehouseMockCapacity => '850 Kg / 2000 Kg';

  @override
  String get aggregatorWarehouseFilterAll => 'All Materials';

  @override
  String get aggregatorWarehouseFilterSawdust => 'Sawdust';

  @override
  String get aggregatorWarehouseFilterOffcuts => 'Offcuts';

  @override
  String get aggregatorWarehouseFilterPallets => 'Used Pallets';

  @override
  String get aggregatorWarehouseMockItem1Title => 'Mixed Sawdust';

  @override
  String get aggregatorWarehouseMockItem1Sub => 'Mainly Teak & Mahogany';

  @override
  String get aggregatorWarehouseMockItem1Weight => '500 Kg';

  @override
  String get aggregatorWarehouseMockItem2Title => 'Mahogany Offcuts';

  @override
  String get aggregatorWarehouseMockItem2Sub => 'Small blocks ex-furniture';

  @override
  String get aggregatorWarehouseMockItem2Weight => '250 Kg';

  @override
  String get aggregatorWarehouseMockItem3Title => 'Broken Pallet';

  @override
  String get aggregatorWarehouseMockItem3Sub => 'Pine ex-packaging';

  @override
  String get aggregatorWarehouseMockItem3Weight => '100 Kg';

  @override
  String get aggregatorWarehouseSellBtn => 'Sell to Factory (Converter)';

  @override
  String get converterRegTitle => 'Register as Converter';

  @override
  String get converterRegHeader => 'Your Studio/Factory Profile';

  @override
  String get converterRegSubHeader =>
      'Complete data to start looking for wood waste supply or selling your upcycled products.';

  @override
  String get converterRegStudioName => 'Studio / Business Name';

  @override
  String get converterRegStudioNameHint => 'Example: Jepara Eco Art';

  @override
  String get converterRegOwnerName => 'Owner / PIC Name';

  @override
  String get converterRegOwnerNameHint => 'Example: Budi Santoso';

  @override
  String get converterRegWhatsApp => 'Active WhatsApp Number';

  @override
  String get converterRegWhatsAppHint => '081234567890';

  @override
  String get converterRegLocation => 'Target Workshop / Warehouse Location';

  @override
  String get converterRegSpecialty => 'Processing Focus / Specialty';

  @override
  String get converterRegSpecEcoFurniture => 'Eco-Friendly Furniture';

  @override
  String get converterRegSpecHandicraft => 'Handicraft & Arts';

  @override
  String get converterRegSpecBriquette => 'Wood Briquette / Pellet';

  @override
  String get converterRegSpecCompost => 'Compost / Agriculture';

  @override
  String get converterRegSpecOther => 'Other';

  @override
  String get converterRegRawMaterialNeed => 'Raw Material Need (Kg/Month)';

  @override
  String get converterRegRawMaterialHint => 'Example: 1000';

  @override
  String get converterRegSubmitBtn => 'Register & Enter Studio';

  @override
  String get converterRegRequiredValidation => 'This field is required';

  @override
  String get converterDashActiveStudio => 'Active Studio,';

  @override
  String get converterDashMockStudioName => 'Jepara Eco Art';

  @override
  String get converterDashRevenueThisMonth => 'This Month\'s Revenue';

  @override
  String get converterDashMockMonth => 'Nov 2023';

  @override
  String get converterDashMockRevenue => 'Rp 12.450.000';

  @override
  String get converterDashSoldLabel => 'Sold';

  @override
  String get converterDashMockSold => '14';

  @override
  String get converterDashProcessedLabel => 'Kg Processed';

  @override
  String get converterDashMockProcessed => '350';

  @override
  String get converterDashMenuMarketplace => 'Raw Material\nMarketplace';

  @override
  String get converterDashMenuCatalog => 'My Product\nCatalog';

  @override
  String get converterDashMenuClinic => 'Design\nClinic';

  @override
  String get converterDashNewProducts => 'New Products on Shelf';

  @override
  String get converterDashSeeAll => 'See All';

  @override
  String get converterDashMockProd1Title => 'Teak Pallet Lounge Chair';

  @override
  String get converterDashMockProd1Sub => '100% Upcycled Used Pallets';

  @override
  String get converterDashMockProd1Price => 'Rp 450.000';

  @override
  String get converterDashMockProd1Sales => '3';

  @override
  String get converterDashMockProd2Title => 'Resin & Sawdust Coffee Table';

  @override
  String get converterDashMockProd2Sub => 'Raw Material: Mixed Sawdust';

  @override
  String get converterDashMockProd2Price => 'Rp 1.200.000';

  @override
  String get converterDashMockProd2Sales => '1';

  @override
  String converterDashSalesCount(String sales) {
    return '$sales Sold';
  }

  @override
  String get converterDashNavStudio => 'Studio';

  @override
  String get converterDashNavMarketplace => 'Marketplace';

  @override
  String get converterDashNavOrders => 'Orders';

  @override
  String get converterDashNavProfile => 'Profile';

  @override
  String get converterAddProductTitle => 'Add Upcycled Product';

  @override
  String get converterAddProductMainPhoto => 'Main Product Photo';

  @override
  String get converterAddProductAddPhoto => 'Add Photo';

  @override
  String get converterAddProductPhotoSlot2 => 'Photo Slot 2\n(Optional)';

  @override
  String get converterAddProductName => 'Product Name';

  @override
  String get converterAddProductNameHint =>
      'Example: Minimalist Chair Ex-Pallet';

  @override
  String get converterAddProductDesc => 'Product Description & Impact Story';

  @override
  String get converterAddProductDescHint => 'Tell the upcycle process...';

  @override
  String get converterAddProductPrice => 'Selling Price (Rp)';

  @override
  String get converterAddProductPriceHint => 'Example: 450000';

  @override
  String get converterAddProductStock => 'Available Stock';

  @override
  String get converterAddProductStockHint => 'Example: 5';

  @override
  String get converterAddProductTraceability => 'Traceability / Raw Material';

  @override
  String get converterAddProductTraceabilityDesc =>
      'Select the wood waste transaction you used for this product. This will create a Traceability QR Code for the buyer.';

  @override
  String get converterAddProductSelectTransaction =>
      'Select Supply Transaction...';

  @override
  String get converterAddProductSubmitBtn => 'Save & Publish Product';

  @override
  String get converterClinicTitle => 'Design Clinic & Inspiration';

  @override
  String get converterClinicTabGlobal => 'Global Trends';

  @override
  String get converterClinicTabPallet => 'Pallet Ideas';

  @override
  String get converterClinicTabResin => 'Sawdust & Resin';

  @override
  String get converterClinicTabStructure => 'Structural Schemes';

  @override
  String get converterClinicMockAuthor1 => 'DesignLab Global';

  @override
  String get converterClinicMockTime1 => '2 hours ago';

  @override
  String get converterClinicMockTitle1 => 'Modular Pallet Sofa';

  @override
  String get converterClinicMockDesc1 =>
      'How to arrange 4 broken pallets into a comfortable minimalist sofa. Perfect for outdoor cafes.';

  @override
  String get converterClinicMockAuthor2 => 'Local Wood Studio';

  @override
  String get converterClinicMockTime2 => '5 hours ago';

  @override
  String get converterClinicMockTitle2 =>
      'Wood sawdust pressing method for coasters';

  @override
  String get converterClinicMockDesc2 =>
      'Using a mixture of sawdust from milling waste with eco-friendly epoxy glue.';

  @override
  String get converterClinicAskExpertBtn => 'Ask Expert';

  @override
  String get converterCatalogTitle => 'Your Product Catalog';

  @override
  String get converterCatalogStatusActive => 'Active';

  @override
  String get converterCatalogStatusSoldOut => 'Sold Out';

  @override
  String get converterCatalogStatusSoldOutBadge => 'SOLD OUT';

  @override
  String get converterCatalogBtnAdd => 'Add Product';

  @override
  String converterCatalogStock(String count) {
    return 'Stock: $count';
  }

  @override
  String get converterCatalogMockTitle1 => 'Teak Pallet Chair';

  @override
  String get converterCatalogMockTitle2 => 'Sawdust Resin Table';

  @override
  String get converterCatalogMockTitle3 => 'Mahogany Cutout Ashtray';

  @override
  String get converterCatalogMockTitle4 => 'Minimalist Flower Rack';

  @override
  String get converterMarketTitle => 'Wood Waste Marketplace';

  @override
  String get converterMarketSearchHint => 'Search waste (e.g. Teak Sawdust)';

  @override
  String get converterMarketTabAll => 'All';

  @override
  String get converterMarketTabSawdust => 'Sawdust';

  @override
  String get converterMarketTabCutout => 'Cutout';

  @override
  String get converterMarketTabPallet => 'Pallet';

  @override
  String get converterMarketTabSort => 'Warehouse Sorting';

  @override
  String get converterMarketMockTitle1 => 'Pure Teak Sawdust (Warehouse A)';

  @override
  String get converterMarketMockSeller1 => 'Budi Logistics (Aggregator)';

  @override
  String get converterMarketMockStock1 => 'Available: 850 Kg';

  @override
  String get converterMarketMockPrice1 => 'Rp 600 / Kg';

  @override
  String get converterMarketMockTitle2 => 'Small Mahogany Cutouts';

  @override
  String get converterMarketMockSeller2 => 'Jepara Artisans (Generator)';

  @override
  String get converterMarketMockStock2 => 'Available: 120 Kg';

  @override
  String get converterMarketMockPrice2 => 'Rp 1.500 / Kg';

  @override
  String get converterMarketMockTitle3 => 'Used Imported Pine Pallets';

  @override
  String get converterMarketMockSeller3 => 'WoodLoop Central Warehouse';

  @override
  String get converterMarketMockStock3 => 'Available: 45 Pcs';

  @override
  String get converterMarketMockPrice3 => 'Rp 15.000 / Pcs';

  @override
  String get buyerRegTitle => 'Buyer Registration';

  @override
  String get buyerRegHeader => 'Join the Circular Economy';

  @override
  String get buyerRegSubheader =>
      'Find aesthetic upcycled furniture and crafts while reducing the earth\'s carbon emissions.';

  @override
  String get buyerRegNameLabel => 'Full Name';

  @override
  String get buyerRegNameHint => 'According to ID Card';

  @override
  String get buyerRegEmailLabel => 'Email';

  @override
  String get buyerRegEmailHint => 'email@domain.com';

  @override
  String get buyerRegPhoneLabel => 'WhatsApp Number';

  @override
  String get buyerRegPhoneHint => '081234567890';

  @override
  String get buyerRegPasswordLabel => 'Password';

  @override
  String get buyerRegPasswordHint => 'Minimum 8 characters';

  @override
  String get buyerRegAddressLabel => 'Main Shipping Address (Optional)';

  @override
  String get buyerRegAddressHint => 'Home or office address';

  @override
  String get buyerRegBtnSubmit => 'Register & Explore Products';

  @override
  String get buyerRegRequiredValidation => 'This field is required';

  @override
  String get buyerProfileWelcome => 'Welcome,';

  @override
  String get buyerProfileMockName => 'Sarah Wijaya';

  @override
  String get buyerProfileImpactTitle => 'Your Trail of Goodness';

  @override
  String get buyerProfileImpactProducts => 'Products\nBought';

  @override
  String get buyerProfileImpactWood => 'Kg Wood\nSaved';

  @override
  String get buyerProfileImpactCO2 => 'Kg CO2\nReduced';

  @override
  String get buyerProfileMenuStore => 'Upcycle\nStore';

  @override
  String get buyerProfileMenuTrack => 'Track\nOrder';

  @override
  String get buyerProfileMenuFavorites => 'Favorite\nCollection';

  @override
  String get buyerProfileSectionRecent => 'Recent Purchases';

  @override
  String get buyerProfileStatusShipping => 'In Delivery';

  @override
  String get buyerProfileMockOrderTitle1 => 'Sawdust Resin Coffee Table';

  @override
  String get buyerProfileMockOrderStore1 => 'Jepara Eco Art';

  @override
  String get buyerProfileStatusDone => 'Completed';

  @override
  String get buyerProfileMockOrderTitle2 => 'Mahogany Wood Ashtray Set';

  @override
  String get buyerProfileMockOrderStore2 => 'Green Studio';

  @override
  String get buyerProfileOrderTotal => 'Total Purchase';

  @override
  String get buyerProfileNavHome => 'Home';

  @override
  String get buyerProfileNavMarket => 'Market';

  @override
  String get buyerProfileNavOrders => 'Orders';

  @override
  String get buyerProfileNavProfile => 'Profile';

  @override
  String get buyerMarketCatTitle => 'Product Categories';

  @override
  String get buyerMarketCat1Title => 'Large Furniture';

  @override
  String get buyerMarketCat1Subtitle =>
      'Sofas, Dining Tables, Cabinets from selected wood logs and pallets.';

  @override
  String get buyerMarketCat2Title => 'Decor & Crafts';

  @override
  String get buyerMarketCat2Subtitle =>
      'Wall panels, desk clocks, ornaments from wood cutouts.';

  @override
  String get buyerMarketCat3Title => 'Resin & Sawdust Composites';

  @override
  String get buyerMarketCat3Subtitle =>
      'Coasters, ashtrays, innovative transparent resin tables.';

  @override
  String get buyerMarketCat4Title => 'Daily Accessories';

  @override
  String get buyerMarketCat4Subtitle =>
      'Keychains, phone stands, portable bookshelves.';

  @override
  String get buyerOrderTrackTitle => 'Track Delivery';

  @override
  String get buyerOrderTrackMockProduct => 'Aesthetic Pallet Chair (+1 other)';

  @override
  String get buyerOrderTrackMockStore => 'Jepara Eco Art';

  @override
  String get buyerOrderTrackOrigin => 'Track Origin of Wood Waste';

  @override
  String get buyerOrderTrackStatusHeader => 'Delivery Status';

  @override
  String get buyerOrderTrackStep1Title => 'Order Received';

  @override
  String get buyerOrderTrackStep1Desc => 'Payment verified.';

  @override
  String get buyerOrderTrackStep2Title => 'Packed by Studio';

  @override
  String get buyerOrderTrackStep2Desc =>
      'Waiting for logistics partner pickup.';

  @override
  String get buyerOrderTrackStep3Title => 'On the Way to You';

  @override
  String get buyerOrderTrackStep3Desc =>
      'Courier is heading to your location (Receipt: WX-998821).';

  @override
  String get buyerOrderTrackStep4Title => 'Order Completed';

  @override
  String get buyerOrderTrackStep4Desc =>
      'Goods have been received in good condition.';

  @override
  String get buyerOrderTrackBtnConfirm => 'Confirm Order Received';

  @override
  String get buyerCheckoutTitle => 'Checkout';

  @override
  String get buyerCheckoutShippingAddress => 'Shipping Address';

  @override
  String get buyerCheckoutBtnChange => 'Change';

  @override
  String get buyerCheckoutMockUser => 'Sarah Wijaya | 081234567890';

  @override
  String get buyerCheckoutMockAddress =>
      'Jl. Jend. Sudirman No. 45, Graha Building 12th Floor\nCentral Jakarta, 10210\nIndonesia';

  @override
  String get buyerCheckoutOrderDetails => 'Order Details';

  @override
  String get buyerCheckoutMockProduct1 => 'Aesthetic Pallet Chair';

  @override
  String get buyerCheckoutMockProduct2 => 'Resin Coaster Set of 4';

  @override
  String get buyerCheckoutSubtotal => 'Subtotal';

  @override
  String get buyerCheckoutShippingFee => 'Shipping Fee';

  @override
  String get buyerCheckoutEcoWarriorDiscount => 'Eco-Warrior Discount';

  @override
  String get buyerCheckoutPaymentMethod => 'Payment Method';

  @override
  String get buyerCheckoutPaymentBCA => 'BCA Virtual Account';

  @override
  String get buyerCheckoutPaymentQRIS => 'QRIS';

  @override
  String get buyerCheckoutPaymentCard => 'Credit / Debit Card';

  @override
  String get buyerCheckoutTotal => 'Total Purchase';

  @override
  String get buyerCheckoutBtnPay => 'Pay Now';

  @override
  String get buyerUpcycledMarketTitle => 'Upcycle Marketplace';

  @override
  String get buyerUpcycledMarketSearchHint => 'Search aesthetic furniture...';

  @override
  String get buyerUpcycledMarketHighlightNew => 'New Collection';

  @override
  String get buyerUpcycledMarketHighlightTitle =>
      'Teak Pallet Aesthetics\nStudio X Collaboration';

  @override
  String get buyerUpcycledMarketHighlightAction => 'View Collection ->';

  @override
  String get buyerUpcycledMarketCatAll => 'All';

  @override
  String get buyerUpcycledMarketCatDecor => 'Decor';

  @override
  String get buyerUpcycledMarketCatFurniture => 'Furniture';

  @override
  String get buyerUpcycledMarketCatAccessories => 'Accessories';

  @override
  String get buyerUpcycledMarketMockTitle1 => 'Aesthetic Pallet Chair';

  @override
  String get buyerUpcycledMarketMockStudio1 => 'Jepara Eco Art';

  @override
  String get buyerUpcycledMarketMockImpact1 => '🌳 Save 12kg of Wood';

  @override
  String get buyerUpcycledMarketMockTitle2 => 'Sawdust Resin Table';

  @override
  String get buyerUpcycledMarketMockStudio2 => 'Woodie Studio';

  @override
  String get buyerUpcycledMarketMockImpact2 => '🌳 Save 45kg of Wood';

  @override
  String get buyerUpcycledMarketMockTitle3 => 'Cutout Desk Lamp';

  @override
  String get buyerUpcycledMarketMockStudio3 => 'Local Creations';

  @override
  String get buyerUpcycledMarketMockImpact3 => '🌳 Save 3kg of Wood';

  @override
  String get buyerUpcycledMarketMockTitle4 => 'Minimalist Bookshelf';

  @override
  String get buyerUpcycledMarketMockStudio4 => 'Jepara Eco Art';

  @override
  String get buyerUpcycledMarketMockImpact4 => '🌳 Save 8kg of Wood';

  @override
  String get buyerCartTitle => 'Shopping Cart';

  @override
  String get buyerCartMockStore1 => 'Jepara Eco Art';

  @override
  String get buyerCartMockProduct1 => 'Aesthetic Pallet Chair';

  @override
  String get buyerCartMockStore2 => 'Woodie Studio';

  @override
  String get buyerCartMockProduct2 => 'Sawdust Resin Coaster (Set of 4)';

  @override
  String buyerCartTotalItems(String count) {
    return 'Total Items ($count)';
  }

  @override
  String get buyerCartTotalImpact => 'Total Positive Impact';

  @override
  String get buyerCartTotalImpactValueMock => '13.5 Kg Wood';

  @override
  String get buyerCartBtnCheckout => 'Proceed to Checkout';

  @override
  String get traceabilityTitle => 'Traceability';

  @override
  String get traceabilityCategoryMock => 'UPCYCLED TEAK';

  @override
  String get traceabilityMockProduct => 'Teak Wall Panel';

  @override
  String get traceabilityMockModel => 'Model X-24';

  @override
  String get traceabilityInStock => 'In Stock';

  @override
  String get traceabilityCraftedBy => 'CRAFTED BY';

  @override
  String get traceabilityMockStudio => 'Sari Studio';

  @override
  String get traceabilityImpactMetrics => 'Impact Metrics';

  @override
  String get traceabilityCO2Offset => 'CO2 OFFSET';

  @override
  String get traceabilityWasteDiverted => 'WASTE DIVERTED';

  @override
  String get traceabilityMaterialComposition => 'Material Composition';

  @override
  String get traceabilityMaterialMock => '100% Upcycled Wood';

  @override
  String get traceabilityJourney => 'Product Journey';

  @override
  String get traceabilityVerifiedBlockchain => 'Blockchain Verified';

  @override
  String get traceabilityStep1Label => 'Origin';

  @override
  String get traceabilityStep1Title => 'Raw Wood Sourcing';

  @override
  String get traceabilityStep1Desc => 'Sourced sustainably from ';

  @override
  String get traceabilityStep1Entity => 'Perhutani Forest';

  @override
  String get traceabilityStep2Label => 'Waste Gen';

  @override
  String get traceabilityStep2Title => 'Production Scrap';

  @override
  String get traceabilityStep2Desc => 'Offcuts collected from ';

  @override
  String get traceabilityStep2Entity => 'Budi Workshop';

  @override
  String get traceabilityStep3Label => 'Aggregation';

  @override
  String get traceabilityStep3Title => 'Waste Collection';

  @override
  String get traceabilityStep3Desc => 'Transported and sorted by ';

  @override
  String get traceabilityStep3Entity => 'Mas Joko Logistics';

  @override
  String get traceabilityStep4Label => 'Final Product';

  @override
  String get traceabilityStep4Title => 'Upcycled Creation';

  @override
  String get traceabilityStep4Desc => 'Handcrafted into panel by ';

  @override
  String get traceabilityStep4Entity => 'Sari Studio';

  @override
  String get traceabilityVerifiedBadge => 'Verified';

  @override
  String get traceabilityAddToCart => 'Add to Cart';

  @override
  String get traceabilitySelectSourceTitle => 'Select Wood Source';

  @override
  String get traceabilitySelectSourceSearchHint =>
      'Search by Batch ID or Type...';

  @override
  String get traceabilitySelectSourceBtnUse => 'Use This Source';

  @override
  String get traceabilitySelectSourceMockDate1 => '10 Nov 2023';

  @override
  String get traceabilitySelectSourceMockType1 => 'Teak Sawdust';

  @override
  String get traceabilitySelectSourceMockVol1 => '50 Kg';

  @override
  String get traceabilitySelectSourceMockSupplier1 => 'UD Sukses Makmur';

  @override
  String get traceabilitySelectSourceMockBatch1 => 'BATCH-20231110-01';

  @override
  String get traceabilitySelectSourceMockDate2 => '02 Nov 2023';

  @override
  String get traceabilitySelectSourceMockType2 => 'Mango Wood Cutouts';

  @override
  String get traceabilitySelectSourceMockVol2 => '120 Kg';

  @override
  String get traceabilitySelectSourceMockSupplier2 => 'H. Toni Sawmill';

  @override
  String get traceabilitySelectSourceMockBatch2 => 'BATCH-20231102-05';

  @override
  String get traceabilitySelectSourceMockDate3 => '28 Oct 2023';

  @override
  String get traceabilitySelectSourceMockType3 => 'Used Pine Pallet';

  @override
  String get traceabilitySelectSourceMockVol3 => '85 Kg';

  @override
  String get traceabilitySelectSourceMockSupplier3 => 'Maju Jaya Logistics';

  @override
  String get traceabilitySelectSourceMockBatch3 => 'BATCH-20231028-12';

  @override
  String traceabilitySelectSourceIdFormat(String batchId) {
    return 'ID: $batchId';
  }

  @override
  String get chatMessagesTitle => 'Messages';

  @override
  String get chatMessagesTabAll => 'All';

  @override
  String get chatMessagesTabUnread => 'Unread';

  @override
  String get chatMessagesTabSystem => 'System';

  @override
  String get chatMockSender1 => 'Budi Logistics (Aggregator)';

  @override
  String get chatMockMessage1 =>
      'Hello, I have arrived at the waste pickup location...';

  @override
  String get chatMockTime1 => '10:30';

  @override
  String get chatMockSender2 => 'Dian (Ekowood Studio)';

  @override
  String get chatMockMessage2 =>
      'Noted, we will revise the pallet chair model according to...';

  @override
  String get chatMockTime2 => 'Yesterday';

  @override
  String get chatMockSender3 => 'WoodLoop CS';

  @override
  String get chatMockMessage3 =>
      '[System] Your Supplier account verification was successful...';

  @override
  String get chatMockTime3 => 'Monday';

  @override
  String get chatDmSenderName => 'Budi Logistics';

  @override
  String get chatDmStatusOnline => 'Online';

  @override
  String get chatDmMessage1 =>
      'Hello, I have arrived at the waste pickup location. Could you point me to the pile?';

  @override
  String get chatDmTime1 => '10:30';

  @override
  String get chatDmMessage2 => 'Sure Mr. Budi. I\'ll be right out.';

  @override
  String get chatDmTime2 => '10:32';

  @override
  String get chatDmMessage3 => 'Here is the pickup booking code: PKP-8921-A';

  @override
  String get chatDmTime3 => '10:33';

  @override
  String get chatDmToday => 'Today';

  @override
  String get chatDmInputHint => 'Type a message...';

  @override
  String get enablerAnalyticsTitle => 'Impact Analytics';

  @override
  String get enablerAnalyticsRegion => 'Region: Jepara';

  @override
  String get enablerAnalyticsFilterMonth => 'This Month';

  @override
  String get enablerAnalyticsKpiWaste => 'Waste Saved';

  @override
  String get enablerAnalyticsKpiWasteMockValue => '1,240';

  @override
  String get enablerAnalyticsKpiWasteMockUnit => 'Tons';

  @override
  String get enablerAnalyticsKpiWasteMockTrend => '+12%';

  @override
  String get enablerAnalyticsKpiCarbon => 'Carbon Emission Reduced';

  @override
  String get enablerAnalyticsKpiCarbonMockValue => '850';

  @override
  String get enablerAnalyticsKpiCarbonMockUnit => 'kg CO2e';

  @override
  String get enablerAnalyticsKpiCarbonMockTrend => '+5%';

  @override
  String get enablerAnalyticsKpiEconomy => 'Economic Multiplier Value';

  @override
  String get enablerAnalyticsKpiEconomyMockValue => 'Rp 45B';

  @override
  String get enablerAnalyticsKpiEconomyMockTrend => '+18%';

  @override
  String get enablerAnalyticsKpiActiveUsers => 'Active Participants';

  @override
  String get enablerAnalyticsKpiActiveUsersMockValue => '3,402';

  @override
  String get enablerAnalyticsKpiActiveUsersMockUnit => 'Users';

  @override
  String get enablerAnalyticsKpiActiveUsersMockTrend => '+2%';

  @override
  String get enablerAnalyticsChartTitle =>
      'Documented Wood Volume (Traceability)';

  @override
  String get enablerAnalyticsChartMockLegend => 'Volume Growth Chart (Mock)';

  @override
  String get enablerAnalyticsTopContributors => 'Top Contributors (This Week)';

  @override
  String get enablerAnalyticsTopMockName1 => 'Budi Logistics (Aggregator)';

  @override
  String get enablerAnalyticsTopMockStat1 => '450 Kg Wood Saved';

  @override
  String get enablerAnalyticsTopMockName2 => 'Jepara Eco Art (Converter)';

  @override
  String get enablerAnalyticsTopMockStat2 => '120 Kg Wood Saved';

  @override
  String get enablerAnalyticsTopMockName3 => 'UD Sukses Makmur (Generator)';

  @override
  String get enablerAnalyticsTopMockStat3 => '90 Kg Wood Documented';
}
