import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:woodloop_app/injection_container.dart';
import 'package:woodloop_app/main.dart';

void main() {
  testWidgets('Splash Screen smoke test', (WidgetTester tester) async {
    // Initialize DI before building app
    TestWidgetsFlutterBinding.ensureInitialized();
    await dotenv.load(fileName: '.env');
    await configureDependencies();

    await tester.pumpWidget(const WoodLoopApp());
    await tester.pump();

    // Verify that the splash screen shows 'W' and 'Turning Waste into Wealth'.
    expect(find.text('W'), findsOneWidget);
    expect(find.text('Turning Waste into Wealth'), findsOneWidget);

    await tester.pumpAndSettle(const Duration(seconds: 3));
  });
}
