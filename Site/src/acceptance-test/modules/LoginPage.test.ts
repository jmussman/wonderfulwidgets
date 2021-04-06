// LoginPage.test.ts
// Copyright © 2021 Joel MUssman. All rights reserved.
//

import { BoundingBox, Browser, CDPSession, ElementHandle, launch, Page, Viewport } from 'puppeteer';

import { baseurl } from '../common/definitions';

describe('index.html', () => {

    let browser: Browser;
    let page: Page;
    let pageUrl: string = `${baseurl}/login.html`;

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

    test('The login form is displayed', async () => {

        let username: ElementHandle<Element> | null = await page.$('[name=username]');
        let password: ElementHandle<Element> | null = await page.$('[name=password]');
        let login: ElementHandle<Element> | null = await page.$('[type=submit]');

        expect(username && password && login).toBeTruthy();
    });

    // These are gray-box tests: we know what cookies are set by the application and we take advantage of that.

    test('A username equal to "badguy" fails to authenticate', async () => {

        await page.$eval('[name="username"]', (el: Element) => el.setAttribute('value', 'badguy'));
        await page.click('[type="submit"]');

        let usernameCookie: any = (await page.cookies())?.find((item: any) => item.name == 'username');
        let visible: BoundingBox | null | undefined = await (await page.$('.loginform .error'))?.boundingBox();

        expect(usernameCookie).toBeFalsy();
        expect(visible).toBeTruthy();
    });

    test('A username starting with "badguy" fails to authenticate', async () => {

        await page.$eval('[name="username"]', (el: Element) => el.setAttribute('value', 'badguy@badplace.org'));
        await page.click('[type="submit"]');

        let usernameCookie: any = (await page.cookies())?.find((item: any) => item.name == 'username');
        let visible: BoundingBox | null | undefined = await (await page.$('.loginform .error'))?.boundingBox();

        expect(usernameCookie).toBeFalsy();
        expect(visible).toBeTruthy();
    });

    test('A username starting with "badgu" authenticates', async () => {

        await page.$eval('[name="username"]', (el: Element) => el.setAttribute('value', 'badgusomething'));
        await page.click('[type="submit"]');

        let usernameCookie: any = (await page.cookies())?.find((item: any) => item.name == 'username');
        let pageUrl: string = await page.url();

        expect(usernameCookie).toBeTruthy();
        expect(pageUrl).toContain('widgets');
    });

    test('A random username authenticates', async () => {

        await page.$eval('[name="username"]', (el: Element) => el.setAttribute('value', 'goodguy'));
        await page.click('[type="submit"]');

        let usernameCookie: any = (await page.cookies())?.find((item: any) => item.name == 'username');
        let pageUrl: string = await page.url();

        expect(usernameCookie).toBeTruthy();
        expect(pageUrl).toContain('widgets');
    });

    test('Checking the remember me box causes the username to be remembered in a cookie', async () => {

        await page.$eval('[name="username"]', (el: Element) => el.setAttribute('value', 'goodguy'));
        await page.$eval('[name="rememberme"]', (el: Element) => el.setAttribute('checked', 'checked' ));
        await page.click('[type="submit"]');

        let rememberMeCookie = (await page.cookies())?.find((item: any) => item.name == 'rememberme');

        expect(rememberMeCookie).toBeTruthy();
        expect(rememberMeCookie?.expires).toBeTruthy();
    });

    test('Unchecking the remember me box causes any rememberme cookie to be removed', async () => {

        await page.$eval('[name="username"]', (el: Element) => el.setAttribute('value', 'goodguy'));
        await page.click('[type="submit"]');

        let rememberMeCookie = (await page.cookies())?.find((item: any) => item.name == 'rememberme');

        expect(rememberMeCookie).toBeFalsy();
    });

    test('Visiting the login page with no rememberme cookie shows an empty username and unchecked box', async () => {

        let rememberMeCookie = (await page.cookies())?.find((item: any) => item.name == 'rememberme');

        if (rememberMeCookie) {

            await page.deleteCookie(rememberMeCookie);
        }

        await page.goto(pageUrl);
        
        let usernameValue: string | null | undefined = await (await (await page.$('input[name="username"]'))?.getProperty('value'))?.jsonValue();
        let rememberMeChecked: string | null | undefined = await (await (await page.$('[name="rememberme"]'))?.getProperty('checked'))?.jsonValue();

        expect(usernameValue).toBeFalsy();
        expect(rememberMeChecked).toBeFalsy();
    });

    test('Visiting the login page with the rememberme cookie set sets the username and checkbox', async () => {

        let username: string = 'goodguy';

        await page.setCookie({ name: 'rememberme', value: username });        
        await page.goto(pageUrl);

        let usernameValue: string | null | undefined = await (await (await page.$('input[name="username"]'))?.getProperty('value'))?.jsonValue();
        let rememberMeChecked: string | null | undefined = await (await (await page.$('[name="rememberme"]'))?.getProperty('checked'))?.jsonValue();

        expect(usernameValue).toEqual(username);
        expect(rememberMeChecked).toBeTruthy();
    });
});