// HeaderBuilder.ts
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This module sets up a consistent header for all pages in the site. It is called by index.ts for all pages.
//

import $ from 'jquery';

export default function build(): void {

	let header: JQuery = $('<div>', { class: 'siteheader' }).append('The Wonderful Widget Company');

    $('body').prepend(header);
}