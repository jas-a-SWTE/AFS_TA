import { test, expect, type Page } from '@playwright/test';
import homePage, { cartDrawer } from "../src/page/homePage"
import checkoutPage from "../src/page/checkOutPage"
import favouritesPage from "../src/page/favouritesPage"
import loginPage from "../src/page/loginPage"
import ordersPage from "../src/page/ordersPage"

test.beforeEach(async ({ page }) => {
  await page.goto('https://bstackdemo.com/');
});

const phoneQty = 2
const IndivPhoneQty = 3
const phoneID = 22
let expectedTotal = 0


test.describe('Assessment', () => {

    test('Non-Signed-In User - Add Phone to Cart and Checkout', async ({ page }) => {
        const home = new homePage(page)
        const cart = new cartDrawer(page)

        // verify page title
        await home.getTitle()
        // add items to cart
        await home.addItemToCart(phoneQty)
        // checkout item
        await cart.clickCheckout()
        // login
        const login = new loginPage(page)
        await login.clickUsername()
        await login.chooseUsername()
        // choose a password
        await login.clickPassword()
        await login.choosePassword()
        // click login button
        await login.clickLogin()
        // complete checkout
        const checkout = new checkoutPage(page)
        await checkout.fillFirstName('Scarlett')
        await checkout.fillLastName('Johansson')
        await checkout.fillAddress('52 Black Widow St., Avengers Village, Marvel City, USA')
        await checkout.fillProvince('New York')
        await checkout.fillPostal('10001')
        await checkout.clickSubmit()
        // confirm checkout success
        await checkout.expectConfirmationMessage()
    });

    test('Signed-In User - Add Phone to Cart and Checkout with Different Quantities', async ({ page }) => {
        
        const home = new homePage(page)
        const cart = new cartDrawer(page)
        let currentTotal = 0

        // verify page title
        await home.getTitle()
        // go to sign in page
        await home.clickSignIn()
        // login
        const login = new loginPage(page)
        await login.clickUsername()
        await login.chooseUsername()
        // choose a password
        await login.clickPassword()
        await login.choosePassword()
        // click login button
        await login.clickLogin()
        // add items to cart
        await home.addItemToCart(phoneQty)
        await cart.increasQuantity(IndivPhoneQty)    
        // get total
        let cartTotal = await cart.getTotalPrice()
        let prices = (await cart.getActualItems()).actualPrice
        let qty = (await cart.getActualItems()).actualQty
        let count = qty.length
        for (let i = 0; i < count; i++){
            let subtotal = Number(qty[i]) * Number(prices[i])
            currentTotal = subtotal + currentTotal
        }
        expectedTotal = currentTotal
        if (expectedTotal != cartTotal)
            throw Error('Total price is incorrect.')
    });

    test('Verify Order History for Signed-In User', async ({ page }) => {
        const home = new homePage(page)
        const cart = new cartDrawer(page)

        // verify page title
        await home.getTitle()
        // go to sign in page
        await home.clickSignIn()
        // login
        const login = new loginPage(page)
        await login.clickUsername()
        await login.chooseUsername()
        // choose a password
        await login.clickPassword()
        await login.choosePassword()
        // click login button
        await login.clickLogin()
        // add items to cart
        await home.addItemToCart(phoneQty)
        // checkout item
        await cart.clickCheckout()
        // initialize
        const checkout = new checkoutPage(page)
        // get order summary
        let cartTotal = await checkout.getTotal()
        let phones = (await checkout.getOrderSummary()).itemName
        let orderedDate = await checkout.getOrderDate()
        let count = phones.length
        // complete checkout
        await checkout.fillFirstName('Elizabeth')
        await checkout.fillLastName('Olsen')
        await checkout.fillAddress('22 Wanda Vision St., Avengers Village, Marvel City, USA')
        await checkout.fillProvince('Los Angeles')
        await checkout.fillPostal('10003')
        await checkout.clickSubmit()
        // confirm checkout success
        await checkout.expectConfirmationMessage()
        // go back to home page
        await checkout.clickContinue()
        // go to orders page
        await home.clickOrders()
        // verify order history
        const ordered = new ordersPage(page)
        let pastOrderTotal = Number((await ordered.getOrderedItems(orderedDate)).totalOrderPrice)
        let pastOrder = (await ordered.getOrderedItems(orderedDate)).pastOrder
        for (let i = 0; i < count; i++){
            for (let j = 0; j < pastOrder.length; j++) {
                if (('Title: ' + phones[i]) == pastOrder[j]) {
                    break
                }
                if (j == pastOrder.length - 1) {
                    throw Error('Order history is incorrect.')
                }
            }
        }
        if (cartTotal != pastOrderTotal) {
            throw Error('Order history is incorrect.')
        }
    });

    test('Add Phone to Favorites and View Favorites List', async ({ page }) => {
        const home = new homePage(page)

        // verify page title
        await home.getTitle()
        // go to sign in page
        await home.clickSignIn()
        // login
        const login = new loginPage(page)
        await login.clickUsername()
        await login.chooseUsername()
        // choose a password
        await login.clickPassword()
        await login.choosePassword()
        // click login button
        await login.clickLogin()
        // add items to Faves
        await home.clickFave(phoneID)
        // get newly faved item details
        let favedItem = await home.getItemDetails()
        // go to favorites page
        await home.clickFavourites()
        // verify favorites list
        const faves = new favouritesPage(page)
        await faves.checkFaveItems()
        await faves.setFaveItem(phoneID)
        let savedFaveItem = await faves.getFaveItemDetails()
        if (savedFaveItem.length != 1)
            throw Error('Favorites count is incorrect.')
        for (let i = 0; i < savedFaveItem.length; i++) {
            if (favedItem[0] != savedFaveItem[0])
                throw Error('Favorites list is incorrect.')
        }
    });
});