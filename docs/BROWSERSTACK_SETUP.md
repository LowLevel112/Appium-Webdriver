# BrowserStack Setup Guide

## 📋 Yêu Cầu
- Đã cài đặt Node.js 20+
- Đã chạy `npm install`

## 🚀 Bước 1: Tạo Tài Khoản BrowserStack

1. Truy cập: https://www.browserstack.com/app-automate
2. Nhấn **Sign up** hoặc **Sign in** nếu đã có tài khoản
3. Chọn gói **App Automate** (Free tier: 100 phút/tháng)

## 🔑 Bước 2: Lấy BrowserStack Credentials

1. Đăng nhập vào https://app-automate.browserstack.com/
2. Nhấn **Account** (góc trên phải)
3. Copy:
   - **Username** → lưu vào `BROWSERSTACK_USERNAME`
   - **Access Key** → lưu vào `BROWSERSTACK_ACCESS_KEY`

**Ví dụ:**
```
BROWSERSTACK_USERNAME=john_doe
BROWSERSTACK_ACCESS_KEY=abcde12345fghij67890klmno
```

## 📱 Bước 3: Upload APK lên BrowserStack

1. Truy cập: https://app-automate.browserstack.com/dashboard
2. Nhấn **Upload app**
3. Chọn file: `apps/ApiDemos-debug.apk` từ project
4. Chờ upload hoàn tất (~10-30 giây)
5. Sao chép **App URL** (dạng `bs://33b13372639cdc524aca7cc1c7df394962f5c40c`)

## 🔐 Bước 4: Điền Credentials vào `.env`

1. Mở file `.env` tại thư mục project root
2. Điền:
   ```
   BROWSERSTACK_USERNAME=<your-username-from-step-2>
   BROWSERSTACK_ACCESS_KEY=<your-access-key-from-step-2>
   BROWSERSTACK_APP_URL=bs://<app-id-from-step-3>
   ```

3. Lưu file

**⚠️ Lưu ý:**
- Không có dấu ngoặc kép: ❌ `"bs://xxxxx"` → ✅ `bs://xxxxx`
- Không có khoảng trắng thừa: ❌ `bs://xxxxx ` → ✅ `bs://xxxxx`
- File `.env` đã trong `.gitignore`, không commit credentials

## ✅ Bước 5: Kiểm Tra Setup

Chạy lệnh:
```bash
npm run test:bs
```

**Kết quả kỳ vọng:**
- ✅ Nếu thành công: Test chạy trên BrowserStack, kết quả hiển thị
- ❌ Nếu lỗi `401 Unauthorized`: Kiểm tra lại username/access key
- ❌ Nếu lỗi `Invalid app URL`: Kiểm tra app URL bắt đầu bằng `bs://`
- ❌ Nếu lỗi placeholder: Xóa giá trị placeholder khỏi `.env`

## 🎥 Bước 6: Xem Kết Quả Test

1. Truy cập: https://app-automate.browserstack.com/dashboard
2. Xem **Sessions** để kiểm tra test vừa chạy
3. Nhấn vào session để xem:
   - Device logs
   - Video recording
   - Screenshots
   - Test results

## 💰 Giám Sát Gói Free

- **Free tier:** 100 phút/tháng
- **Mỗi test chạy:** ~43 giây
- **Số lần test/tháng:** ~138 lần

Nếu hết phút, cần upgrade plan hoặc reset tháng sau.

## ❓ Vấn Đề Thường Gặp

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-----------|----------|
| `401 Unauthorized` | Credentials sai | Kiểm tra lại username/access key |
| `Invalid app URL` | App URL không hợp lệ | Kiểm tra URL bắt đầu `bs://` |
| `App not found` | Chưa upload APK | Upload APK lên BrowserStack |
| `Session quota exceeded` | Hết free tier phút | Upgrade plan BrowserStack |
| `Network timeout` | Kết nối chậm | Tăng timeout hoặc thử lại |

---

**Nếu cần hỗ trợ:** Xem BrowserStack docs tại https://www.browserstack.com/docs/app-automate/appium
