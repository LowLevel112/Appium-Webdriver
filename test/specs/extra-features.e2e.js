describe('ApiDemos - Extra Features', () => {

    // Đảm bảo mỗi test case bắt đầu từ màn hình chính
    beforeEach(async () => {
        await driver.terminateApp('io.appium.android.apis');
        await driver.activateApp('io.appium.android.apis');
    });

    it('should test screen rotation', async () => {
        const appMenu = await $('//android.widget.TextView[@content-desc="App"]');
        await appMenu.waitForDisplayed({ timeout: 10000 });
        await appMenu.click();

        await browser.setOrientation('LANDSCAPE');
        await browser.pause(2000);
        expect(await browser.getOrientation()).toBe('LANDSCAPE');

        await browser.setOrientation('PORTRAIT');
        await browser.pause(2000);
        expect(await browser.getOrientation()).toBe('PORTRAIT');
    });

    it('should test text input in Views Controls', async () => {
        const viewsMenu = await $('//android.widget.TextView[@content-desc="Views"]');
        await viewsMenu.waitForDisplayed({ timeout: 10000 });
        await viewsMenu.click();

        const controlsMenu = await $('//android.widget.TextView[@content-desc="Controls"]');
        await controlsMenu.waitForDisplayed({ timeout: 10000 });
        await controlsMenu.click();

        const lightTheme = await $('//android.widget.TextView[@content-desc="1. Light Theme"]');
        await lightTheme.waitForDisplayed({ timeout: 10000 });
        await lightTheme.click();

        // Sử dụng XPath chuẩn và chờ element sẵn sàng
        const editField = await $('//android.widget.EditText[@resource-id="io.appium.android.apis:id/edit"]');
        await editField.waitForDisplayed({ timeout: 10000 });
        
        const testData = 'Appium Automation';
        await editField.setValue(testData);

        expect(await editField.getText()).toBe(testData);

        if (await browser.isKeyboardShown()) {
            await browser.hideKeyboard();
        }
    });
});
