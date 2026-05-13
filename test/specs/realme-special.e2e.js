describe('Realme 5 - Special Hardware Scenarios', () => {

    it('should handle permission popups and battery optimization', async () => {
        // 1. Kiểm tra trạng thái pin (Mô phỏng qua ADB)
        console.log('--- Kiểm tra chế độ tiết kiệm pin ---');
        await driver.executeScript('mobile: shell', {
            command: 'settings put global low_power_mode 1'
        });
        await browser.pause(2000);

        // 2. Vào màn hình yêu cầu quyền (Giả định trong App > Service)
        await $('~App').click();
        await $('~Service').click();
        
        // 3. Xử lý popup quyền đặc thù của Realme UI
        // Chúng ta dùng khối try-catch để bấm "Cho phép" nếu popup hiện ra
        try {
            const allowBtn = await $('//android.widget.Button[@text="CHO PHÉP" or @text="ALLOW"]');
            if (await allowBtn.isDisplayed()) {
                await allowBtn.click();
                console.log('Đã xử lý popup quyền thành công');
            }
        } catch (e) {
            console.log('Không thấy popup quyền, tiếp tục test...');
        }

        // Đưa máy về chế độ pin bình thường
        await driver.executeScript('mobile: shell', {
            command: 'settings put global low_power_mode 0'
        });
    });

    it('should verify app stability on screen rotation (Real hardware)', async () => {
        await browser.setOrientation('LANDSCAPE');
        await browser.pause(3000); // Máy thật cần thời gian để render lại UI
        
        const currentOrientation = await browser.getOrientation();
        expect(currentOrientation).toBe('LANDSCAPE');

        await browser.setOrientation('PORTRAIT');
        await browser.pause(2000);
    });
});
