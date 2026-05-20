/**
 * BrowserStack WebdriverIO Configuration
 *
 * Dùng cho chạy Appium test trên BrowserStack App Automate.
 * Read env vars from .env using dotenv.
 */

require('dotenv').config();

const path = require('path');

const browserstackUsername = process.env.BROWSERSTACK_USERNAME;
const browserstackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY;
const browserstackAppUrl = process.env.BROWSERSTACK_APP_URL;
const browserstackLocalEnabled = process.env.BROWSERSTACK_LOCAL === 'true';

if (!browserstackUsername || !browserstackAccessKey) {
  throw new Error('BrowserStack credentials are required. Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY in .env');
}

if (!browserstackAppUrl) {
  throw new Error('BrowserStack app URL is required. Set BROWSERSTACK_APP_URL in .env (bs://<app-id>)');
}

exports.config = {
  runner: 'local',
  protocol: 'https',
  hostname: 'hub.browserstack.com',
  port: 443,
  path: '/wd/hub',

  specs: ['./test/specs/**/*.e2e.js'],
  maxInstances: 1,

  capabilities: [
    {
      platformName: process.env.BROWSERSTACK_PLATFORM_NAME || 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:app': browserstackAppUrl,
      'bstack:options': {
        userName: browserstackUsername,
        accessKey: browserstackAccessKey,
        deviceName: process.env.BROWSERSTACK_DEVICE_NAME || 'Google Pixel 7',
        osVersion: process.env.BROWSERSTACK_PLATFORM_VERSION || '14.0',
        projectName: process.env.BROWSERSTACK_PROJECT || 'Appium WebdriverIO',
        buildName: process.env.BROWSERSTACK_BUILD || 'Appium Build',
        sessionName: process.env.BROWSERSTACK_SESSION || 'Android App Test',
        appiumVersion: '2.0.0',
        autoGrantPermissions: true,
        local: browserstackLocalEnabled,
      },
    },
  ],

  services: [['browserstack', { browserstackLocal: browserstackLocalEnabled }]],

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
