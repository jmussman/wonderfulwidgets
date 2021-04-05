// FooterBuilder.ts
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This module sets up a consistent footer for all mages on the site. It is called by index.ts for all pages.
//

import $ from 'jquery';

export default function build(): void {

    let footer: JQuery = $('<div>', { class: 'sitefooter' }).append('Copyright &copy; 1991-2021 Joel Mussman. All rights reserved.');

	$('body').append(footer);

    let headerHeight: number = $('.siteheader').outerHeight() ?? 0;
    let menuHeight: number = $('.sitemenu').outerHeight() ?? 0;
    let footerHeight: number = $('.sitefooter').outerHeight() ?? 0;

	let boilerplateHeight: number =  headerHeight + menuHeight + footerHeight;
    let minBodyHeight = window.innerHeight - boilerplateHeight - 40; // include the 2x20px for the margin above and below .sitebody and an extra 20 to prevent the scrollbar

    console.log(window.innerHeight, headerHeight, menuHeight, footerHeight, minBodyHeight);

	$('.sitebody').css({ 'min-height': (minBodyHeight + 'px') });
}