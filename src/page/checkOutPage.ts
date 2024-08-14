import { Page, expect } from '@playwright/test'

export default class checkOutPage { 
    constructor(private page: Page) {}

    inpFirstName = '#firstNameInput'
    inpLastName = '#lastNameInput'
    inpAddress = '#addressLine1Input'
    inpProvince = '#provinceInput'
    inpPostalCode = '#postCodeInput'
    btnSubmit = '#checkout-shipping-continue'
    btnContShopping = '//div[@id="checkout-app"]//button'
    lblTotal = '//div[@class="cart-total"]/div/span[2]'
    lblConfirm = '#confirmation-message'
    lstSummary = '//ul[@class="productList"]'
    lstLocator = '//li[@class="productList-item is-visible"]'
    
    // get order summary
    async getOrderSummary () {
        let itemName: string [] = []
        let itemPrice: string [] = []

        await expect(this.page.locator(this.lstSummary)).toBeVisible();
        let items = this.page.locator(this.lstSummary).locator(this.lstLocator);
        const itemCount = await items.count();

        for (let i = 0; i < itemCount; i++) {
            let row = await items.nth(i).innerText();
            let splitRowDetails = row.toString().split('\n');
            itemName.push(splitRowDetails[0]);
            let splitValue = splitRowDetails[3].split('$')
            itemPrice.push(splitValue[1]);
        }

        return { itemName, itemPrice }
    }

    // get total
    async getTotal() {
        let totalValue = await this.page.locator(this.lblTotal).innerText();
        let total = totalValue.toString().split('$')
        return Number(total[1].trimStart());
    }

    // get date of order placement
    async getOrderDate() {
        let orderDate = new Date;
        let returnDate = orderDate.setHours(0,0,0,0)
        return returnDate
    }
    
    // expect confrimation message
    async expectConfirmationMessage() {
        await expect(this.page.locator(this.lblConfirm)).toBeVisible()
    }

    // input first name
    async fillFirstName(input: string) {
        await this.page.fill(this.inpFirstName, input)
    }

    // input last name
    async fillLastName(input: string) {
        await this.page.fill(this.inpLastName, input)
    }

    // input address
    async fillAddress(input: string) {
        await this.page.fill(this.inpAddress, input)
    }

    // input province
    async fillProvince(input: string) {
        await this.page.fill(this.inpProvince, input)
    }

    // input postal code
    async fillPostal(input: string) {
        await this.page.fill(this.inpPostalCode, input)
    }

    // function to click submit
    async clickSubmit() {
        await this.page.click(this.btnSubmit)
    }

    // function to click continue shopping
    async clickContinue() {
        await this.page.click(this.btnContShopping)
    }

}