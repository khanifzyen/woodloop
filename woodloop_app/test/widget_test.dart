// This is a basic Flutter widget test.
import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/main.dart';

void main() {
  testWidgets('Splash Screen smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const WoodLoopApp());

    // Verify that the splash screen shows 'W' and 'Turning Waste into Wealth'.
    expect(find.text('W'), findsOneWidget);
    expect(find.text('Turning Waste into Wealth'), findsOneWidget);

    // Wait for the initialization timer to finish and navigate.
    await tester.pumpAndSettle(const Duration(seconds: 3));
  });
}
