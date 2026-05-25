/**
 * BrowserStack WebdriverIO Configuration
 *
 * Dùng cho chạy Appium test trên BrowserStack App Automate.
 * Read env vars from .env using dotenv.
 */

require('dotenv').config();

const path = require('path');

const placeholderValues = [
  'YOUR_BROWSERSTACK_USERNAME',
  'YOUR_BROWSERSTACK_ACCESS_KEY',
  'YOUR_BROWSERSTACK_APP_URL',
  'bs://<app-id>',
  '<app-id>',
  'x',
  'xxxx',
];

function validateBrowserStackEnvVar(name, value) {
  const trimmed = value ? value.trim() : '';
  if (!trimmed) {
    throw new Error(`${name} is required. Set ${name} in .env with your BrowserStack credentials.`);
  }

  const normalized = trimmed.toUpperCase();
  const isPlaceholder = placeholderValues.some((placeholder) => normalized.includes(placeholder.toUpperCase()));
  if (isPlaceholder) {
    throw new Error(`${name} appears to be a placeholder value. Replace it with your actual BrowserStack value in .env.`);
  }

  return trimmed;
}

const browserstackUsername = validateBrowserStackEnvVar('BROWSERSTACK_USERNAME', process.env.BROWSERSTACK_USERNAME);
const browserstackAccessKey = validateBrowserStackEnvVar('BROWSERSTACK_ACCESS_KEY', process.env.BROWSERSTACK_ACCESS_KEY);
const browserstackAppUrl = validateBrowserStackEnvVar('BROWSERSTACK_APP_URL', process.env.BROWSERSTACK_APP_URL);
const browserstackLocalEnabled = (process.env.BROWSERSTACK_LOCAL || 'false').toLowerCase() === 'true';

if (!browserstackAppUrl.startsWith('bs://')) {
  throw new Error('BROWSERSTACK_APP_URL must start with bs:// and point to your uploaded BrowserStack app URL.');
}

exports.config = {
  runner: 'local',
  protocol: 'https',
  hostname: 'hub.browserstack.com',
  port: 443,
  path: '/wd/hub',

  specs: ['./test/specs/**/*.e2e.js'],
  maxInstances: 2,

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
  connectionRetryTimeout: 180000,
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
