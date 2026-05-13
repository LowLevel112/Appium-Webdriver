class AppPage {
    /**
     * Định nghĩa các selector (Phần tử)
     */
    get appMenu() { return $('~App'); }
    get viewsMenu() { return $('~Views'); }
    get preferenceMenu() { return $('~Preference'); }
    get alertDialogs() { return $('~Alert Dialogs'); }
    get controlsMenu() { return $('~Controls'); }

    /**
     * Định nghĩa các hành động (Actions)
     */
    async openAppMenu() {
        await this.appMenu.waitForDisplayed({ timeout: 10000 });
        await this.appMenu.click();
    }

    async openViewsMenu() {
        await this.viewsMenu.waitForDisplayed({ timeout: 10000 });
        await this.viewsMenu.click();
    }
}

module.exports = new AppPage();
