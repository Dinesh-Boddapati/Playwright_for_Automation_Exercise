// pom/CartPage.js
const { expect } = require('@playwright/test');

exports.CartPage = class CartPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('#cart_info_table tbody tr');
        this.proceedToCheckoutButton = page.locator('.col-sm-6 .btn');
        this.emptyCartText = page.locator('#empty_cart');
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
        this.subscriptionSuccessText = page.locator('#success-subscribe');
        this.registerLoginLink = page.locator('p > a[href="/login"]');
        this.addressDetails = page.locator('#address_delivery');
        this.reviewOrder = page.locator('#cart_info');
    }

    async getCartItemCount() {
        return await this.cartItems.count();
    }

    async getProductPrice(productName) {
        return await this.cartItems.filter({ hasText: productName }).locator('.cart_price p').textContent();
    }

    async getProductQuantity(productName) {
        return await this.cartItems.filter({ hasText: productName }).locator('.cart_quantity button').textContent();
    }

    async getProductTotalPrice(productName) {
        return await this.cartItems.filter({ hasText: productName }).locator('.cart_total_price').textContent();
    }

    async clickProceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }
    
    async removeProductFromCart(productName) {
        await this.cartItems.filter({ hasText: productName }).locator('.cart_delete a').click();
    }
    
    async isCartEmpty() {
        return await this.emptyCartText.isVisible();
    }
    
    async enterSubscriptionEmail(email) {
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionButton.click();
    }

    async verifySubscriptionSuccess() {
        await expect(this.subscriptionSuccessText).toBeVisible();
        await expect(this.subscriptionSuccessText).toHaveText('You have been successfully subscribed!');
    }

    async clickRegisterLogin() {
        await this.registerLoginLink.click();
    }
};
