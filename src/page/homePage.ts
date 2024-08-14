import { Page, expect } from '@playwright/test'

export default class homePage { 
    constructor(private page: Page) {}

    lnkOrders = '#orders'
    lnkFavourites = '#favourites'
    lnkSignIn = '#signin'
    lnkCart = '//div[@class="float-cart"]/span'
    btnAddToCart = '/div[4]'
    btnFavorite = '//button'
    btnFaveClicked = '//button[contains(@class, "clicked")]'
    lblItemName = '/p[1]'
    lblItemPrice = '/div[3]/div[1]'
    lblUser = '//*[@id="__next"]/div/div/div[1]/div/div/div[2]/span'
    lblTitle = 'title'

    itemToAdd: string[] = []
    itemID: number[] = []
    itemIDFave: number[] = []
    itemNames: string[] = []
    itemPrices: string[] = []
    itemFave: string[] = []
    
    minItems = 1
    maxItems = 25

    // function to set locator for adding a product to cart
    async setProductID() {
        let val = (await this.getRandomProductID()).filter(function(num) { return num > 0});
        let lenVal = val.length
        for (let i = 0; i < lenVal; i++) {
            this.itemToAdd.push('//*[@id="' + val[i].toString() + '"]' + this.btnAddToCart)
        }
    }

    // function to set product name and price added to cart
    async setProductDetails(category: number) {
        let val: Number[] = []
        if (category == 1) {
            val = (await this.getRandomProductID()).filter(function(num) { return num > 0});
        }
        else if (category == 3) {
            val = (await this.getFavedProductID()).filter(function(num) { return num > 0});
        }
        let lenVal = val.length
        for (let i = 0; i < lenVal; i++) {
            let locatorItem = '//*[@id="' + val[i].toString() + '"]' 
            let locatorItemName = locatorItem + this.lblItemName
            let locatorItemPrice = locatorItem + this.lblItemPrice
            let valName = await this.page.locator(locatorItemName).innerText()
            let valPrice = (await this.page.locator(locatorItemPrice).innerText()).toString().split('$')
            // for saving cart details
            if (category == 1) {
                this.itemNames.push(valName)
                this.itemPrices.push(valPrice[1])
            }
            // for saving favourite details
            else if (category == 3 ) {
                let faveItem = await this.page.locator(locatorItem).innerText()
                this.itemFave.push(faveItem)
            }
        }
    }

    // function to generate random product ID
    async generateProductID() {
        let val = Math.floor(Math.random() * (this.maxItems - this.minItems + 1) + this.minItems)
        this.itemID.push(val)
    }
    
    // function to add items to cart
    async addItemToCart(phoneCount: number) {
        for (let i = 0; i < phoneCount; i++) {
            this.generateProductID();
        }
        this.setProductID();
        let items = (await this.getRandomProductID()).filter(function(str) { return str > 0});
        let count = items.length
        for (let i = 0; i < count; i++) {
            await this.page.click(this.itemToAdd[i])
        }
        this.setProductDetails(1);
    }

    // getter function for product ID
    async getRandomProductID() {
        return this.itemID;
    }
    
    // getter function for Faved product ID
    async getFavedProductID() {
        return this.itemIDFave;
    }

    // getter function to get cart details
    async getItemsInCart() {
        let itemNames = this.itemNames
        let itemPrices = this.itemPrices
        return { itemNames, itemPrices }
    }

    // getter function to get favourites details
    async getItemDetails() {
        let itemFaves = this.itemFave
        return itemFaves
    }

    // function to click favourite button
    async clickFave(ID: number) {
        let item = ID.toString()
        this.itemIDFave.push(ID)
        let locatorFave = '//*[@id="' + item + '"]' + this.btnFavorite
        await this.page.click(locatorFave)
        await this.page.waitForSelector('//*[@id="' + item + '"]' + this.btnFaveClicked)
        await this.setProductDetails(3)
    }

    // function to get page title
    async getTitle() {
        return await this.page.locator(this.lblTitle).innerText()
    }

    // function to verify user is logged in
    async checkUserIsLoggedIn() {
        await expect(this.page.locator(this.lblUser)).toBeVisible();
    }

    // function to click orders tab
    async clickOrders() {
        await this.page.click(this.lnkOrders)
    }

    // function to click favourites tab
    async clickFavourites() {
        await this.page.click(this.lnkFavourites)
    }

    // function to click sign in
    async clickSignIn() {
        await this.page.click(this.lnkSignIn)
    }

    // function to click cart tab assuming it is closes
    async clickCart() {
        await this.page.click(this.lnkCart)
    }

}

export class cartDrawer { 
    constructor(private page: Page) {}

    mainPage = new homePage(this.page);

    lnkCloseCart = '//div[contains(@class,"float-cart--open")]/div[1]'
    lnkCheckOut = '//div[@class="buy-btn"]'
    lblSubTotal = '//div[@class="sub-price"]/p'
    cartItems = '//div[@class="float-cart__shelf-container"]'
    countItems = '//div[@class="shelf-item"]'
    btnIncreaseQty = '//button[2]'

    // return item locators and count
    async getItemLocators () {
        await expect(this.page.locator(this.cartItems)).toBeVisible();
        let items = this.page.locator(this.cartItems).locator(this.countItems);
        const itemCount = await items.count();

        return { itemCount, items };
    }
    
    // get actual items in cart
    async getActualItems () {
        let actualName: string [] = []
        let actualPrice: string [] = []
        let actualQty: string [] = []

        let itemCount = Number((await this.getItemLocators()).itemCount);
        let items = (await this.getItemLocators()).items

        for (let i = 0; i < itemCount; i++) {
            let row = await items.nth(i).innerText();
            let splitRowDetails = row.toString().split('\n');
            actualName.push(splitRowDetails[0]);
            let splitValue = splitRowDetails[5].split('$')
            actualPrice.push(splitValue[1].trimStart());
            let splitQtyValue = splitRowDetails[3].split('Quantity:')
            actualQty.push(splitQtyValue[1].trimStart());
        }

        return { actualName, actualPrice, actualQty }
    }

    // get total price of items in cart
    async getTotalPrice() {
        let totalValue = await this.page.locator(this.lblSubTotal).innerText();
        let total = totalValue.toString().split('$')
        return Number(total[1].trimStart());
    }

    // increase item quantity in cart
    async increasQuantity(clicks: number) {
        let itemCount = Number((await this.getItemLocators()).itemCount);
        let items = (await this.getItemLocators()).items
        for (let i = 0; i < itemCount-1; i++) {
            for (let j = 1; j < clicks; j++) {
                await items.nth(i).locator(this.btnIncreaseQty).click();
            }
        }
    }

    // function to close cart tab
    async closeCart() {
        await this.page.click(this.lnkCloseCart)
    }

    // function to click checkout
    async clickCheckout() {
        await this.page.click(this.lnkCheckOut)
    }
}