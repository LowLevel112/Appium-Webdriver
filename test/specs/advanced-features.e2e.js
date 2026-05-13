/**
 * ADVANCED FEATURES TEST SUITE
 * 
 * Test Cases:
 * 1. Screen rotation: PORTRAIT → LANDSCAPE → PORTRAIT
 * 2. Text input: Navigate and enter text in Views > Controls
 * 
 * Purpose: Verify advanced app behaviors and responsive UI
 */

// ============================================
// IMPORTS
// ============================================
// Import constants - định nghĩa hằng số dùng chung
const {
  TIMEOUT_MEDIUM,
  TIMEOUT_SHORT,
  PAUSE_MEDIUM,
  SELECTORS,
  TEST_DATA,
  ORIENTATION_LANDSCAPE,
  ORIENTATION_PORTRAIT,
  APP_PACKAGE,
} = require('../helpers/constants');

// Import helpers - utility functions để reduce duplication
const {
  restartApp,
  waitAndClick,
  enterText,
  dismissKeyboard,
  changeOrientation,
  log,
} = require('../helpers/testHelpers');

// ============================================
// TEST SUITE
// ============================================
describe('ApiDemos - Advanced Features', () => {

  /**
   * HOOK: beforeEach
   * 
   * Chạy trước mỗi test case để:
   * - Restart ứng dụng (terminate + activate)
   * - Reset app state về home screen
   * - Tránh side effects từ test trước
   */
  beforeEach(async () => {
    await restartApp();
  });

  /**
   * TEST CASE 1: Screen Rotation
   * 
   * Description: Verify app display correctly when screen rotates
   * 
   * Steps:
   * 1. Open App menu
   * 2. Rotate to LANDSCAPE
   * 3. Verify rotation successful
   * 4. Rotate back to PORTRAIT
   * 5. Verify final rotation
   * 
   * Expected Result: App should handle rotation without crashing
   */
  it('should test screen rotation', async () => {
    log('TEST 1: Screen Rotation - START', 'INFO');
    
    // Step 1: Click "App" menu để open app menu
    // Timeout: TIMEOUT_MEDIUM (10s) vì menu bình thường load nhanh
    await waitAndClick(
      SELECTORS.APP_MENU,
      TIMEOUT_MEDIUM,
      'Opened App menu'
    );

    // Step 2: Rotate to LANDSCAPE
    // changeOrientation() sẽ:
    // - Set orientation
    // - Pause 2s để app re-render
    // - Assert orientation == LANDSCAPE
    await changeOrientation(ORIENTATION_LANDSCAPE, PAUSE_MEDIUM);
    
    // Step 3: Double check current orientation is LANDSCAPE
    const orientationAfterRotate = await browser.getOrientation();
    expect(orientationAfterRotate).toBe(ORIENTATION_LANDSCAPE);
    log('Rotated to LANDSCAPE successfully', 'INFO');

    // Step 4: Rotate lại PORTRAIT
    // Pause thêm 2s để app settle down
    await changeOrientation(ORIENTATION_PORTRAIT, PAUSE_MEDIUM);
    
    // Step 5: Final verification - orientation should be PORTRAIT
    expect(await browser.getOrientation()).toBe(ORIENTATION_PORTRAIT);
    log('TEST 1: Screen Rotation - PASSED ✓', 'INFO');
  });

  /**
   * TEST CASE 2: Text Input in Views Controls
   * 
   * Description: Verify text input functionality in Views > Controls section
   * 
   * Steps:
   * 1. Open Views menu
   * 2. Open Controls submenu
   * 3. Select "1. Light Theme" option
   * 4. Find text input field
   * 5. Enter test text
   * 6. Verify text was entered correctly
   * 7. Hide keyboard
   * 
   * Expected Result: Text input field should contain exactly what we typed
   */
  it('should test text input in Views Controls', async () => {
    log('TEST 2: Text Input - START', 'INFO');
    
    // Step 1: Click "Views" menu
    // Timeout: TIMEOUT_MEDIUM (10s)
    await waitAndClick(
      SELECTORS.VIEWS_MENU,
      TIMEOUT_MEDIUM,
      'Opened Views menu'
    );

    // Step 2: Click "Controls" submenu
    // Timeout: TIMEOUT_SHORT (5s) vì submenu appear nhanh
    await waitAndClick(
      SELECTORS.CONTROLS_MENU,
      TIMEOUT_SHORT,
      'Opened Controls menu'
    );

    // Step 3: Click "1. Light Theme" option
    // Timeout: TIMEOUT_SHORT (5s)
    await waitAndClick(
      SELECTORS.LIGHT_THEME,
      TIMEOUT_SHORT,
      'Selected Light Theme'
    );

    // Step 4 & 5: Find text field và enter text
    // enterText() helper sẽ:
    // - Find element
    // - Wait for displayed
    // - Set value
    // - Log action
    const testText = TEST_DATA.TEXT_INPUT_ADVANCED; // 'Hoc Appium cung AI'
    await enterText(
      SELECTORS.EDIT_TEXT,
      testText,
      TIMEOUT_SHORT
    );

    // Step 6: Verify text was entered correctly
    // Get text từ field và so sánh với input
    const textField = await $(SELECTORS.EDIT_TEXT);
    const enteredText = await textField.getText();
    
    expect(enteredText).toBe(testText);
    log(`Text verified: "${enteredText}" = "${testText}"`, 'INFO');

    // Step 7: Dismiss keyboard nếu vẫn hiển thị
    // dismissKeyboard() check xem keyboard có show không, nếu có thì hide
    await dismissKeyboard();
    
    log('TEST 2: Text Input - PASSED ✓', 'INFO');
  });
});
