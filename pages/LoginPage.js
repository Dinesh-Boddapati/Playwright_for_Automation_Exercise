// pom/LoginPage.js
const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        // Signup Form
        this.signupNameInput = page.locator('input[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');
        this.newUserSignupText = page.locator('.signup-form > h2');
        
        // Login Form
        this.loginEmailInput = page.locator('input[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');
        this.loginErrorText = page.locator('.login-form form p');
        this.loginHeaderText = page.locator('.login-form > h2');
    }

    async signup(name, email) {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupButton.click();
    }

    async login(email, password) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }
    
    async getNewUserSignupText() {
        return await this.newUserSignupText.textContent();
    }

    async getLoginErrorText() {
        return await this.loginErrorText.textContent();
    }

    async getLoginHeaderText() {
        return await this.loginHeaderText.textContent();
    }
};
