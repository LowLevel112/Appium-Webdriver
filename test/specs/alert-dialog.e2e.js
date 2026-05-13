/**
 * ALERT DIALOG TEST SUITE
 * 
 * Test Case:
 * Navigate through menus and interact with Alert Dialog
 * 
 * Purpose: Verify app navigation and dialog handling
 */

// ============================================
// IMPORTS
// ============================================
const {
  TIMEOUT_VERY_LONG,
  TIMEOUT_LONG,
  TIMEOUT_MEDIUM,
  SELECTORS,
  TEST_DATA,
  APP_PACKAGE,
} = require('../helpers/constants');

const {
  restartApp,
  waitAndClick,
  getElementText,
  waitForElementToDisappear,
  log,
} = require('../helpers/testHelpers');

// ============================================
// TEST SUITE
// ============================================
describe('ApiDemos - Alert Dialog', () => {
  
  /**
   * HOOK: beforeEach
   * 
   * Reset app state trước mỗi test
   * Đặc biệt quan trọng cho test này vì menu state có thể bị stuck
   */
  beforeEach(async () => {
    await restartApp();
  });

  /**
   * TEST CASE: Alert Dialog Interaction
   * 
   * Description: Verify app can navigate to dialog and handle interaction
   * 
   * Steps:
   * 1. Navigate: App > Alert Dialogs > OK Cancel Dialog
   * 2. Verify dialog message contains "Lorem ipsum"
   * 3. Click OK button
   * 4. Verify dialog disappeared
   * 
   * Expected Result: Dialog should display and close without errors
   * 
   * Timeout Notes:
   * - First level menu: TIMEOUT_VERY_LONG (20s) - vì first load có thể chậm
   * - Submenu: TIMEOUT_LONG (15s) - menu animation
   * - Dialog: TIMEOUT_MEDIUM (10s) - normal UI load
   */
  it('opens App > Alert Dialogs, taps OK and validates dialog message', async () => {
    log('TEST: Alert Dialog Interaction - START', 'INFO');
    
    // ========================================
    // STEP 1: Navigate to Alert Dialogs
    // ========================================
    
    // Step 1a: Click "App" menu button
    // Timeout: TIMEOUT_VERY_LONG (20s) vì đây là main menu, có thể load chậm
    await waitAndClick(
      SELECTORS.APP_MENU,
      TIMEOUT_VERY_LONG,
      'Clicked App menu'
    );

    // Step 1b: Click "Alert Dialogs" submenu
    // Timeout: TIMEOUT_VERY_LONG (20s) - có transition animation
    await waitAndClick(
      SELECTORS.ALERT_DIALOGS_MENU,
      TIMEOUT_VERY_LONG,
      'Clicked Alert Dialogs menu'
    );

    // Step 1c: Click "OK Cancel Dialog with a message" button
    // Timeout: TIMEOUT_VERY_LONG (20s) - element có thể nằm sâu trong list
    await waitAndClick(
      SELECTORS.OK_CANCEL_BUTTON,
      TIMEOUT_VERY_LONG,
      'Clicked OK Cancel dialog button'
    );

    // ========================================
    // STEP 2: Verify Dialog Content
    // ========================================
    
    // Find element chứa text "Lorem ipsum"
    // waitForDisplayed() sẽ chờ element appear
    const dialogMessage = await $(SELECTORS.LOREM_IPSUM_TEXT);
    
    // Step 2a: Đợi message display
    // Timeout: TIMEOUT_MEDIUM (10s)
    await dialogMessage.waitForDisplayed({ timeout: TIMEOUT_MEDIUM });
    log('Dialog message displayed', 'INFO');

    // Step 2b: Get text từ dialog
    const text = await dialogMessage.getText();
    console.log('[DIALOG CONTENT]', text); // Log full content cho debug

    // Step 2c: Verify text contains "Lorem ipsum"
    // expect() - WebdriverIO assertion
    // stringContaining() - flex matching, không cần exact match
    await expect(dialogMessage).toHaveText(
      expect.stringContaining(TEST_DATA.EXPECTED_LOREM_IPSUM)
    );
    log(`Dialog text verified: contains "${TEST_DATA.EXPECTED_LOREM_IPSUM}"`, 'INFO');

    // ========================================
    // STEP 3: Close Dialog
    // ========================================
    
    // Find "OK" button trong dialog
    const okButton = await $(SELECTORS.OK_BUTTON);
    
    // Step 3a: Click OK button để close dialog
    await okButton.click();
    log('Clicked OK button', 'INFO');

    // ========================================
    // STEP 4: Verify Dialog Closed
    // ========================================
    
    // Step 4a: Wait for dialog message to disappear
    // reverse: true = chờ element KHÔNG hiển thị
    // Timeout: TIMEOUT_MEDIUM (5s) - dialog should close quickly
    await waitForElementToDisappear(SELECTORS.LOREM_IPSUM_TEXT, TIMEOUT_MEDIUM);
    log('Dialog disappeared', 'INFO');
    
    log('TEST: Alert Dialog Interaction - PASSED ✓', 'INFO');
  });
});
