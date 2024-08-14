import { Page, expect } from '@playwright/test'

export default class ordersPage { 
    constructor(private page: Page) {}

   containerOrders = '//*[@id="__next"]/main/div/div'
   orderedItems = '//div[@class="a-box-group a-spacing-base order"]'
   total = ''
   wholeOrder: string[] = []

   // get ordered items & details
   async getOrderedItems(date: number) {
        await expect(this.page.locator(this.containerOrders)).toBeVisible();
        let orders = this.page.locator(this.containerOrders).locator(this.orderedItems);
        const countOrders = await orders.count();

        for (let j = 0; j < countOrders; j++) {
            let cell = await orders.nth(j).innerText();
            this.wholeOrder = cell.toString().split('\n')
            let orderDate = Number(await this.getDate(this.wholeOrder[1]))
            if (orderDate == date) {
                let totalVal = this.wholeOrder[3].split('$')
                this.total = (totalVal[1])
            }
        }
        
        let pastOrder = this.wholeOrder
        let totalOrderPrice = this.total
        return { pastOrder, totalOrderPrice }
   }

   // check and convert date
   async getDate(dateVal: string) {
        let date = Date.parse(dateVal);
        return date
   }
}