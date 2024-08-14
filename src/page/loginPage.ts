import { Page, expect } from '@playwright/test'

export default class loginPage { 
    constructor(private page: Page) {}

    username = '#username'
    dlgUserName = '//*[@id="username"]/div[2]/div/div/div[2]'
    optUsernameCount = 'div'
    password = '#password'
    dlgPassword = '//*[@id="password"]/div[2]/div/div/div[2]'
    optPasswordCount = 'div'
    btnLogin = '#login-btn'
    
    userName = ''

    async setUsername(username: string) {
            this.userName = username;
    }

    // function get total number of acceptable usernames
    async checkVisibleUsernames() {
        await expect(this.page.locator(this.dlgUserName)).toBeVisible();
        let countUsernames = this.page.locator(this.dlgUserName).locator(this.optUsernameCount);
        const count = await countUsernames.count();
        return { count, countUsernames }
    }

    // function to choose a username
    async chooseUsername() {
        let count = (await this.checkVisibleUsernames()).count
        let Objlocator = (await this.checkVisibleUsernames()).countUsernames
        if (count > 0) {
            let firstUser = await Objlocator.nth(0).innerText();
            let firstUserLocator = Objlocator.nth(0)
            this.setUsername(firstUser)
            await firstUserLocator.click();
        }
    }

    // function check if password exists
    async checkVisiblePassword() {
        await expect(this.page.locator(this.dlgPassword)).toBeVisible();
        let countPassword = this.page.locator(this.dlgPassword).locator(this.optPasswordCount);
        const count = await countPassword.count();
        return { count, countPassword }
    }

    // function to click password
    async choosePassword() {
        let count = (await this.checkVisiblePassword()).count;
        let Objlocator = (await this.checkVisiblePassword()).countPassword;
        if (count > 0) {
            let password = Objlocator.nth(0)
            await password.click();
        }
    }
    // function to click username
    async clickUsername() {
        await this.page.click(this.username)
    }

    // function to click password
    async clickPassword() {
        await this.page.click(this.password)
    }

    // function to click login button
    async clickLogin() {
        await this.page.click(this.btnLogin)
    }

}