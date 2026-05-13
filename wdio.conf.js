/**
 * WebdriverIO + Appium Configuration File
 * 
 * Tập hợp các cấu hình cho WebdriverIO framework
 * Sử dụng cho cả Emulator và Real Device (Realme 5)
 */

require('dotenv').config(); // Load .env variables
const path = require('path');
const fs = require('fs');

// Import constants
const {
  APP_PACKAGE,
  APP_ACTIVITY,
  EMULATOR_NAME,
  REAL_DEVICE_NAME,
  PLATFORM_NAME,
  AUTOMATION_ENGINE,
  REAL_DEVICE_UDID,
  REAL_DEVICE_PLATFORM_VERSION,
  TIMEOUT_ADB,
  APPIUM_SETTINGS,
} = require('./test/helpers/constants');

// ============================================
// ANDROID HOME CONFIGURATION
// ============================================
// Thiết lập ANDROID_HOME nếu chưa được set trong environment
if (!process.env.ANDROID_HOME) {
    process.env.ANDROID_HOME = 'C:\\Users\\WINDOWS\\AppData\\Local\\Android\\Sdk';
}

// Resolve đường dẫn tới APK file cần test
const apkPath = path.resolve(process.cwd(), 'apps', 'ApiDemos-debug.apk');

// ============================================
// EMULATOR CAPABILITIES
// ============================================
// Cấu hình cho Android Emulator (máy ảo)
const emulatorCapability = {
    platformName: PLATFORM_NAME, // 'Android'
    'appium:automationName': AUTOMATION_ENGINE, // 'UiAutomator2' - automation engine
    'appium:deviceName': EMULATOR_NAME, // Tên hiển thị cho emulator
    'appium:app': apkPath, // Đường dẫn tới APK cần test
    'appium:autoGrantPermissions': true, // Tự động cấp quyền khi app yêu cầu
    'appium:ignoreHiddenApiPolicyError': true, // Bỏ qua lỗi hidden API (Android 9+)
};

// ============================================
// REAL DEVICE CAPABILITIES (REALME 5)
// ============================================
// Cấu hình cho thiết bị thật Realme 5
const realmeCapability = {
    platformName: PLATFORM_NAME, // 'Android'
    'appium:automationName': AUTOMATION_ENGINE, // 'UiAutomator2'
    'appium:deviceName': REAL_DEVICE_NAME, // Tên hiển thị
    'appium:platformVersion': REAL_DEVICE_PLATFORM_VERSION, // Android version
    'appium:udid': REAL_DEVICE_UDID, // Unique Device ID - lấy từ env hoặc default
    'appium:app': apkPath, // APK file
    'appium:appPackage': APP_PACKAGE, // Package name của app
    'appium:appActivity': APP_ACTIVITY, // Main activity của app
    'appium:noReset': true, // Không reset app state (giữ nguyên data từ lần chạy trước)
    'appium:newCommandTimeout': 300, // Timeout 5 phút cho mỗi command
    'appium:autoGrantPermissions': true, // Tự động grant permissions
    'appium:adbExecTimeout': TIMEOUT_ADB, // Timeout cho ADB commands
    'appium:ignoreHiddenApiPolicyError': true, // Bỏ qua lỗi hidden API
    'appium:settings[ignoreUnimportantViews]': true, // Bỏ qua views không quan trọng
};


// ============================================
// WEBDRIVERIO CONFIGURATION
// ============================================
exports.config = {
    // Runner để chạy test locally (không remote)
    runner: 'local',
    
    // Appium server connection settings
    port: APPIUM_SETTINGS.PORT, // Port mà Appium server chạy
    path: APPIUM_SETTINGS.PATH, // WebDriver protocol path
    
    // Test specs files pattern
    specs: ['./test/specs/**/*.e2e.js'], // Tất cả .e2e.js files trong test/specs
    
    // Number of parallel workers
    maxInstances: APPIUM_SETTINGS.MAX_INSTANCES, // 1 = chạy tuần tự (tránh conflict)

    // Chọn capability dựa vào environment variable
    // npm run test:android -> dùng emulator
    // npm run test:realme -> dùng real device (RUN_ON_REAL_DEVICE=true)
    capabilities: [process.env.RUN_ON_REAL_DEVICE === 'true' ? realmeCapability : emulatorCapability],

    // Log level: quiet, silent, warn, error, verbose, debug
    logLevel: APPIUM_SETTINGS.LOG_LEVEL, // 'error' - chỉ show errors, giảm noise
    
    // Timeout cho waitForDisplayed/waitForExist
    waitforTimeout: 15000, // Timeout 15 giây
    
    // Timeout cho connection retry
    connectionRetryTimeout: 120000, // 2 phút
    
    // Số lần retry khi connection fail
    connectionRetryCount: APPIUM_SETTINGS.CONNECTION_RETRY_COUNT, // 1 lần

    // Services để khởi chạy Appium server tự động
    services: ['appium'], // Dùng @wdio/appium-service
    
    // Test framework
    framework: 'mocha', // Mocha - BDD framework
    
    // Reporters để generate test reports
    reporters: [
        'spec', // In kết quả ra console dưới dạng spec format
        ['allure', { // Allure reporter - generate HTML reports
            outputDir: 'allure-results', // Nơi lưu raw report data
            disableWebdriverStepsReporting: true, // Không log mỗi webdriver step
            disableWebdriverScreenshotsReporting: false, // Lưu screenshots khi fail
        }]
    ],
    
    // Mocha options
    mochaOpts: { 
        ui: 'bdd', // BDD style (describe, it, beforeEach, etc)
        timeout: 120000, // Timeout 2 phút cho mỗi test case
    },

    // ============================================
    // HOOKS - Lifecycle callbacks
    // ============================================
    
    /**
     * Hook: Chạy trước test suite bắt đầu
     * Dùng để setup, clean old reports, etc
     */
    onPrepare: function () {
        // Xóa old Allure results trước khi chạy test
        const resultsPath = path.join(process.cwd(), 'allure-results');
        if (fs.existsSync(resultsPath)) {
            fs.rmSync(resultsPath, { recursive: true, force: true });
            console.log('[CLEANUP] Xóa old allure-results');
        }
    },

    /**
     * Hook: Chạy sau mỗi test case kết thúc
     * Dùng để take screenshot khi test fail
     */
    afterTest: async function (test, context, { passed }) {
        // Nếu test fail, take screenshot để debug
        if (!passed) {
            const timestamp = new Date().getTime();
            const screenshotPath = path.resolve(process.cwd(), 'logs', 'screenshots');
            
            // Tạo thư mục nếu chưa tồn tại
            if (!fs.existsSync(screenshotPath)) {
                fs.mkdirSync(screenshotPath, { recursive: true });
            }
            
            // Sanitize test name để làm filename
            const safeTitle = test.title.replace(/[<>:"/\\|?*]/g, '_');
            
            // Save screenshot
            await browser.saveScreenshot(
                path.join(screenshotPath, `fail_${safeTitle}_${timestamp}.png`)
            );
            
            console.log(`[SCREENSHOT] Saved: fail_${safeTitle}_${timestamp}.png`);
        }
    }
};
