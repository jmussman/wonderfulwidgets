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

    test('A username equal to "badguy" fails to authenticate', async () => {

        await page.$eval('[name=username]', (el: Element) => el.setAttribute('value', 'badguy'));
        await page.click('[type=submit]');

        let usernameCookie: any = (await page.cookies())?.find((item: any) => item.name == 'username');
        let visible: BoundingBox | null | undefined = await (await page.$('.loginform .error'))?.boundingBox();

        expect(usernameCookie).toBeFalsy();
        expect(visible).toBeTruthy();
    });

    test('A username starting with "badguy" fails to authenticate', async () => {

        await page.$eval('[name=username]', (el: Element) => el.setAttribute('value', 'badguy@badplace.org'));
        await page.click('[type=submit]');

        let usernameCookie: any = (await page.cookies())?.find((item: any) => item.name == 'username');
        let visible: BoundingBox | null | undefined = await (await page.$('.loginform .error'))?.boundingBox();

        expect(usernameCookie).toBeFalsy();
        expect(visible).toBeTruthy();
    });

    test('A username starting with "badgu" authenticates', async () => {

        await page.$eval('[name=username]', (el: Element) => el.setAttribute('value', 'badgusomething'));
        await page.click('[type=submit]');

        let usernameCookie: any = (await page.cookies())?.find((item: any) => item.name == 'username');
        let pageUrl: string = await page.url();

        expect(usernameCookie).toBeTruthy();
        expect(pageUrl).toContain('widgets');
    });

    test('A random username authenticates', async () => {

        await page.$eval('[name=username]', (el: Element) => el.setAttribute('value', 'goodguy'));
        await page.click('[type=submit]');

        let usernameCookie: any = (await page.cookies())?.find((item: any) => item.name == 'username');
        let pageUrl: string = await page.url();

        expect(usernameCookie).toBeTruthy();
        expect(pageUrl).toContain('widgets');
    });
});