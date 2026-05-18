/**
 * BrowserStack WebdriverIO Configuration
 *
 * Dùng cho chạy Appium test trên BrowserStack App Automate.
 * Read env vars from .env using dotenv.
 */

require('dotenv').config();

const path = require('path');

exports.config = {
  runner: 'local',
  hostname: 'hub.browserstack.com',
  port: 443,
  path: '/wd/hub',

  specs: ['./test/specs/**/*.e2e.js'],
  maxInstances: 1,

  capabilities: [
    {
      platformName: process.env.BROWSERSTACK_PLATFORM_NAME || 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:app': process.env.BROWSERSTACK_APP_URL,
      'bstack:options': {
        userName: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        deviceName: process.env.BROWSERSTACK_DEVICE_NAME || 'Google Pixel 7',
        osVersion: process.env.BROWSERSTACK_PLATFORM_VERSION || '14.0',
        projectName: process.env.BROWSERSTACK_PROJECT || 'Appium WebdriverIO',
        buildName: process.env.BROWSERSTACK_BUILD || 'Appium Build',
        sessionName: process.env.BROWSERSTACK_SESSION || 'Android App Test',
        appiumVersion: '2.0.0',
        autoGrantPermissions: true,
        browserstackLocal: true,
      },
    },
  ],

  services: [['browserstack', { browserstackLocal: true }]],

  logLevel: 'info',
  waitforTimeout: 20000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },

  onPrepare: function () {
    const resultsPath = path.join(process.cwd(), 'allure-results');
    if (require('fs').existsSync(resultsPath)) {
      require('fs').rmSync(resultsPath, { recursive: true, force: true });
      console.log('[CLEANUP] Xóa old allure-results');
    }
  },

  afterTest: async function (test, context, { passed }) {
    if (!passed) {
      const timestamp = new Date().getTime();
      const screenshotPath = path.resolve(process.cwd(), 'logs', 'screenshots');
      if (!require('fs').existsSync(screenshotPath)) {
        require('fs').mkdirSync(screenshotPath, { recursive: true });
      }
      const safeTitle = test.title.replace(/[<>:"/\\|?*]/g, '_');
      await browser.saveScreenshot(path.join(screenshotPath, `fail_${safeTitle}_${timestamp}.png`));
    }
  },
};
