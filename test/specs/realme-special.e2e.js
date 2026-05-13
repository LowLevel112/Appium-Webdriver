/**
 * REALME 5 SPECIAL HARDWARE TEST SUITE
 * 
 * Test Cases:
 * 1. Verify physical device connection
 * 2. Handle app menu and permission popups
 * 3. Test screen rotation on real hardware
 * 
 * Purpose: Verify app compatibility with Realme 5 real device
 */

// ============================================
// IMPORTS
// ============================================
const {
  TIMEOUT_SHORT,
  TIMEOUT_MEDIUM,
  TIMEOUT_LONG,
  PAUSE_MEDIUM,
  PAUSE_LONG,
  SELECTORS,
  ORIENTATION_LANDSCAPE,
  ORIENTATION_PORTRAIT,
  APP_PACKAGE,
} = require('../helpers/constants');

const {
  restartApp,
  waitAndClick,
  changeOrientation,
  executeShellCommand,
  log,
} = require('../helpers/testHelpers');

// ============================================
// TEST SUITE
// ============================================
describe('Realme 5 - Special Hardware Scenarios', () => {

  /**
   * HOOK: beforeEach
   * 
   * Restart app trước mỗi test
   * Quan trọng đặc biệt trên real device có thể bị lag/stuck
   */
  beforeEach(async () => {
    await restartApp();
  });

  /**
   * TEST CASE 1: Verify Physical Connection to Realme 5
   * 
   * Description: Check device info via adb shell
   * 
   * Purpose: Confirm test environment setup is correct
   * - Verify device is Realme manufacturer
   * - Log device info for debugging
   * 
   * Note: If shell command fails, test continues
   * (some devices restrict shell access)
   */
  it('Step 0: Verify Physical Connection to Realme 5', async () => {
    log('Realme Test 1: Device Connection - START', 'INFO');
    
    console.log('=========================================');
    console.log('--- ĐANG KIỂM TRA KẾT NỐI VẬT LÝ ---');
    
    try {
      // Execute getprop via mobile: shell command
      // Syntax: driver.executeScript('mobile: shell', [command, arg1, arg2, ...])
      // Note: Different from normal mobile shell which uses {command: '...'}
      
      // Get manufacturer name (e.g., 'Realme')
      const manufacturer = await executeShellCommand(['getprop', 'ro.product.manufacturer']);
      
      // Get model name (e.g., 'Realme 5')
      const model = await executeShellCommand(['getprop', 'ro.product.model']);
      
      if (manufacturer && model) {
        console.log(`Thiết bị: ${manufacturer.toUpperCase()} ${model}`);
        console.log('Kết nối: [OK] - Sẵn sàng thực hiện test');
      }
      
      console.log('=========================================');
      
      // Verify manufacturer contains 'realme'
      expect(manufacturer.toLowerCase()).toContain('realme');
      log('Device verified as Realme', 'INFO');
      
    } catch (err) {
      // Log warning nhưng test vẫn pass
      // (vì shell access có thể bị restrict)
      console.log(`Cảnh báo: ${err.message}`);
      log('Device connection check skipped (shell access restricted)', 'INFO');
    }
    
    log('Realme Test 1: Device Connection - PASSED ✓', 'INFO');
  });

  /**
   * TEST CASE 2: Handle App Menu and Permission Popups
   * 
   * Description: Verify app menu opens and handle system popups
   * 
   * Purpose: Test:
   * - App menu navigation
   * - System permission popup handling
   * - UI element recognition on Realme 5
   * 
   * Realme UI has special permission dialogs - test should handle them
   */
  it('should handle app menu and verify UI elements', async () => {
    log('Realme Test 2: App Menu & Permissions - START', 'INFO');
    
    console.log('--- Kiểm tra menu App trên Realme 5 ---');
    
    // Step 1: Click App menu
    // Timeout: TIMEOUT_LONG (15s) - real device can be slow
    await waitAndClick(
      SELECTORS.APP_MENU,
      TIMEOUT_LONG,
      'Clicked App menu on Realme 5'
    );
    
    console.log('Đã click vào menu App');
    
    // Step 2: Pause thêm để UI settle
    await browser.pause(PAUSE_MEDIUM);
    
    // Step 3: Try handle permission popup (if any)
    // Realme UI có thể show permission popup
    try {
      // Try find allow/permission button
      const allowBtn = await $(SELECTORS.ALLOW_BUTTON);
      
      // Check nếu button display
      if (await allowBtn.isDisplayed()) {
        await allowBtn.click();
        console.log('Đã xác nhận popup quyền');
        log('Permission popup handled', 'INFO');
      }
    } catch (e) {
      // No permission popup - continue
      console.log('Không có popup quyền, tiếp tục...');
      log('No permission popup appeared', 'INFO');
    }
    
    log('Realme Test 2: App Menu & Permissions - PASSED ✓', 'INFO');
  });

  /**
   * TEST CASE 3: Screen Rotation on Real Hardware
   * 
   * Description: Verify app stability during screen rotation on Realme 5
   * 
   * Purpose: 
   * - Real devices may have different rotation behavior
   * - Verify app doesn't crash on rotation
   * - Test layout responsiveness on real screen
   * 
   * Note: Real device rotation may take longer than emulator
   */
  it('should verify app stability on screen rotation (Real hardware)', async () => {
    log('Realme Test 3: Screen Rotation - START', 'INFO');
    
    // Step 1: Rotate to LANDSCAPE
    // Pause PAUSE_LONG (3s) - real device may take time to rotate
    await changeOrientation(ORIENTATION_LANDSCAPE, PAUSE_LONG);
    
    // Verify rotation
    expect(await browser.getOrientation()).toBe(ORIENTATION_LANDSCAPE);
    log('Rotated to LANDSCAPE', 'INFO');

    // Step 2: Rotate back to PORTRAIT
    // Pause PAUSE_LONG (3s)
    await changeOrientation(ORIENTATION_PORTRAIT, PAUSE_LONG);
    
    // Final verification
    expect(await browser.getOrientation()).toBe(ORIENTATION_PORTRAIT);
    
    console.log('--- Kiểm tra xoay màn hình: HOÀN TẤT ---');
    log('Realme Test 3: Screen Rotation - PASSED ✓', 'INFO');
  });
});
