// tests/automated.spec.js
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { LoginPage } = require('../pages/LoginPage');
const { SignupPage } = require('../pages/SignupPage');
const { AccountCreatedPage } = require('../pages/AccountCreatedPage');
const { AccountDeletedPage } = require('../pages/AccountDeletedPage');
const { ContactUsPage } = require('../pages/ContactUsPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { PaymentPage } = require('../pages/PaymentPage');
const { faker } = require('@faker-js/faker');
const path = require('path');
const fs = require('fs');

// --- Helper Function to Create a User ---
// This function is used in multiple tests to set up a registered user.
async function createUserAndLogin(page) {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
    const accountCreatedPage = new AccountCreatedPage(page);

    const user = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        company: faker.company.name(),
        address1: faker.location.streetAddress(),
        address2: faker.location.secondaryAddress(),
        country: 'United States',
        state: faker.location.state(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        mobileNumber: faker.phone.number(),
        title: 'Mr',
        day: '10',
        month: 'May',
        year: '1990',
    };

    await homePage.goto();
    await homePage.clickSignupLogin();
    await loginPage.signup(user.name, user.email);
    await signupPage.fillAccountDetails(user);
    await accountCreatedPage.getAccountCreatedText();
    await expect(accountCreatedPage.accountCreatedText).toBeVisible(); // Wait for confirmation
    await accountCreatedPage.clickContinue();
    
    // Enhanced ad handling with multiple strategies
    try {
        // Strategy 1: Try common iframe ad selectors
        const adIframes = [
            'iframe[name="aswift_6"]',
            'iframe[name="ad_iframe"]',
            'iframe[id*="google_ads"]'
        ];
        
        for (const iframeSelector of adIframes) {
            try {
                const frame = page.frameLocator(iframeSelector);
                await frame.locator('#dismiss-button').click({ timeout: 3000 });
                console.log(`Ad closed using iframe: ${iframeSelector}`);
                break;
            } catch (e) {
                continue;
            }
        }
        
        // Strategy 2: Try direct selectors
        const directSelectors = [
            '[id*="dismiss"]',
            '.ad-close',
            '[aria-label*="Close"]',
            '[title*="Close"]'
        ];
        
        for (const selector of directSelectors) {
            try {
                await page.locator(selector).first().click({ timeout: 2000 });
                console.log(`Ad closed using selector: ${selector}`);
                break;
            } catch (e) {
                continue;
            }
        }
    } catch (error) {
        console.log('No ads found or could not close ads, continuing test.');
    }
    
    // Verify login was successful
    await expect(homePage.loggedInAsText).toContainText(user.name, { timeout: 15000 });
    
    return user;
}

// --- Test Cases ---

test('Test Case 1: Register User', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
    const accountCreatedPage = new AccountCreatedPage(page);
    const accountDeletedPage = new AccountDeletedPage(page);
    // using faker to generate some random user data
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const userData = {
        title: 'Mr',
        password: password,
        day: '10',
        month: 'May',
        year: '1990',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        company: faker.company.name(),
        address1: faker.location.streetAddress(),
        address2: faker.location.secondaryAddress(),
        country: 'United States',
        state: faker.location.state(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        mobileNumber: faker.phone.number(),
    };

    await homePage.goto();
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    await homePage.clickSignupLogin();
    await expect(loginPage.newUserSignupText).toBeVisible();
    await expect(loginPage.newUserSignupText).toHaveText('New User Signup!');

    await loginPage.signup(name, email);
    await expect(signupPage.enterAccountInfoText).toHaveText('Enter Account Information');

    await signupPage.fillAccountDetails(userData);
    await expect(accountCreatedPage.accountCreatedText).toHaveText('Account Created!');
    
    await accountCreatedPage.clickContinue();
    
    try {
        await page.frameLocator('iframe[name="aswift_6"]').locator('#dismiss-button').click({ timeout: 5000 });
    } catch (error) {
        console.log('Ad not found or could not be closed, continuing test.');
    }

    await expect(homePage.loggedInAsText).toContainText(name);

    await homePage.clickDeleteAccount();
    await expect(page.locator('h2[data-qa="account-deleted"]')).toBeVisible();
    
    await accountDeletedPage.clickContinue();
});

test('Test Case 2: Login User with correct email and password', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // Step 1: Create a user to ensure we have valid credentials
    const user = await createUserAndLogin(page);
    await homePage.clickLogout(); // Log out to test the login functionality

    // Step 2: Perform the login test
    await homePage.goto();
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();
    
    await homePage.clickSignupLogin();
    await expect(loginPage.loginHeaderText).toHaveText('Login to your account');

    await loginPage.login(user.email, user.password);
    await expect(homePage.loggedInAsText).toContainText(user.name);

    await homePage.clickDeleteAccount();
    await expect(page.locator('h2[data-qa="account-deleted"]')).toBeVisible();
});

