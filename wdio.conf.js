const path = require('path');
const fs = require('fs');

if (!process.env.ANDROID_HOME) {
    process.env.ANDROID_HOME = 'C:\\Users\\WINDOWS\\AppData\\Local\\Android\\Sdk';
}

const apkPath = path.resolve(process.cwd(), 'apps', 'ApiDemos-debug.apk');

exports.config = {
    runner: 'local',
    port: 4723,
    path: '/',
    specs: ['./test/specs/**/*.e2e.js'],
    
    // ĐẢM BẢO CHỈ CHẠY 1 FILE TẠI 1 THỜI ĐIỂM
    maxInstances: 1, 

    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Emulator',
        'appium:app': apkPath,
        'appium:appPackage': 'io.appium.android.apis',
        'appium:appActivity': 'io.appium.android.apis.ApiDemos',
        'appium:newCommandTimeout': 300, // Tăng thời gian chờ lệnh lên 5 phút
        'appium:autoGrantPermissions': true,
        'appium:adbExecTimeout': 60000,   // Tăng timeout cho các lệnh ADB (tránh lỗi 'error: closed')
    }],

    logLevel: 'error',
    waitforTimeout: 20000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 2, // Tăng số lần thử lại nếu kết nối lỗi
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec', ['allure', { outputDir: 'allure-results' }]],
    mochaOpts: { ui: 'bdd', timeout: 120000, retries: 1 },

    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            const timestamp = new Date().getTime();
            const screenshotPath = path.resolve(process.cwd(), 'logs', 'screenshots');
            if (!fs.existsSync(screenshotPath)) {
                fs.mkdirSync(screenshotPath, { recursive: true });
            }
            const safeTitle = test.title.replace(/[<>:"/\\|?*]/g, '_');
            await browser.saveScreenshot(path.join(screenshotPath, `fail_${safeTitle}_${timestamp}.png`));
        }
        // Quay về Home sau mỗi test case để đảm bảo test tiếp theo bắt đầu từ màn hình chính
        await browser.terminateApp('io.appium.android.apis');
        await browser.activateApp('io.appium.android.apis');
    }
};
