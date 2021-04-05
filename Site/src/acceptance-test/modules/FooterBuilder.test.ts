// FooterBuilder.test.ts
// Copyright © 2021 Joel MUssman. All rights reserved.
//
// Verify that the correct menu is built and functions correctly. Currently if the user is not logged
// into the application the Login menu appears at the end of the items on the left. Otherwise a user
// menu appears on the right.
//

import { BoundingBox, Browser, CDPSession, launch, Page, Viewport } from 'puppeteer';

import { baseurl } from '../common/definitions';

describe('index.html', () => {

    let browser: Browser;
    let page: Page;
    let pageUrl: string = `${baseurl}/login.html`;  // Short page.

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

    test('The copyright notice is displayed in the footer', async () => {

        let footerText: string = await page.$eval('.sitefooter', (el: Element) => el.innerHTML); // note: innerText is not defined on Element.

        expect(footerText).toContain('Copyright');
        expect(footerText).toContain('Joel Mussman');
    });

    test('On a short page the copyright notice is displayed at the window bottom of short pages', async () => {

        let viewportHeight: number = await page.viewport()?.height ?? 0;
        let footerRect: BoundingBox | null | undefined = await (await page.$('.sitefooter'))?.boundingBox();
        let footerHeight: number = footerRect?.height ?? 0;
        let footerTop: number = footerRect?.y ?? 0;

        expect(viewportHeight).toBeGreaterThanOrEqual(footerTop + footerHeight);
    });
});
