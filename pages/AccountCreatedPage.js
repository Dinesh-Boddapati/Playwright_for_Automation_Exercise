// pom/AccountCreatedPage.js
const { expect } = require('@playwright/test');

exports.AccountCreatedPage = class AccountCreatedPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.accountCreatedText = page.locator('h2[data-qa="account-created"]');
        this.continueButton = page.locator('a[data-qa="continue-button"]');
    }

    async getAccountCreatedText() {
        return await this.accountCreatedText.textContent();
    }

    async clickContinue() {
        await this.continueButton.click();
    }
};
