# Android Mobile Automation (WebdriverIO + Appium)

Project mẫu để chạy automation test Android với WebdriverIO + Appium, dùng ứng dụng `ApiDemos`.
Appium/
├── apps/
│   └── ApiDemos-debug.apk       # Ứng dụng Android cần test (AUT)
├── test/
│   └── specs/
│       └── alert-dialog.e2e.js  # File chứa kịch bản test (Test Case)
├── scripts/
│   └── download-apk.mjs         # Script hỗ trợ tải app mẫu tự động
├── .github/workflows/
│   └── android-wdio.yml         # Cấu hình chạy test tự động trên GitHub CI
├── wdio.conf.js                 # File cấu hình chính (Appium, Emulator, Timeout...)
├── package.json                 # Quản lý thư viện và các câu lệnh npm run
└── README.md                    # Hướng dẫn sử dụng dự án


## Yêu cầu môi trường

- Node.js 20+
- Android SDK + emulator (AVD đã tạo sẵn)
- Java 11+ (khuyến nghị Java 17)

Biến môi trường Android SDK phải có:

- `ANDROID_HOME` hoặc `ANDROID_SDK_ROOT`
- `PATH` có `platform-tools` (để dùng `adb`)

Ví dụ trên Windows (PowerShell):

```powershell
setx ANDROID_HOME "C:\Users\<your-user>\AppData\Local\Android\Sdk"
setx ANDROID_SDK_ROOT "C:\Users\<your-user>\AppData\Local\Android\Sdk"
```

## Cài đặt

```bash
npm install
npm run apk:download
```

> Nếu bạn dùng APK riêng, đặt file vào `apps/ApiDemos-debug.apk` hoặc sửa capability `appium:app` trong `wdio.conf.js`.

## Chạy test Android

Khởi chạy emulator trước (hoặc để CI tự khởi chạy), sau đó chạy:

```bash
npm run test:android
```

## Test case đã có

- Mở app
- Click `App`
- Click `Alert Dialogs`
- Mở `OK Cancel dialog with a message`
- Click `OK`
- Assert dialog message hiển thị rồi đóng thành công

## Allure report

```bash
npm run allure:generate
npm run allure:open
```

## GitHub Actions

Workflow: `.github/workflows/android-wdio.yml`

- Cài dependencies
- Download ApiDemos APK
- Cài `uiautomator2` driver
- Tạo/chạy Android emulator
- Chạy `npm run test:android`
- Upload `allure-results` và `allure-report` artifacts
