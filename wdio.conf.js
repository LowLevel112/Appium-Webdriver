const path = require('path');
const fs = require('fs');

// Inject ANDROID_HOME nếu chưa có (chỉ dùng cho local)
if (!process.env.ANDROID_HOME) {
    process.env.ANDROID_HOME = 'C:\\Users\\WINDOWS\\AppData\\Local\\Android\\Sdk';
}

const apkPath = path.resolve(process.cwd(), 'apps', 'ApiDemos-debug.apk');
const ipaPath = path.resolve(process.cwd(), 'apps', 'ApiDemos.ipa'); // Giả định có file ipa sau này

exports.config = {
    runner: 'local',
    port: 4723,
    path: '/',
    specs: ['./test/specs/**/*.e2e.js'],
    maxInstances: 2, // Chạy song song nếu có nhiều thiết bị
    
    // Cấu hình Timeout tối ưu
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 1,

    capabilities: [
        // 1. Android Emulator (Mặc định)
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
            'appium:app': apkPath,
            'appium:newCommandTimeout': 60,
            'appium:autoGrantPermissions': true
        }
        /* 
        // 2. Android Real Device (Bỏ comment khi dùng máy thật)
        ,{
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': 'Android Device', // Appium tự nhận diện nếu để generic
            'appium:app': apkPath,
            'appium:noReset': false
        }
        // 3. iOS Real Device
        ,{
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'appium:deviceName': 'iPhone',
            'appium:udid': process.env.IOS_UDID || 'auto',
            'appium:app': ipaPath,
            'appium:xcodeOrgId': 'YOUR_TEAM_ID', // Cần thiết cho máy thật
            'appium:xcodeSigningId': 'iPhone Developer'
        }
        */
    ],

    logLevel: 'info',
    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
        retries: 1 // Tự động chạy lại nếu test bị fail (flaky test)
    },

    // HOOKS
    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            // Chụp ảnh màn hình khi test fail
            const timestamp = new Date().getTime();
            const filepath = path.join(__dirname, './logs/screenshots', `fail_${test.title}_${timestamp}.png`);
            if (!fs.existsSync(path.dirname(filepath))) {
                fs.mkdirSync(path.dirname(filepath), { recursive: true });
            }
            await browser.saveScreenshot(filepath);
        }
    },

    before: function () {
        // Kiểm tra APK trước khi chạy
        if (this.capabilities[0].platformName === 'Android' && !fs.existsSync(apkPath)) {
            throw new Error(`APK không tồn tại tại: ${apkPath}`);
        }
    }
};
