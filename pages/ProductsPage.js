// pom/ProductsPage.js - REWRITTEN FOR STABILITY
const { expect } = require('@playwright/test');

exports.ProductsPage = class ProductsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        
        // --- GENERAL LOCATORS ---
        this.allProductsText = page.locator('.features_items > .title');
        this.productList = page.locator('.features_items .single-products');
        
        // --- PRODUCT DETAILS PAGE LOCATORS ---
        // We scope these to the .product-information container for reliability
        const productInfo = page.locator('.product-information');
        this.productName = productInfo.locator('h2');
        this.productCategory = productInfo.locator('p', { hasText: 'Category:' });
        this.productPrice = productInfo.locator('span span');
        this.productAvailability = productInfo.locator('b', { hasText: 'Availability:' });
        this.productCondition = productInfo.locator('b', { hasText: 'Condition:' });
        this.productBrand = productInfo.locator('b', { hasText: 'Brand:' });
        this.quantityInput = page.locator('#quantity');
        
        // --- SEARCH LOCATORS ---
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.searchedProductsText = page.locator('.features_items > .title');
        
        // --- MODAL (POP-UP) LOCATORS ---
        // We use more descriptive locators instead of generic classes
        this.modalContent = page.locator('.modal-content');
        this.continueShoppingButton = this.modalContent.getByRole('button', { name: 'Continue Shopping' });
        this.viewCartLink = this.modalContent.getByRole('link', { name: 'View Cart' });

        // --- REVIEW LOCATORS ---
        this.reviewNameInput = page.locator('#name');
        this.reviewEmailInput = page.locator('#email');
        this.reviewTextInput = page.locator('#review');
        this.submitReviewButton = page.locator('#button-review');
        this.reviewSuccessMessage = page.locator('.alert-success span');

        // --- CATEGORY & BRAND LOCATORS ---
        this.categoryWomen = page.locator('a[href="#Women"]');
        this.categoryWomenDress = page.locator('a[href="/category_products/1"]');
        this.categoryProductsTitle = page.locator('.features_items .title');
        this.brandsSection = page.locator('.brands_products');
        this.brandPolo = page.locator('a[href="/brand_products/Polo"]');
    }

    // --- METHODS ---

    /**
     * Clicks the 'View Product' link for the first product in the list.
     */
    async clickFirstProductView() {
        // Using getByRole is more readable and user-facing than a complex CSS selector.
        await this.page.getByRole('link', { name: 'View Product' }).first().click();
    }

    /**
     * Adds a product from the main grid to the cart by its index (0 for first, 1 for second, etc.).
     * This method is now robust and handles the hover, the specific button, and waiting for the modal.
     */
    async addProductToCartByIndex(index) {
        const product = this.productList.nth(index);
        await product.hover();

        // This locator is now specific to the hover overlay and uses a force click to bypass ads.
        await product.locator('.product-overlay .add-to-cart').click();

        // This method is now responsible for waiting for the confirmation modal, fixing the race condition.
        await this.modalContent.waitFor();
    }

    /**
     * Clicks the 'Add to cart' button on the Product Details page.
     */
    async clickAddToCart() {
        // This locator is highly specific to the button on the details page.
        await this.page.locator('button.cart').click();
    }
    
    /**
     * Clicks the 'Continue Shopping' button in the 'Added!' modal.
     */
    async clickContinueShopping() {
        // We wait for the button to be ready before clicking.
        await this.continueShoppingButton.evaluate(element > element.click());
    }

    /**
     * Clicks the 'View Cart' link in the 'Added!' modal.
     */
    async clickViewCart() {
        await this.viewCartLink.evaluate(element => element.click());
    }
    
    async searchProduct(productName) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    async setQuantity(quantity) {
        await this.quantityInput.fill(quantity.toString());
    }

    async submitReview(name, email, review) {
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextInput.fill(review);
        await this.submitReviewButton.click();
    }

    async viewWomenDressProducts() {
        await this.categoryWomen.click();
        await this.categoryWomenDress.click();
    }

    async viewPoloBrandProducts() {
        await this.brandPolo.click();
    }
};
