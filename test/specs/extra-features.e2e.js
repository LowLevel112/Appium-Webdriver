/**
 * EXTRA FEATURES TEST SUITE
 * 
 * Test Cases:
 * 1. Screen rotation handling
 * 2. Text input with keyboard management
 * 
 * Purpose: Additional test coverage for UI interactions
 */

// ============================================
// IMPORTS
// ============================================
const {
  TIMEOUT_MEDIUM,
  TIMEOUT_SHORT,
  PAUSE_MEDIUM,
  PAUSE_LONG,
  SELECTORS,
  TEST_DATA,
  ORIENTATION_LANDSCAPE,
  ORIENTATION_PORTRAIT,
  APP_PACKAGE,
} = require('../helpers/constants');

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
describe('ApiDemos - Extra Features', () => {

  /**
   * HOOK: beforeEach
   * 
   * Restart app trước mỗi test
   * Đảm bảo clean state
   */
  beforeEach(async () => {
    await restartApp();
  });

  /**
   * TEST CASE 1: Screen Rotation
   * 
   * Verify app handle screen rotation gracefully
   * Similar to advanced-features nhưng thêm longer pause
   */
  it('should test screen rotation', async () => {
    log('Extra Test 1: Screen Rotation - START', 'INFO');
    
    // Navigate to App menu
    await waitAndClick(
      SELECTORS.APP_MENU,
      TIMEOUT_MEDIUM,
      'Opened App menu'
    );

    // Rotate to LANDSCAPE
    // Pause PAUSE_LONG (3s) - để đảm bảo app fully rotated
    await changeOrientation(ORIENTATION_LANDSCAPE, PAUSE_LONG);
    expect(await browser.getOrientation()).toBe(ORIENTATION_LANDSCAPE);

    // Rotate back to PORTRAIT
    await changeOrientation(ORIENTATION_PORTRAIT, PAUSE_LONG);
    expect(await browser.getOrientation()).toBe(ORIENTATION_PORTRAIT);
    
    log('Extra Test 1: Screen Rotation - PASSED ✓', 'INFO');
  });

  /**
   * TEST CASE 2: Text Input with Keyboard Management
   * 
   * Verify:
   * - Keyboard shows when focusing input
   * - Text input works correctly
   * - Keyboard can be dismissed
   * 
   * Navigate: Views > Controls > Light Theme
   */
  it('should test text input in Views Controls', async () => {
    log('Extra Test 2: Text Input - START', 'INFO');
    
    // Step 1: Navigate to Views > Controls > Light Theme
    // Click Views menu
    await waitAndClick(
      SELECTORS.VIEWS_MENU,
      TIMEOUT_MEDIUM,
      'Opened Views menu'
    );

    // Click Controls submenu
    await waitAndClick(
      SELECTORS.CONTROLS_MENU,
      TIMEOUT_MEDIUM, // Longer timeout than advanced-features
      'Opened Controls menu'
    );

    // Click Light Theme
    await waitAndClick(
      SELECTORS.LIGHT_THEME,
      TIMEOUT_MEDIUM,
      'Selected Light Theme'
    );

    // ========================================
    // Step 2: Text Input
    // ========================================
    
    const testText = TEST_DATA.TEXT_INPUT_EXTRA; // 'Appium Automation'
    
    // Enter text vào field
    await enterText(
      SELECTORS.EDIT_TEXT,
      testText,
      TIMEOUT_SHORT
    );

    // ========================================
    // Step 3: Verify Keyboard & Text
    // ========================================
    
    // Get text từ field
    const textField = await $(SELECTORS.EDIT_TEXT);
    const enteredText = await textField.getText();
    
    // Verify text
    expect(enteredText).toBe(testText);
    log(`Text input verified: "${enteredText}"`, 'INFO');

    // Check keyboard showing
    const keyboardShown = await browser.isKeyboardShown();
    log(`Keyboard shown: ${keyboardShown}`, 'INFO');

    // ========================================
    // Step 4: Dismiss Keyboard
    // ========================================
    
    if (keyboardShown) {
      await dismissKeyboard();
      
      // Verify keyboard hidden
      const keyboardHidden = !(await browser.isKeyboardShown());
      expect(keyboardHidden).toBe(true);
      log('Keyboard dismissed successfully', 'INFO');
    }
    
    log('Extra Test 2: Text Input - PASSED ✓', 'INFO');
  });
});
