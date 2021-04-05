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

    // Note the passing of the done parameter to the test function. It may take time to get the application up and running,
    // and unfortunately jest has a default timeout of 5k milliseconds for async functions. Passing done in tells Jest
    // that the test may take longer, and wait for us to call "done".

    test('The header, menu, body, and footer div tags are built and displayed in the correct order', async (done: Function) => {

        let bodyTop: number = (await (await driver.findElement(By.css('.sitebody'))).getRect()).y;
        let footerTop: number = (await (await driver.findElement(By.css('.sitefooter'))).getRect()).y;
        let headerTop: number = (await (await driver.findElement(By.css('.siteheader'))).getRect()).y;
        let menuBarTop: number = (await (await await driver.findElement(By.css('.sitemenu'))).getRect()).y;

        expect(headerTop < menuBarTop && menuBarTop < bodyTop && bodyTop < footerTop).toBe(true);

        done();
    });
});
