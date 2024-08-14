import { Page, expect } from '@playwright/test'

export default class favouritesPage { 
    constructor(private page: Page) {}

    faveContainer = '//div[@class="shelf-container"]'
    faveItems = '//div[@class="shelf-item"]'
    faveCount = 0

    faveItemText: string[] =[]

    // check if there are any favourite items
    async checkFaveItems() {
        await expect (this.page.locator(this.faveContainer)).toBeVisible();
        let faves = this.page.locator(this.faveContainer).locator(this.faveItems);
        this.faveCount = await faves.count();
        expect(this.faveCount).toBeGreaterThan(0);
    }

    // set fave item details
    async setFaveItem(ID: number) {
        for (let i = 0; i < this.faveCount; i++ ) {
            let faves = (await this.page.locator('//*[@id="' + ID.toString() + '"]').innerText()).toString();
            this.faveItemText.push(faves);
        }
    }

    // get fave item details
    async getFaveItemDetails() {
        return this.faveItemText;
    }

}