// pom/ContactUsPage.js
const { expect } = require('@playwright/test');

exports.ContactUsPage = class ContactUsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.getInTouchText = page.locator('.contact-form > .title');
        this.nameInput = page.locator('input[data-qa="name"]');
        this.emailInput = page.locator('input[data-qa="email"]');
        this.subjectInput = page.locator('input[data-qa="subject"]');
        this.messageTextArea = page.locator('textarea[data-qa="message"]');
        this.uploadFileInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.locator('input[data-qa="submit-button"]');
        this.successMessage = page.locator('.status.alert.alert-success');
    }

    async getGetInTouchText() {
        return await this.getInTouchText.textContent();
    }

    async submitForm(name, email, subject, message, filePath) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageTextArea.fill(message);
    if (filePath) {
        await this.uploadFileInput.setInputFiles(filePath);
    }
    this.page.on('dialog', dialog => dialog.accept());

    await this.page.waitForURL('**/');
    await this.submitButton.click();
}

    async getSuccessMessage() {
        return await this.successMessage.textContent();
    }
};
