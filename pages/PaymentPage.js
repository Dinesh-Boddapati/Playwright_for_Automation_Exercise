// pom/PaymentPage.js
const { expect } = require('@playwright/test');

exports.PaymentPage = class PaymentPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.nameOnCardInput = page.locator('input[data-qa="name-on-card"]');
        this.cardNumberInput = page.locator('input[data-qa="card-number"]');
        this.cvcInput = page.locator('input[data-qa="cvc"]');
        this.expiryMonthInput = page.locator('input[data-qa="expiry-month"]');
        this.expiryYearInput = page.locator('input[data-qa="expiry-year"]');
        this.payAndConfirmButton = page.locator('button[data-qa="pay-and-confirm-order"]');
        this.orderSuccessMessage = page.locator('.col-sm-9 > p');
        this.downloadInvoiceButton = page.locator('.col-sm-9 > a[href^="/download_invoice/"]');
    }

    async fillPaymentDetails(paymentData) {
        await this.nameOnCardInput.fill(paymentData.nameOnCard);
        await this.cardNumberInput.fill(paymentData.cardNumber);
        await this.cvcInput.fill(paymentData.cvc);
        await this.expiryMonthInput.fill(paymentData.expiryMonth);
        await this.expiryYearInput.fill(paymentData.expiryYear);
    }

    async clickPayAndConfirm() {
        await this.payAndConfirmButton.click();
    }
    
    async getOrderSuccessMessage() {
        return await this.orderSuccessMessage.textContent();
    }

    async downloadInvoice() {
        // This sets up a listener to wait for the download event to happen.
        const downloadPromise = this.page.waitForEvent('download');
        await this.downloadInvoiceButton.click();
        const download = await downloadPromise;
        
        // The test file will handle saving the download.
        return download;
    }
};