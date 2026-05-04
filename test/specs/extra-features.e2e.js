describe('ApiDemos - Extra Features', () => {

    it('should test screen rotation', async () => {
        const appMenu = await $('//android.widget.TextView[@content-desc="App"]');
        await appMenu.click();

        await browser.setOrientation('LANDSCAPE');
        await browser.pause(2000);
        expect(await browser.getOrientation()).toBe('LANDSCAPE');

        await browser.setOrientation('PORTRAIT');
        await browser.pause(2000);
        expect(await browser.getOrientation()).toBe('PORTRAIT');
    });

    it('should test text input in Views Controls', async () => {
        await browser.back();

        const viewsMenu = await $('//android.widget.TextView[@content-desc="Views"]');
        await viewsMenu.waitForDisplayed();
        await viewsMenu.click();

        const controlsMenu = await $('//android.widget.TextView[@content-desc="Controls"]');
        await controlsMenu.click();

        const lightTheme = await $('//android.widget.TextView[@content-desc="1. Light Theme"]');
        await lightTheme.click();

        // Sửa Selector chuẩn
        const editField = await $('//android.widget.EditText[@resource-id="io.appium.android.apis:id/edit"]');
        await editField.waitForDisplayed({ timeout: 5000 });
        const testData = 'Appium Automation';
        await editField.setValue(testData);

        expect(await editField.getText()).toBe(testData);

        if (await browser.isKeyboardShown()) {
            await browser.hideKeyboard();
        }
    });
});