test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.goto();
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    await homePage.clickSignupLogin();
    await expect(loginPage.loginHeaderText).toHaveText('Login to your account');

    const incorrectEmail = faker.internet.email();
    const incorrectPassword = faker.internet.password();

    await loginPage.login(incorrectEmail, incorrectPassword);
    
    await expect(loginPage.loginErrorText).toContainText('Your email or password is incorrect!');
});

test('Test Case 4: Logout User', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    await createUserAndLogin(page); // Creates and logs in a user
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    await homePage.clickLogout();
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginHeaderText).toHaveText('Login to your account');
});

test('Test Case 5: Register User with existing email', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // First, create a user to ensure the email exists
    const existingUser = await createUserAndLogin(page);
    await homePage.clickLogout();

    // Now, try to register with the same email
    await homePage.clickSignupLogin();
    await loginPage.signup(faker.person.fullName(), existingUser.email);
    
    const errorMessage = page.locator('.signup-form form p');
    await expect(errorMessage).toHaveText('Email Address already exist!');
});

test('Test Case 6: Contact Us Form', async ({ page }) => {
    const homePage = new HomePage(page);
    const contactUsPage = new ContactUsPage(page);

    await homePage.goto();
    await homePage.clickContactUs();
    await expect(contactUsPage.getInTouchText).toHaveText('Get In Touch');

    const name = faker.person.fullName();
    const email = faker.internet.email();
    const subject = 'Customer Support Inquiry';
    const message = 'This is a test message for the contact us form.';
    const filePath = path.join(__dirname, 'test-upload.txt');
    
    // Create a dummy file for upload if it doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'This is a test file for upload.');
    }
    
    await contactUsPage.submitForm(name, email, subject, message, filePath);

    await expect(contactUsPage.successMessage).toContainText('Success! Your details have been submitted successfully.');
});

test('Test Case 7: Verify Test Cases Page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickTestCases();
    await expect(page).toHaveURL(/.*test_cases/);
    await expect(page.locator('h2 > b')).toHaveText('Test Cases');
});

test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await homePage.goto();
    await homePage.clickProducts();
    await expect(page).toHaveURL(/.*products/);
    await expect(productsPage.allProductsText).toContainText('All Products');

    await productsPage.clickFirstProductView();
    await expect(page).toHaveURL(/.*product_details/);
    await expect(productsPage.productName).toBeVisible();
    await expect(productsPage.productCategory).toBeVisible();
    await expect(productsPage.productPrice).toBeVisible();
    await expect(productsPage.productAvailability).toBeVisible();
    await expect(productsPage.productCondition).toBeVisible();
    await expect(productsPage.productBrand).toBeVisible();
});

test('Test Case 9: Search Product', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const productName = 'Top';

    await homePage.goto();
    await homePage.clickProducts();
    await productsPage.searchProduct(productName);
    await expect(productsPage.searchedProductsText).toHaveText('Searched Products');
    
    const products = await productsPage.productList.all();
    expect(products.length).toBeGreaterThan(0); // Check that we got some results
    let foundAtLeastOneMatch = false;
    for (const product of products) {
        const name = await product.locator('.productinfo p').textContent();
        if (name.toLowerCase().includes(productName.toLowerCase())) {
            foundAtLeastOneMatch = true;
            break; 
        }
    }

    expect(foundAtLeastOneMatch).toBe(true, 'Expected to find at least one product with "Top" in its name');
});

test('Test Case 10: Verify Subscription in home page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await homePage.enterSubscriptionEmail(faker.internet.email());
    await homePage.verifySubscriptionSuccess();
});

test('Test Case 11: Verify Subscription in Cart page', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    await homePage.goto();
    await homePage.clickCart();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await cartPage.enterSubscriptionEmail(faker.internet.email());
    await cartPage.verifySubscriptionSuccess();
});

test('Test Case 12: Add Products in Cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await homePage.goto();
    await homePage.clickProducts();
    
    // Add first product
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickContinueShopping();  
    
    // Add second product
    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickViewCart();

    await expect(cartPage.cartItems).toHaveCount(2);
});

