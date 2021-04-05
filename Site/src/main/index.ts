// index.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// index.ts fulfills two purposes: it is the entry point for the application, and sets up the page load callback
// that provides calls to the functions that build the common boilerplate for all pages, regardless of which page
// was loaded as long as the page references the bundle.
//
// The second purpose is to export the entry points for the code-behind-page modules as members of the "application"
// object (see the output in webpack.config.js) so that pages may reference their own code-behind from their script.
//

import $ from 'jquery';

import FooterBuilder from './modules/FooterBuilder';
import HeaderBuilder from './modules/HeaderBuilder';
import MenuBuilder from './modules/MenuBuilder';

// Re-export page modules.

export * from './modules/LoginPage';

// Application initialization for all pages.

$(() => {

	HeaderBuilder();
	MenuBuilder();
	FooterBuilder();
});