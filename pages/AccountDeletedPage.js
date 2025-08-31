// pom/AccountDeletedPage.js
const { expect } = require('@playwright/test');

exports.AccountDeletedPage = class AccountDeletedPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.accountDeletedText = page.locator('h2[data-qa="account-deleted"]');
        this.continueButton = page.locator('a[data-qa="continue-button"]');
    }

    async getAccountDeletedText() {
        return await this.accountDeletedText.textContent();
    }
    
    async clickContinue() {
        await this.continueButton.click();
    }
};
