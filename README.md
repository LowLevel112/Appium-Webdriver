# Android Mobile Automation (WebdriverIO + Appium)

Project mẫu để chạy automation test Android với **WebdriverIO + Appium**, dùng ứng dụng `ApiDemos`.

Hỗ trợ chạy test trên cả **Android Emulator** và **Real Device (Realme 5)**.

## 📁 Project Structure

```
Appium/
├── apps/
│   └── ApiDemos-debug.apk              # Ứng dụng Android cần test (AUT)
│
├── test/
│   ├── helpers/
│   │   ├── constants.js                # 🎯 Hằng số (timeout, selectors, app config)
│   │   └── testHelpers.js              # 🛠️ Utility functions (reduce code duplication)
│   │
│   └── specs/
│       ├── advanced-features.e2e.js    # Screen rotation + text input
│       ├── alert-dialog.e2e.js         # Dialog navigation & interaction
│       ├── extra-features.e2e.js       # Additional UI tests
│       └── realme-special.e2e.js       # Real device specific tests
│
├── scripts/
│   └── download-apk.mjs                # Script tải app mẫu tự động
│
├── logs/
│   └── screenshots/                    # 📸 Lưu screenshots khi test fail
│
├── allure-results/                     # Raw Allure report data
├── allure-report/                      # Generated HTML report
│
├── .github/workflows/
│   └── android-wdio.yml                # GitHub CI/CD config
│
├── wdio.conf.js                        # ⚙️ WebdriverIO config (Appium settings)
├── package.json                        # npm scripts & dependencies
├── .env.example                        # Environment variables template
└── README.md                           # This file
```

## 🔧 Yêu Cầu Môi Trường

### Bắt Buộc
- **Node.js 20+**
- **Android SDK** (Platform Tools, Emulator)
- **Java 11+** (khuyến nghị Java 17)

### Biến Environment
Phải có các biến sau trên system:
- `ANDROID_HOME` hoặc `ANDROID_SDK_ROOT` phải trỏ tới Android SDK thực tế
- `PATH` phải có `platform-tools` (chứa `adb`)

> Lưu ý: Không để giá trị placeholder như `C:\Users\YOUR_USER\AppData\Local\Android\Sdk` trong `.env`.

### Setup trên Windows

```powershell
# Set ANDROID_HOME (PowerShell)
setx ANDROID_HOME "C:\Users\<your-user>\AppData\Local\Android\Sdk"

# Verify (check adb works)
adb version
```

## 📦 Cài Đặt

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Download ApiDemos APK tự động
npm run apk:download

# 3. (Optional) Install Appium UI automator driver
appium driver install uiautomator2
```

## 🚀 Chạy Test

### Trên Emulator (Android Emulator)

```bash
# Khởi chạy emulator trước (hoặc để CI tự khởi chạy)
# Sau đó chạy test:

npm run test:android
```

**Output:**
- Console: Spec format test results
- `allure-results/`: Raw report data
- `logs/screenshots/`: Failed test screenshots

### Trên Real Device (Realme 5)

```bash
# 1. Kết nối thiết bị via USB
# 2. Enable USB Debugging trên device
# 3. Authorize USB connection on device

# 4. Verify device connected
adb devices

# 5. Run test on real device
npm run test:realme
```

**Note:** Nếu `adb devices` không thấy device:
- Kiểm tra USB cable
- Tắt/bật USB debugging
- Restart adb: `adb kill-server && adb start-server`

### Trên BrowserStack Cloud

1. Set `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` in `.env` with your real BrowserStack account credentials.
2. Upload your app to BrowserStack App Automate and set `BROWSERSTACK_APP_URL` to the returned `bs://...` URL.
3. Run:

```bash
npm run test:bs
```

> BrowserStack tests use `wdio.browserstack.conf.js` and the BrowserStack service.

If you get a `401 Unauthorized` or `Invalid username or password` error, confirm that:
- `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` are correct.
- `BROWSERSTACK_APP_URL` is the valid BrowserStack app upload URL.
- `.env` does not contain placeholder values like `YOUR_BROWSERSTACK_USERNAME`, `YOUR_BROWSERSTACK_ACCESS_KEY`, or `x`.

