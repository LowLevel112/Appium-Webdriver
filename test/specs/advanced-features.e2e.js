describe('ApiDemos - Advanced Features', () => {
  
  it('should test screen rotation', async () => {
    // Vào màn hình App
    const appMenu = await $('//android.widget.TextView[@content-desc="App"]');
    await appMenu.click();

    // Xoay sang Landscape
    await browser.setOrientation('LANDSCAPE');
    await browser.pause(2000);
    expect(await browser.getOrientation()).toBe('LANDSCAPE');

    // Xoay lại Portrait
    await browser.setOrientation('PORTRAIT');
    await browser.pause(2000);
    expect(await browser.getOrientation()).toBe('PORTRAIT');
  });

  it('should test text input in Views > Controls', async () => {
    // Quay lại màn hình chính (Back)
    await browser.back();

    // Tìm và vào Views
    const viewsMenu = await $('//android.widget.TextView[@content-desc="Views"]');
    await viewsMenu.click();

    // Cuộn xuống tìm Controls (giả định Controls hiển thị)
    const controlsMenu = await $('//android.widget.TextView[@content-desc="Controls"]');
    await controlsMenu.click();

    const lightTheme = await $('//android.widget.TextView[@content-desc="1. Light Theme"]');
    await lightTheme.click();

    // Nhập text vào Text Field
    const textField = await $('resource-id/io.appium.android.apis:id/edit');
    await textField.setValue('Hoc Appium cung AI');
    
    expect(await textField.getText()).toBe('Hoc Appium cung AI');

    // Ẩn bàn phím sau khi nhập
    if (await browser.isKeyboardShown()) {
        await browser.hideKeyboard();
    }
  });
});
