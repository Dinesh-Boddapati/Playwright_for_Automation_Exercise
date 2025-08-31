// pom/SignupPage.js
const { expect } = require('@playwright/test');

exports.SignupPage = class SignupPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.enterAccountInfoText = page.locator('.login-form > h2 > b');
        this.titleMrRadio = page.locator('#id_gender1');
        this.titleMrsRadio = page.locator('#id_gender2');
        this.passwordInput = page.locator('#password');
        this.daysDropdown = page.locator('#days');
        this.monthsDropdown = page.locator('#months');
        this.yearsDropdown = page.locator('#years');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.specialOffersCheckbox = page.locator('#optin');
        this.firstNameInput = page.locator('#first_name');
        this.lastNameInput = page.locator('#last_name');
        this.companyInput = page.locator('#company');
        this.address1Input = page.locator('#address1');
        this.address2Input = page.locator('#address2');
        this.countryDropdown = page.locator('#country');
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.zipcodeInput = page.locator('#zipcode');
        this.mobileNumberInput = page.locator('#mobile_number');
        this.createAccountButton = page.locator('button[data-qa="create-account"]');
    }

    async getEnterAccountInfoText() {
        return await this.enterAccountInfoText.textContent();
    }

    async fillAccountDetails(userData) {
        if (userData.title === 'Mr') {
            await this.titleMrRadio.check();
        } else {
            await this.titleMrsRadio.check();
        }
        await this.passwordInput.fill(userData.password);
        await this.daysDropdown.selectOption(userData.day);
        await this.monthsDropdown.selectOption(userData.month);
        await this.yearsDropdown.selectOption(userData.year);
        await this.newsletterCheckbox.check();
        await this.specialOffersCheckbox.check();
        await this.firstNameInput.fill(userData.firstName);
        await this.lastNameInput.fill(userData.lastName);
        await this.companyInput.fill(userData.company);
        await this.address1Input.fill(userData.address1);
        await this.address2Input.fill(userData.address2);
        await this.countryDropdown.selectOption(userData.country);
        await this.stateInput.fill(userData.state);
        await this.cityInput.fill(userData.city);
        await this.zipcodeInput.fill(userData.zipcode);
        await this.mobileNumberInput.fill(userData.mobileNumber);
        await this.createAccountButton.click();
    }
};