## 📊 View Test Reports

### Generate Allure Report

```bash
# Generate HTML report từ raw results
npm run allure:generate

# Open report in browser
npm run allure:open
```

## 📝 Test Case Overview

| Test File | Purpose | Coverage |
|-----------|---------|----------|
| `advanced-features.e2e.js` | Screen rotation + text input | Responsive UI |
| `alert-dialog.e2e.js` | Dialog navigation & interaction | App navigation |
| `extra-features.e2e.js` | Keyboard + text input | UI interactions |
| `realme-special.e2e.js` | Real device specific | Realme 5 compatibility |

## 🛠️ Key Components

### constants.js
Định nghĩa hằng số dùng chung:
- **Timeouts:** TIMEOUT_SHORT, TIMEOUT_MEDIUM, TIMEOUT_LONG, TIMEOUT_VERY_LONG
- **UI Selectors:** APP_MENU, VIEWS_MENU, ALERT_DIALOGS_MENU, etc.
- **App Config:** APP_PACKAGE, APP_ACTIVITY, REAL_DEVICE_UDID
- **Test Data:** TEXT_INPUT_ADVANCED, EXPECTED_LOREM_IPSUM, etc.

### testHelpers.js
Utility functions để reduce code duplication:
- `restartApp()` - Restart ứng dụng
- `waitAndClick()` - Wait for element + click
- `enterText()` - Enter text vào input field
- `changeOrientation()` - Set screen orientation
- `executeShellCommand()` - Run shell command on device
- `log()` - Log message with timestamp

## ⚙️ Configuration

### wdio.conf.js
Main WebdriverIO configuration:
- **Emulator Capability** - Cấu hình cho Android Emulator
- **Real Device Capability** - Cấu hình cho Realme 5
- **Hooks** - `onPrepare()`, `afterTest()`
- **Reporters** - Spec + Allure

### .env.example
Environment variables:
- `ANDROID_HOME` - Path to Android SDK
- `UDID` - Real device serial number
- `RUN_ON_REAL_DEVICE` - Switch emulator ↔ real device

## 💡 Best Practices

### 1. Use Constants Instead of Hardcode
```javascript
// ❌ Bad
await element.waitForDisplayed({ timeout: 10000 });

// ✅ Good
const { TIMEOUT_MEDIUM } = require('../helpers/constants');
await element.waitForDisplayed({ timeout: TIMEOUT_MEDIUM });
```

### 2. Use Helper Functions
```javascript
// ❌ Bad - repetitive
const appMenu = await $('//...');
await appMenu.waitForDisplayed({timeout: 10000});
await appMenu.click();

// ✅ Good
const { waitAndClick } = require('../helpers/testHelpers');
await waitAndClick(SELECTORS.APP_MENU, TIMEOUT_MEDIUM);
```

### 3. Restart App Between Tests
```javascript
// Prevents state pollution between test cases
beforeEach(async () => {
  await restartApp();
});
```

### 4. Use Descriptive Comments
Every test file has:
- File description
- Test case purpose
- Step-by-step comments
- Timeout explanations

## 🔍 Troubleshooting

### Device Not Found
```bash
# Check connected devices
adb devices

# If no device, try:
adb kill-server
adb start-server

# Check driver
appium driver list
```

### Test Timeout
- Increase `waitforTimeout` in wdio.conf.js
- Real device may be slower - use TIMEOUT_LONG or TIMEOUT_VERY_LONG
- Check app performance on device

### APK Installation Fails
- Clear app: `adb shell pm clear io.appium.android.apis`
- Reinstall: `npm run apk:download`
- Check storage space on device

### Keyboard Issues
```javascript
// Always dismiss keyboard after text input
await dismissKeyboard();
```

## 📚 GitHub Actions

Automated test execution on push/PR:
- See `.github/workflows/android-wdio.yml`
- Runs on GitHub-hosted runners
- Reports artifacts: allure-results, screenshots

## 🎓 Learning Resources

- [WebdriverIO Docs](https://webdriverio.io/)
- [Appium Docs](https://appium.io/)
- [WebdriverIO-Appium Guide](https://webdriverio.io/docs/appium/)

## 📄 License

MIT