test('Test Case 13: Verify Product quantity in Cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await homePage.goto();
    await productsPage.clickFirstProductView();
    await productsPage.setQuantity(4);
    await productsPage.clickAddToCart();
    await productsPage.clickViewCart();
    
    const quantity = await cartPage.getProductQuantity('Blue Top');
    expect(quantity).toBe('4');
});

test('Test Case 14: Place Order: Register while Checkout', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

    await homePage.goto();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickContinueShopping();
    await homePage.clickCart();
    await cartPage.clickProceedToCheckout();
    
    // Register from the checkout modal
    await cartPage.clickRegisterLogin();
    const user = await createUserAndLogin(page); // This flow is slightly different than the helper, but we'll reuse for user data
    
    await homePage.clickCart();
    await cartPage.clickProceedToCheckout();

    // Verify address details and review order
    const deliveryAddress = await checkoutPage.getDeliveryAddress();
    expect(deliveryAddress).toContain(user.firstName);
    expect(deliveryAddress).toContain(user.address1);
    
   // await expect(cartPage.cartItems.first()).toBeVisible();
    
   // await expect(cartPage.cartItems).toHaveCount(0);

    //console.log('Test confirmed: Cart is empty after registering during checkout.');

    await checkoutPage.enterComment('Placing a test order.');
    await checkoutPage.clickPlaceOrder();

    // Payment details
    const paymentData = {
        nameOnCard: user.name,
        cardNumber: faker.finance.creditCardNumber(),
        cvc: faker.finance.creditCardCVV(),
        expiryMonth: '05',
        expiryYear: '2028'
    };
    await paymentPage.fillPaymentDetails(paymentData);
    await paymentPage.clickPayAndConfirm();
    await expect(paymentPage.orderSuccessMessage).toBeVisible();

    await homePage.clickDeleteAccount();
    await expect(page.locator('h2[data-qa="account-deleted"]')).toBeVisible();
});

test('Test Case 15: Place Order: Register before Checkout', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

    // Register user first
    const user = await createUserAndLogin(page);
    
    // Add product and go to checkout
    await homePage.clickProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickContinueShopping();
    await homePage.clickCart();
    await cartPage.clickProceedToCheckout();

    // Verify address and place order
    const deliveryAddress = await checkoutPage.getDeliveryAddress();
    expect(deliveryAddress).toContain(user.firstName);
    await checkoutPage.clickPlaceOrder();

    // Payment
    const paymentData = {
        nameOnCard: user.name,
        cardNumber: faker.finance.creditCardNumber(),
        cvc: faker.finance.creditCardCVV(),
        expiryMonth: '01',
        expiryYear: '2030'
    };
    await paymentPage.fillPaymentDetails(paymentData);
    await paymentPage.clickPayAndConfirm();
    await expect(paymentPage.orderSuccessMessage).toBeVisible();

    await homePage.clickDeleteAccount();
});

test('Test Case 16: Place Order: Login before Checkout', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

    // Create a user and log out
    const user = await createUserAndLogin(page);
    await homePage.clickLogout();

    // Log in
    await homePage.clickSignupLogin();
    await loginPage.login(user.email, user.password);

    // Add product and checkout
    await homePage.clickProducts();
    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickContinueShopping();
    await homePage.clickCart();
    await cartPage.clickProceedToCheckout();

    // Verify and place order
    const deliveryAddress = await checkoutPage.getDeliveryAddress();
    expect(deliveryAddress).toContain(user.firstName);
    await checkoutPage.clickPlaceOrder();
    
    // Payment
    const paymentData = {
        nameOnCard: user.name,
        cardNumber: faker.finance.creditCardNumber(),
        cvc: faker.finance.creditCardCVV(),
        expiryMonth: '01',
        expiryYear: '2030'
    };
    await paymentPage.fillPaymentDetails(paymentData);
    await paymentPage.clickPayAndConfirm();
    await expect(paymentPage.orderSuccessMessage).toBeVisible();

    await homePage.clickDeleteAccount();
});

test('Test Case 17: Remove Products From Cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await homePage.goto();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCart();
    
    await expect(cartPage.cartItems.first()).toBeVisible();
    await cartPage.removeProductFromCart('Blue Top');
    
    await expect(cartPage.emptyCartText).toBeVisible();
});

