// index.test.ts
// Copyright © 2021 Joel MUssman. All rights reserved.
//
// Test the UI for the index page. This page is based on Selenium as the application driver as an
// example, all of the other tests in this project use Puppeteer as the application driver
// since Puppeteer is lighter and preferred.
//

import { Builder, By, ThenableWebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

import { baseurl } from './common/definitions';

describe('index.html', () => {

    let browserName: string = 'chrome';
    let pageUrl: string = baseurl;
    let driver: ThenableWebDriver;

    beforeEach(async () => {

        let options: Options = new Options();

        // Create a headless driver.

        options.headless();        
        driver = new Builder().forBrowser(browserName).setChromeOptions(options).build();

        // Load the page.
        
        await (await driver).navigate().to(pageUrl);
    });

    afterEach(async () => {

        await (await driver).close();
    })

    // Note the passing of the done parameter to the test function: Selenium is slow and this should increase the timeout
    // from five seconds to ten. Unfortunately, it seems that the value is ignored by Jest for asynchronous functions and
    // it still times out after five seconds. If you see this happen and end up here looking at it, run the test again
    // and it will probably be faster the second time.

    test('The header, menu, body, and footer div tags are built and displayed in the correct order', async (done: Function) => {

        let bodyTop: number = (await (await driver.findElement(By.css('.sitebody'))).getRect()).y;
        let footerTop: number = (await (await driver.findElement(By.css('.sitefooter'))).getRect()).y;
        let headerTop: number = (await (await driver.findElement(By.css('.siteheader'))).getRect()).y;
        let menuBarTop: number = (await (await await driver.findElement(By.css('.sitemenu'))).getRect()).y;

        expect(headerTop < menuBarTop && menuBarTop < bodyTop && bodyTop < footerTop).toBe(true);

        done();
    });
});
