describe('ApiDemos - Alert Dialog', () => {
  it('opens App > Alert Dialogs, taps OK and validates dialog message', async () => {
    // 1. Chờ và click vào menu "App"
    const appMenu = await $('//android.widget.TextView[@content-desc="App"]');
    await appMenu.waitForDisplayed({ timeout: 20000 });
    await appMenu.click();

    // 2. Chờ và click vào "Alert Dialogs"
    const alertDialogsMenu = await $('//android.widget.TextView[@content-desc="Alert Dialogs"]');
    await alertDialogsMenu.waitForDisplayed({ timeout: 20000 });
    await alertDialogsMenu.click();

    // 3. Click vào nút mở Alert Dialog (OK Cancel)
    const okCancelButton = await $('//android.widget.Button[@content-desc="OK Cancel dialog with a message"]');
    await okCancelButton.waitForDisplayed({ timeout: 20000 });
    await okCancelButton.click();

    // 4. Kiểm tra message hiển thị trên Dialog
    // Sử dụng XPath tìm theo nội dung text (vì text "Lorem ipsum" là duy nhất trên màn hình lúc này)
    const dialogMessage = await $('//*[contains(@text, "Lorem ipsum")]');
    
    // Đợi message xuất hiện
    await dialogMessage.waitForDisplayed({ timeout: 10000 });
    
    const text = await dialogMessage.getText();
    console.log('Nội dung thực tế trên màn hình:', text);
    
    // Kiểm tra nội dung
    await expect(dialogMessage).toHaveText(expect.stringContaining('Lorem ipsum'));

    // 5. Click nút OK (Tìm theo text "OK")
    const okButton = await $('//android.widget.Button[@text="OK"]');
    await okButton.click();

    // Xác nhận dialog đã biến mất
    await dialogMessage.waitForDisplayed({ reverse: true, timeout: 5000 });
  });
});
