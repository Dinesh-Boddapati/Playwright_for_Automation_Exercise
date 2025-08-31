// pom/CheckoutPage.js
const { expect } = require('@playwright/test');

exports.CheckoutPage = class CheckoutPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.deliveryAddress = page.locator('#address_delivery');
        this.billingAddress = page.locator('#address_invoice');
        this.commentTextArea = page.locator('textarea[name="message"]');
        this.placeOrderButton = page.locator('a[href="/payment"]');
    }

    async getDeliveryAddress() {
        return await this.deliveryAddress.innerText();
    }
    
    async getBillingAddress() {
        return await this.billingAddress.innerText();
    }
    
    async enterComment(comment) {
        await this.commentTextArea.fill(comment);
    }
    
    async clickPlaceOrder() {
        await this.placeOrderButton.click();
    }
};
