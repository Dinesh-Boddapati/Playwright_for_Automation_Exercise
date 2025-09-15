// pages/ProductsPage.js - FIXED VERSION
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
        
        // Add the missing searchedProductList property
        this.searchedProductList = page.locator('.features_items .single-products');
        
        // --- PRODUCT DETAILS PAGE LOCATORS ---
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
        this.modalTitle = page.locator('#cartModal .modal-title');
        this.modalContent = page.locator('#cartModal .modal-content');
        this.continueShoppingButton = page.locator('#cartModal').getByText('Continue Shopping');
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
        await this.page.getByRole('link', { name: 'View Product' }).first().click();
    }

    /**
     * Adds a product from the main grid to the cart by its index (0 for first, 1 for second, etc.).
     * This method handles the hover, the specific button, and waiting for the modal.
     */
    async addProductToCartByIndex(index) {
        const product = this.productList.nth(index);
        await product.hover();

        // Wait for the overlay to appear and be visible
        await product.locator('a.add-to-cart').first().click();
        
        
        // Wait for the modal to appear
        await expect(this.modalTitle).toBeVisible();
        await expect(this.modalTitle).toHaveText('Added!');
    }


    /**
     * Clicks the 'Add to cart' button on the Product Details page.
     */
    async clickAddToCart() {
        await this.page.locator('button.cart').click();
        // Wait for modal to appear after adding to cart
        //await this.continueShoppingButton.waitFor({ state: 'visible', timeout: 10000 });
    }
    
    /**
     * Clicks the 'Continue Shopping' button in the 'Added!' modal.
     * FIXED: Removed the incorrect evaluate syntax
     */
    async clickContinueShopping() {
       
        await this.continueShoppingButton.click();
        // Wait for modal to close
        //await this.modalContent.waitFor({ state: 'hidden', timeout: 5000 });
    }

    /**
     * Clicks the 'View Cart' link in the 'Added!' modal.
     * FIXED: Removed the incorrect evaluate syntax
     */
    async clickViewCart() {
        await this.viewCartLink.click();
    }
    
    async searchProduct(productName) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
        // Wait for search results to load
        await this.searchedProductsText.waitFor({ state: 'visible'});
    }

    async setQuantity(quantity) {
        await this.quantityInput.clear();
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
        await this.page.waitForLoadState('networkidle');
    }

    async viewPoloBrandProducts() {
        await this.brandPolo.click();
        await this.page.waitForLoadState('networkidle');
    }
};