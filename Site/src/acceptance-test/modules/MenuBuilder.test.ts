// MenuBuilder.test.ts
// Copyright © 2021 Joel MUssman. All rights reserved.
//
// Verify that the correct menu is built and functions correctly. Currently if the user is not logged
// into the application the Login menu appears at the end of the items on the left. Otherwise a user
// menu appears on the right.
//

import { BoundingBox, Browser, CDPSession, ElementHandle, launch, Page, Viewport } from 'puppeteer';

import { baseurl } from '../common/definitions';

describe('index.html', () => {

    let browser: Browser;
    let page: Page;
    let pageUrl: string = baseurl;

    beforeAll(async () => {

        browser = await launch();
        page = await browser.newPage();
    });

    afterAll(async () => {

        await browser.close();
    });

    beforeEach(async () => {

        const client: CDPSession = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');

        await page.goto(pageUrl);
    });

    test('The menu contains the first four options in order', async () => {

        let homeLeft: number = await (await (await page.$('a[href="index.html"]'))?.boundingBox())?.x ?? 0;
        let widgetsLeft: number = await (await (await page.$('a[href="widgets.html"]'))?.boundingBox())?.x ?? 0;
        let visionLeft: number = await (await (await page.$('a[href="vision.html"]'))?.boundingBox())?.x ?? 0;
        let licenseLeft: number = await (await (await page.$('a[href="license.html"]'))?.boundingBox())?.x ?? 0;

        expect(homeLeft < widgetsLeft && widgetsLeft < licenseLeft && visionLeft < licenseLeft).toBeTruthy();
    });

    test('The default menu is displayed if the username cookie is not present', async () => {

        let username: string = (await page.cookies()).find(item => item.name == 'username')?.value ?? '';
        let login: ElementHandle<Element> | null | undefined = await page.$('a[href="login.html"]');

        expect(username).toEqual('');
        expect(login).toBeTruthy();
    });

    test('The Login menu is not displayed when the username cookie is set', async () => {

        await page.setCookie({ name: 'username', value: 'goodguy' });
        await page.goto(pageUrl);

        let login: ElementHandle<Element> | null | undefined = await page.$('a[href="login.html"]');

        expect(login).toBeFalsy();
    });

    test('The user icon references Gravatar', async () => {

        await page.setCookie({ name: 'username', value: 'goodguy' });
        await page.goto(pageUrl);

        let href: string = await (await (await page.$('img.gravatar'))?.getProperty('src'))?.jsonValue() ?? '';

        expect(href).toContain('https://www.gravatar.com/avatar/');
    });

    test('The user dropdown menu is displayed when the user is clicked and contains logout', async () => {

        await page.setCookie({ name: 'username', value: 'goodguy' });
        await page.goto(pageUrl);
        await page.click('div.gravatar');

        let dropdownBox: BoundingBox | null | undefined = await (await page.$('div.sitemenu-dropdown'))?.boundingBox();
        let logout: ElementHandle<Element> | null = await page.$('div.sitemenu-dropdown a.logout-item');

        expect(dropdownBox).toBeTruthy();
        expect(logout).toBeTruthy();
    });

    // The last two tests use XPath instead of CSS selectors, just because.

    test('Clicking the Logout menu item clears the username cookie', async () => {

        await page.setCookie({ name: 'username', value: 'goodguy' });
        await page.goto(pageUrl);

        let user: ElementHandle<Element>[] = await page.$x('//div[contains(@class, "gravatar")]');

        await user[0]?.click();

        let dropdownItems: ElementHandle<Element>[] = await page.$x('//div[contains(@class, "sitemenu-dropdown")]/a[contains(@class, "logout-item")]');

        if (dropdownItems.length > 0) {

            await dropdownItems[0]?.click();
            await page.waitForNavigation();
        }

        let cookie: any = (await page.cookies()).find(item => item.name == 'username');

        expect(cookie).toBeFalsy();
    });

    test('Clicking the Logout menu item loads the index.html page', async () => {

        await page.setCookie({ name: 'username', value: 'goodguy' });
        await page.goto(`${baseurl}/widgets.html`);       

        let user: ElementHandle<Element>[] = await page.$x('//div[contains(@class, "gravatar")]');

        await user[0]?.click();

        let dropdownItems: ElementHandle<Element>[] = await page.$x('//div[contains(@class, "sitemenu-dropdown")]/a[contains(@class, "logout-item")]');

        if (dropdownItems.length > 0) {

            await dropdownItems[0].click();
            await page.waitForNavigation();
        }

        let pageUrl = await page.url();

        expect(pageUrl).toContain('index.html');
    });
});