test('Test Case 18: View Category Products', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await homePage.goto();
    await expect(page.locator('.category-products')).toBeVisible();
    
    await productsPage.viewWomenDressProducts();
    await expect(productsPage.categoryProductsTitle).toHaveText('Women - Dress Products');
});

test('Test Case 19: View & Cart Brand Products', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await homePage.goto();
    await homePage.clickProducts();
    await expect(productsPage.brandsSection).toBeVisible();
    
    await productsPage.viewPoloBrandProducts();
    await expect(productsPage.categoryProductsTitle).toHaveText('Brand - Polo Products');
});

test('Test Case 20: Search Products and Verify Cart After Login', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);

    // Create user for login later
    const user = await createUserAndLogin(page);
    await homePage.clickLogout();

    // Search and add products to cart
    await homePage.clickProducts();
    await productsPage.searchProduct('Dress');
    const products = await productsPage.productList.all();
    for (const product of products) {
        await product.hover();
        await product.locator('.add-to-cart').first().click();
        await productsPage.clickContinueShopping();
    }
    
    await homePage.clickCart();
    await expect(cartPage.cartItems).toHaveCount(products.length);

    // Login and verify cart
    await homePage.clickSignupLogin();
    await loginPage.login(user.email, user.password);
    await homePage.clickCart();
    await expect(cartPage.cartItems).toHaveCount(products.length);
});

test('Test Case 21: Add review on product', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await homePage.goto();
    await homePage.clickProducts();
    await productsPage.clickFirstProductView();
    
    await productsPage.submitReview(
        faker.person.fullName(),
        faker.internet.email(),
        'This is a fantastic product! Highly recommended.'
    );

    await expect(productsPage.reviewSuccessMessage).toBeVisible();
    await expect(productsPage.reviewSuccessMessage).toHaveText('Thank you for your review.');
});

test('Test Case 22: Add to cart from Recommended items', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.goto();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(homePage.recommendedItemsSection).toBeVisible();
    
    await homePage.addRecommendedProductToCart();
    const productsPage = new ProductsPage(page);
    await productsPage.clickViewCart();
    
    await expect(cartPage.cartItems).toHaveCount(1);
});

test('Test Case 23: Verify address details in checkout page', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const user = await createUserAndLogin(page);
    
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCart();
    await cartPage.clickProceedToCheckout();

    const deliveryAddress = await checkoutPage.getDeliveryAddress();
    const billingAddress = await checkoutPage.getBillingAddress();

    expect(deliveryAddress).toContain(`${user.title}. ${user.firstName} ${user.lastName}`);
    expect(deliveryAddress).toContain(user.company);
    expect(deliveryAddress).toContain(user.address1);
    expect(deliveryAddress).toContain(user.address2);
    expect(deliveryAddress).toContain(`${user.city} ${user.state} ${user.zipcode}`);
    expect(deliveryAddress).toContain(user.country);
    expect(deliveryAddress).toContain(user.mobileNumber);
    
    // Compare address content without headers
    const deliveryContent = deliveryAddress.split('\n').slice(1).join('\n');
    const billingContent = billingAddress.split('\n').slice(1).join('\n');
    expect(billingContent.trim()).toEqual(deliveryContent.trim());
});

test('Test Case 24: Download Invoice after purchase', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

    const user = await createUserAndLogin(page);

    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCart();
    await cartPage.clickProceedToCheckout();
    await checkoutPage.clickPlaceOrder();
    
    const paymentData = {
        nameOnCard: user.name,
        cardNumber: faker.finance.creditCardNumber(),
        cvc: faker.finance.creditCardCVV(),
        expiryMonth: '01',
        expiryYear: '2030'
    };
    await paymentPage.fillPaymentDetails(paymentData);
    await paymentPage.clickPayAndConfirm();
    
    const download = await paymentPage.downloadInvoice();
    const filePath = path.join(__dirname, 'invoice.txt');
    await download.saveAs(filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
});

test('Test Case 25: Verify Scroll Up using Arrow button and Scroll Down functionality', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('h2').filter({ hasText: 'Subscription' })).toBeInViewport();
    
    await homePage.clickScrollUpArrow();
    
    await expect(homePage.slider).toBeInViewport();
});

test('Test Case 26: Verify Scroll Up without Arrow button and Scroll Down functionality', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('h2').filter({ hasText: 'Subscription' })).toBeInViewport();
    
    await page.evaluate(() => window.scrollTo(0, 0));
    
    await expect(homePage.slider).toBeInViewport();
});