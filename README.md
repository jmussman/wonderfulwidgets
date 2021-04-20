![](.common/joels-private-stock.png?raw=true)

# The Wonderful Widget Company

When I was a wee lad I remember writing many programming examples where we used <id>The Wonderful Widget Company</id> as our foundation.
Well, less than ten years later I was at the Air Force's Rome Air Development Center helping make the ArpaNET successful, spinning the Internet off, and then the World Wide Web came along.
I had the luck to register <i>wonderfulwidgets.com</i> before somebody else did!
For decades I have held onto the name so that you and anybody else can reference the example company name and the domain name for examples and classes
and be confident they are not stepping on somebody else.

Occasionally I add things to the application that I want to leave around to use periodically, and you are welcome to use them too: see the
<a href="https://wonderfulwidgets.com/widgets.html">widgets page</a>.
There is a application-local login page that accepts almost any username and password (there is no user database, everyone is authenticated).
I use it frequently in demonstrations to register an application in <a href="https://okta.com" target="blank">Okta</a> tenants
as an example that uses "Secure Web Access", the fancy name for Okta's browser plugin that provides password management.
Just to show it a login failure there is one username that will always be rejected: "badguy" :)

This project contains everything for the application.
The top-level has all of project documents and graphics as well as the source to the web application.
The source is divided into two branches: main is the actual source, and test contains Jest tests.
The source is now PHP on the server-side and Typescript on the client-side (transpiled and bundled with Webpack) to simplify where the application may be hosted (pretty much any hosting provider). 

Look below for instructions if you want to clone the project. Enjoy!

-- Joel Mussman

## Revision History

1991 - present - Many variations, constantly changing: HTML, then Java, then .NET...  
2021-04-05 - revamped as a PHP/Typescript-driven example with Jest tests

## License

This project and code is released under the MIT license. You may use and modify all or part of it as you choose, as long as attribution to the source is provided per the license. See the details in the [license file](./LICENSE.md) or at the [Open Source Initiative](https://opensource.org/licenses/MIT).

## Installation and Use

Look in the Application folder at the package.json file to understand the dependencies and the build, and webpack.config.js to understand how things are built.

* The src/ folder contains the source, it builds to 'build'. src/ has a main with the application source, and various *test/ folders for different tests.
* package.json has several commands: npm build will create the deployable bundle, npm start will launch the webpack-dev-server, and npm test, npm run integrationtest, and npm run acceptancetest will run Jest tests. Acceptance tests are currently the only tests implemented (see below).
* The tsconfig.json uses "CommonJS" as the module output because Jest needs it. The bundle is OK with "esnext".
* The static files are maintained in the src/main folder, WebPack copies them on build and start.
* jQuery is not included in the bundle, it saves space and the HTML pages will load it separately for their embedded script use anyway.
* Before building for deployment in webpack.config.js change the mode from "development" to "production" and comment out the devtool to skip the source map.
* ts-jest does not support Jest globalSetup and globalTeardown. The test command runs the Typescript file src/test/common/runtests.js (using ts-node) to wrap the tests and start the application server before them and stop it afterwards. See the note in the file about why this is necessary.
* The tests are really acceptance tests; right now there is no back-end functionality so the only thing to test is the UI.
* The index.test.ts file is written to use Selenium, all of the other tests use Puppeteer. This is just for inclusive examples.

## Support

Since I give this away for free, and if you would like to keep seeing more things like this, then please consider
a contribution to *Joel's Coffee Fund* at **Smallrock Internet** to help keep the good stuff coming :)<br />

[![Donate](.common/Donate-Paypal.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=XPUGVGZZ8RUAA)

## Contributing

We are always looking for ways to make the template better. But remember: Keep it simple. Keep it minimal. Don't add every single feature just because you can, add a feature when a feature is required.

## Authors and Acknowledgments

* Joel Mussman

<hr>
Copyright © 1991-2021 Joel Mussman. All rights reserved.