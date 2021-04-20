// HeaderBuilder.test.ts
// Copyright © 2021 Joel MUssman. All rights reserved.
//
// Verify that the correct menu is built and functions correctly. Currently if the user is not logged
// into the application the Login menu appears at the end of the items on the left. Otherwise a user
// menu appears on the right.
//

import { Browser, CDPSession, ElementHandle, launch, Page } from 'puppeteer';

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

    test('The company name is displayed in the header', async () => {

        let headerText: string = await page.$eval('.siteheader', (el: Element) => el.innerHTML); // note: innerText is not defined on Element.

        expect(headerText).toEqual("The Wonderful Widget Company");
    });
});