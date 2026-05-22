/**
 * Test Configuration Constants
 * 
 * Tập hợp các hằng số dùng chung trong toàn bộ test suite
 * Giúp tránh hardcode giá trị và dễ bảo trì
 */

// ============================================
// TIMEOUT CONSTANTS (milliseconds)
// ============================================
/** Timeout ngắn cho các element thường xuất hiện nhanh */
const TIMEOUT_SHORT = 5000;

/** Timeout trung bình cho các element bình thường */
const TIMEOUT_MEDIUM = 10000;

/** Timeout dài cho các element chậm hoặc các action phức tạp */
const TIMEOUT_LONG = 15000;

/** Timeout rất dài cho real device (có thể bị lag) */
const TIMEOUT_VERY_LONG = 20000;

/** Timeout cho shell commands và adb execution */
const TIMEOUT_ADB = 120000;

/** Pause giữa các action (simulate user delay) */
const PAUSE_SHORT = 1000;
const PAUSE_MEDIUM = 2000;
const PAUSE_LONG = 3000;

// ============================================
// APP CONFIGURATION
// ============================================
/** Package name của ứng dụng test */
const APP_PACKAGE = 'io.appium.android.apis';

/** Activity chính của ứng dụng */
const APP_ACTIVITY = 'io.appium.android.apis.ApiDemos';

/** Tên thiết bị ảo (Emulator) */
const EMULATOR_NAME = 'Android Emulator';

/** Tên thiết bị thật (Realme 5) */
const REAL_DEVICE_NAME = 'Realme 5';

/** Platform name cho Android */
const PLATFORM_NAME = 'Android';

/** Automation engine dùng cho Android */
const AUTOMATION_ENGINE = 'UiAutomator2';

// ============================================
// DEVICE IDENTIFIERS
// ============================================
/** UDID của thiết bị thật Realme 5 (lấy từ env variable hoặc default) */
const REAL_DEVICE_UDID = process.env.UDID || '';

/** Platform version của Realme 5 */
const REAL_DEVICE_PLATFORM_VERSION = '10.0';

// ============================================
// SCREEN ORIENTATIONS
// ============================================
const ORIENTATION_LANDSCAPE = 'LANDSCAPE';
const ORIENTATION_PORTRAIT = 'PORTRAIT';

// ============================================
// UI ELEMENT SELECTORS (XPath)
// ============================================
/**
 * Selectors cho các UI element trong app
 * Dùng content-desc vì nó ổn định hơn text content
 */
const SELECTORS = {
  // Menu items
  APP_MENU: '//android.widget.TextView[@content-desc="App"]',
  VIEWS_MENU: '//android.widget.TextView[@content-desc="Views"]',
  CONTROLS_MENU: '//android.widget.TextView[@content-desc="Controls"]',
  ALERT_DIALOGS_MENU: '//android.widget.TextView[@content-desc="Alert Dialogs"]',
  LIGHT_THEME: '//android.widget.TextView[@content-desc="1. Light Theme"]',
  
  // Buttons
  OK_CANCEL_BUTTON: '//android.widget.Button[@content-desc="OK Cancel dialog with a message"]',
  OK_BUTTON: '//android.widget.Button[@text="OK"]',
  ALLOW_BUTTON: '//android.widget.Button[contains(@text, "CHO PHÉP") or contains(@text, "ALLOW") or contains(@text, "Allow")]',
  
  // Input fields
  EDIT_TEXT: '//android.widget.EditText[@resource-id="io.appium.android.apis:id/edit"]',
  
  // Dialog content
  LOREM_IPSUM_TEXT: '//*[contains(@text, "Lorem ipsum")]',
};

// ============================================
// TEST DATA
// ============================================
const TEST_DATA = {
  // Text để nhập vào text field
  TEXT_INPUT_ADVANCED: 'Hoc Appium cung AI',
  TEXT_INPUT_EXTRA: 'Appium Automation',
  
  // Expected texts
  EXPECTED_LOREM_IPSUM: 'Lorem ipsum',
};

// ============================================
// APPIUM SETTINGS
// ============================================
const APPIUM_SETTINGS = {
  /** Cấu hình port cho Appium server */
  PORT: 4723,
  
  /** Path cho WebDriver protocol */
  PATH: '/',
  
  /** Số instance tối đa chạy song song */
  MAX_INSTANCES: 1,
  
  /** Log level (quiet, silent, warn, error, verbose, debug) */
  LOG_LEVEL: 'error',
  
  /** Số lần retry khi connection fail */
  CONNECTION_RETRY_COUNT: 1,
};

// ============================================
// EXPORT MODULES
// ============================================
module.exports = {
  // Timeouts
  TIMEOUT_SHORT,
  TIMEOUT_MEDIUM,
  TIMEOUT_LONG,
  TIMEOUT_VERY_LONG,
  TIMEOUT_ADB,
  PAUSE_SHORT,
  PAUSE_MEDIUM,
  PAUSE_LONG,
  
  // App config
  APP_PACKAGE,
  APP_ACTIVITY,
  EMULATOR_NAME,
  REAL_DEVICE_NAME,
  PLATFORM_NAME,
  AUTOMATION_ENGINE,
  
  // Device IDs
  REAL_DEVICE_UDID,
  REAL_DEVICE_PLATFORM_VERSION,
  
  // Orientations
  ORIENTATION_LANDSCAPE,
  ORIENTATION_PORTRAIT,
  
  // Selectors
  SELECTORS,
  
  // Test data
  TEST_DATA,
  
  // Appium settings
  APPIUM_SETTINGS,
};
