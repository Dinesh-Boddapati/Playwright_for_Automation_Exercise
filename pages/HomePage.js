// pom/HomePage.js
const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.signupLoginButton = page.getByRole('link', { name: ' Signup / Login' });
        this.logoutButton = page.locator('a[href="/logout"]');
        this.deleteAccountButton = page.locator('a[href="/delete_account"]');
        this.loggedInAsText = page.locator('a', { hasText: 'Logged in as' });
        this.productsButton = page.locator('a[href="/products"]');
        this.cartButton = page.locator('a[href="/view_cart"]').first();
        this.contactUsButton = page.locator('a[href="/contact_us"]');
        this.testCasesButton = page.locator('//*[@href="/test_cases"]').first();
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
        this.subscriptionSuccessText = page.locator('#success-subscribe');
        this.recommendedItemsSection = page.locator('.recommended_items');
        this.recommendedAddToCartButton = this.recommendedItemsSection.locator('.add-to-cart').first();
        this.scrollUpArrow = page.locator('#scrollUp');
        this.slider = page.locator('#slider');
    }

    async goto() {
        await this.page.goto('/');
        await expect(this.page).toHaveTitle('Automation Exercise');
    }

    async clickSignupLogin() {
        await this.signupLoginButton.click();
    }


    async clickProducts() {
        await this.productsButton.click();
    }
    
    async clickCart() {
        await this.cartButton.click();
    }

    async clickContactUs() {
        await this.contactUsButton.click();
    }

    async clickTestCases() {
        await this.testCasesButton.click();
    }

    async clickLogout() {
        await this.logoutButton.click();
    }
    
    async clickDeleteAccount() {
        await this.deleteAccountButton.click();
    }

    async getLoggedInAsText() {
        return await this.loggedInAsText.textContent();
    }

    async enterSubscriptionEmail(email) {
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionButton.click();
    }

    async verifySubscriptionSuccess() {
        await expect(this.subscriptionSuccessText).toBeVisible();
        await expect(this.subscriptionSuccessText).toHaveText('You have been successfully subscribed!');
    }

    async addRecommendedProductToCart() {
        await this.recommendedItemsSection.scrollIntoViewIfNeeded();
        await this.recommendedAddToCartButton.click();
    }
    
    async clickScrollUpArrow() {
        await this.scrollUpArrow.click();
    }
    
    async isSliderVisible() {
        return await this.slider.isVisible();
    }
};
