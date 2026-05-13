/**
 * Test Helper Functions
 * 
 * Tập hợp các utility functions dùng chung trong test
 * Giúp reduce code duplication và improve maintainability
 */

const { APP_PACKAGE, PAUSE_MEDIUM } = require('./constants');

/**
 * Restart ứng dụng
 * 
 * Hữu ích để reset app state trước mỗi test
 * Tránh tình trạng app bị stuck hoặc có state từ test trước
 */
async function restartApp() {
  await driver.terminateApp(APP_PACKAGE);
  await driver.activateApp(APP_PACKAGE);
}

/**
 * Đợi element xuất hiện, click và verify
 * 
 * @param {string} selector - XPath hoặc CSS selector của element
 * @param {number} timeout - Timeout chờ element (ms)
 * @param {string} actionName - Tên action để log (optional)
 */
async function waitAndClick(selector, timeout, actionName) {
  const element = await $(selector);
  await element.waitForDisplayed({ timeout });
  
  if (actionName) {
    console.log(`[ACTION] ${actionName}`);
  }
  
  await element.click();
}

/**
 * Lấy text của element và verify
 * 
 * @param {string} selector - XPath hoặc CSS selector
 * @param {number} timeout - Timeout chờ element
 * @returns {Promise<string>} - Text content của element
 */
async function getElementText(selector, timeout) {
  const element = await $(selector);
  await element.waitForDisplayed({ timeout });
  return await element.getText();
}

/**
 * Nhập text vào input field
 * 
 * @param {string} selector - XPath của input field
 * @param {string} text - Text cần nhập
 * @param {number} timeout - Timeout chờ element
 */
async function enterText(selector, text, timeout) {
  const element = await $(selector);
  await element.waitForDisplayed({ timeout });
  await element.setValue(text);
  console.log(`[INPUT] Nhập text: "${text}"`);
}

/**
 * Kiểm tra keyboard có đang hiển thị không, nếu có thì ẩn
 */
async function dismissKeyboard() {
  if (await browser.isKeyboardShown()) {
    await browser.hideKeyboard();
    console.log('[KEYBOARD] Ẩn keyboard');
  }
}

/**
 * Set screen orientation và verify
 * 
 * @param {string} orientation - 'PORTRAIT' hoặc 'LANDSCAPE'
 * @param {number} pauseMs - Pause time sau khi set orientation (ms)
 */
async function changeOrientation(orientation, pauseMs = PAUSE_MEDIUM) {
  await browser.setOrientation(orientation);
  await browser.pause(pauseMs);
  
  const currentOrientation = await browser.getOrientation();
  console.log(`[ORIENTATION] Đổi sang: ${orientation} (current: ${currentOrientation})`);
  
  expect(currentOrientation).toBe(orientation);
}

/**
 * Check xem element có hiển thị không
 * 
 * @param {string} selector - XPath hoặc CSS selector
 * @param {number} timeout - Timeout chờ
 * @returns {Promise<boolean>} - true nếu element hiển thị, false nếu không
 */
async function isElementDisplayed(selector, timeout = 5000) {
  try {
    const element = await $(selector);
    return await element.waitForDisplayed({ timeout, reverse: false });
  } catch {
    return false;
  }
}

/**
 * Đợi element biến mất
 * 
 * Hữu ích để verify dialog/popup đã đóng
 * 
 * @param {string} selector - XPath hoặc CSS selector
 * @param {number} timeout - Timeout chờ element biến mất
 */
async function waitForElementToDisappear(selector, timeout = 5000) {
  const element = await $(selector);
  await element.waitForDisplayed({ timeout, reverse: true });
  console.log(`[VERIFY] Element biến mất sau ${timeout}ms`);
}

/**
 * Execute shell command trên device
 * 
 * @param {string[]} command - Command array, e.g., ['getprop', 'ro.product.manufacturer']
 * @returns {Promise<string>} - Output của command
 */
async function executeShellCommand(command) {
  try {
    const result = await driver.executeScript('mobile: shell', command);
    return result ? result.trim() : '';
  } catch (err) {
    console.warn(`[SHELL ERROR] ${command.join(' ')} - ${err.message}`);
    return '';
  }
}

/**
 * Log message với timestamp
 * 
 * @param {string} message - Message cần log
 * @param {string} level - 'INFO', 'DEBUG', 'WARN', 'ERROR'
 */
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

/**
 * Wait for multiple elements và click element matching condition
 * 
 * @param {string[]} selectors - Array của selectors
 * @param {string} matchText - Partial text để match
 * @param {number} timeout - Timeout
 */
async function findAndClickByText(selectors, matchText, timeout = 10000) {
  for (const selector of selectors) {
    try {
      const element = await $(selector);
      if (await element.waitForDisplayed({ timeout: 3000 })) {
        const text = await element.getText();
        if (text.includes(matchText)) {
          await element.click();
          console.log(`[FOUND & CLICK] Found: "${text}"`);
          return;
        }
      }
    } catch {
      // Continue to next selector
    }
  }
  console.warn(`[NOT FOUND] Không tìm thấy element chứa text: "${matchText}"`);
}

// ============================================
// EXPORT MODULES
// ============================================
module.exports = {
  restartApp,
  waitAndClick,
  getElementText,
  enterText,
  dismissKeyboard,
  changeOrientation,
  isElementDisplayed,
  waitForElementToDisappear,
  executeShellCommand,
  log,
  findAndClickByText,
};
