describe('Realme 5 - Special Hardware Scenarios', () => {

    it('Step 0: Verify Physical Connection to Realme 5', async () => {
        console.log('=========================================');
        console.log('--- ĐANG KIỂM TRA KẾT NỐI VẬT LÝ ---');
        
        // Lấy thông tin phần cứng trực tiếp từ máy thật
        const manufacturer = await driver.executeScript('mobile: shell', { command: 'getprop ro.product.manufacturer' });
        const model = await driver.executeScript('mobile: shell', { command: 'getprop ro.product.model' });
        const battery = await driver.executeScript('mobile: shell', { command: 'dumpsys battery | grep level' });
        
        console.log(`Thiết bị: ${manufacturer.trim().toUpperCase()} ${model.trim()}`);
        console.log(`Trạng thái Pin: ${battery.trim()}`);
        console.log('Kết nối: [OK] - Sẵn sàng thực hiện test chuyên sâu.');
        console.log('=========================================');
        
        expect(manufacturer.trim().toLowerCase()).toBe('realme');
    });

    it('should handle permission popups and battery optimization', async () => {
        const execShell = async (command) => {
            try {
                return await driver.executeScript('mobile: shell', { command });
            } catch (err) {
                console.warn(`Lỗi mobile shell: ${command} -> ${err.message}`);
                return '';
            }
        };

        console.log('--- Đang bật chế độ tiết kiệm pin trên Realme 5 ---');
        await execShell('settings put global low_power_mode 1');
        await browser.pause(2000);

        const screenState = await execShell('dumpsys power | grep "mWakefulness="');
        if (screenState) {
            console.log(`Trạng thái màn hình hiện tại: ${screenState.trim()}`);
        }

        const cpuAbi = await execShell('getprop ro.product.cpu.abi');
        if (cpuAbi) {
            console.log(`Kiến trúc CPU của thiết bị: ${cpuAbi.trim()}`);
        }

        const initialBrightness = await execShell('settings get system screen_brightness');
        await execShell('settings put system screen_brightness 50');
        console.log('Đã giảm độ sáng màn hình xuống 50 để test tiết kiệm pin');

        const wifiStatus = await execShell('settings get global wifi_on');
        if (wifiStatus) {
            console.log(`Trạng thái Wi-Fi: ${wifiStatus.trim() === '1' ? 'Đang bật' : 'Đang tắt'}`);
        }

        const appMenu = await $('~App');
        await appMenu.waitForDisplayed({ timeout: 30000 });
        await appMenu.click();

        try {
            const allowBtn = await $('//android.widget.Button[contains(@text, "CHO PHÉP") or contains(@text, "ALLOW") or contains(@text, "Allow")]');
            if (await allowBtn.isDisplayed()) {
                await allowBtn.click();
                console.log('Đã xác nhận popup quyền Realme');
            }
        } catch (e) {
            console.log('Không phát hiện popup quyền, tiếp tục...');
        }

        await execShell('settings put global low_power_mode 0');
        if (initialBrightness && initialBrightness.trim() !== '') {
            await execShell(`settings put system screen_brightness ${initialBrightness.trim()}`);
        }
    });

    it('should verify app stability on screen rotation (Real hardware)', async () => {
        await browser.setOrientation('LANDSCAPE');
        await browser.pause(3000); 
        expect(await browser.getOrientation()).toBe('LANDSCAPE');

        await browser.setOrientation('PORTRAIT');
        await browser.pause(2000);
        console.log('--- Kiểm tra xoay màn hình: HOÀN TẤT ---');
    });
});
