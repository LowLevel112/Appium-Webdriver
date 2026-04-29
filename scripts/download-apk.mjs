import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const apkUrl =
  process.env.APK_URL ||
  'https://github.com/appium/android-apidemos/releases/latest/download/ApiDemos-debug.apk';
const appsDir = path.resolve(process.cwd(), 'apps');
const apkPath = path.join(appsDir, 'ApiDemos-debug.apk');

if (!fs.existsSync(appsDir)) {
  fs.mkdirSync(appsDir, { recursive: true });
}

if (fs.existsSync(apkPath)) {
  console.log(`APK already exists: ${apkPath}`);
  process.exit(0);
}

console.log(`Downloading APK from ${apkUrl}`);
downloadWithRedirects(apkUrl);

function downloadWithRedirects(url, redirects = 0) {
  const maxRedirects = 5;

  https
    .get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        if (redirects >= maxRedirects) {
          console.error('Too many redirects while downloading APK');
          process.exit(1);
        }
        downloadWithRedirects(response.headers.location, redirects + 1);
        return;
      }
      saveResponse(response);
    })
    .on('error', (error) => {
      console.error(`Download failed: ${error.message}`);
      process.exit(1);
    });
}

function saveResponse(response) {
  if (response.statusCode !== 200) {
    console.error(`Failed to download APK. Status code: ${response.statusCode}`);
    process.exit(1);
  }

  const file = fs.createWriteStream(apkPath);
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`APK saved to ${apkPath}`);
  });
  file.on('error', (error) => {
    console.error(`Failed to write APK: ${error.message}`);
    process.exit(1);
  });
}
