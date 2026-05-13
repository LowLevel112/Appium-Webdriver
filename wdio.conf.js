require('dotenv').config();
const path = require('path');
const fs = require('fs');

if (!process.env.ANDROID_HOME) {
    process.env.ANDROID_HOME = 'C:\\Users\\WINDOWS\\AppData\\Local\\Android\\Sdk';
}

const apkPath = path.resolve(process.cwd(), 'apps', 'ApiDemos-debug.apk');

// Sử dụng UDID thực tế từ máy Realme 5 của bạn
const REAL_DEVICE_UDID = '673bb926'; 

const emulatorCapability = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:app': apkPath,
    'appium:autoGrantPermissions': true,
    'appium:ignoreHiddenApiPolicyError': true,
};

const realmeCapability = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Realme 5',
    'appium:platformVersion': '10.0', 
    'appium:udid': REAL_DEVICE_UDID, // Đã điền mã 673bb926
    'appium:app': apkPath,
    'appium:appPackage': 'io.appium.android.apis',
    'appium:appActivity': 'io.appium.android.apis.ApiDemos',
    'appium:noReset': true,
    'appium:newCommandTimeout': 300,
    'appium:autoGrantPermissions': true,
    'appium:adbExecTimeout': 120000,
    'appium:ignoreHiddenApiPolicyError': true,
    'appium:settings[ignoreUnimportantViews]': true,
};

exports.config = {
    runner: 'local',
    port: 4723,
    path: '/',
    specs: ['./test/specs/**/*.e2e.js'],
    maxInstances: 1, // Luôn để 1 khi chạy trên 1 máy thật

    capabilities: [process.env.RUN_ON_REAL_DEVICE === 'true' ? realmeCapability : emulatorCapability],

    logLevel: 'error',
    waitforTimeout: 20000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 1,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec', ['allure', { 
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
    }]],
    mochaOpts: { ui: 'bdd', timeout: 120000 },

    onPrepare: function () {
        const resultsPath = path.join(process.cwd(), 'allure-results');
        if (fs.existsSync(resultsPath)) {
            fs.rmSync(resultsPath, { recursive: true, force: true });
        }
    },

    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            const timestamp = new Date().getTime();
            const screenshotPath = path.resolve(process.cwd(), 'logs', 'screenshots');
            if (!fs.existsSync(screenshotPath)) fs.mkdirSync(screenshotPath, { recursive: true });
            const safeTitle = test.title.replace(/[<>:"/\\|?*]/g, '_');
            await browser.saveScreenshot(path.join(screenshotPath, `fail_${safeTitle}_${timestamp}.png`));
        }
    }
};
