// MenuBuilder.ts
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This module sets up a consistent menu bar for all pages in the site. It is called by index.ts for all pages.
//

import $ from 'jquery';
import Cookie from 'js-cookie';
import CryptoJS from 'crypto-js';

export default function buildMenu(): void {

	// Get the logged in username if it was stored in a cookie.

	let username: string = Cookie.get('username') ?? "";

	// Build the user dropdown menu. The only item is a logout button, and because the link does not directly change
    // the page and passes through a handler the logout-item class is attached in deference for Jest to be able to
    // find the button without using the content text that could change to follow i18n.

	let logout: JQuery = $('<a class="logout-item">').append('Logout');
	let dropdown: JQuery = $('<div>', { class: 'sitemenu-dropdown' }).append(logout);

	// Hook up the logout process.

	dropdown.hide();
	$('body').append(dropdown);
	logout.on('click', () => { Cookie.remove('username'); buildMenu(); window.location.href = 'index.html'; });

    // Build the menubar.

	let home: JQuery = $('<div>', { class: 'textitem' }).append($('<a>', { href: 'index.html' }).append('Home'));
	let widgets: JQuery = $('<div>', { class: 'textitem' }).append($('<a>', { href: 'widgets.html' }).append('Widgets'));
	let vision: JQuery = $('<div>', { class: 'textitem' }).append($('<a>', { href: 'vision.html' }).append('Vision Statement'));
	let license: JQuery = $('<div>', { class: 'textitem' }).append($('<a>', { href: 'license.html' }).append('License'));
	let login: JQuery = $('<div>', { class: 'textitem' }).append($('<a>', { href: 'login.html' }).append('Login'));
    let gravatar: JQuery = $('<div>', { class: 'gravatar' }).append($('<img>', { class: 'gravatar' })).append(' ').append($('<i>', { class: 'arrow down' }));
	let leftDiv: JQuery = $('<div>', { class: 'leftmenu' }).append(home).append(widgets).append(vision).append(license);
	let rightDiv: JQuery = $('<div>', { class: 'rightmenu' });

    if (!username) {

        leftDiv.append(login);
    
    } else {

        rightDiv.append(gravatar);
    }

	let menubar: JQuery = $('<div>', { class: 'sitemenu'}).append(leftDiv).append(rightDiv).append($('<div>', { class: 'break' }));
	
    // Replace or append the menubar (append if it doesn't already exist).

    if ($('.sitemenu').length) {

        $('.sitemenu').replaceWith(menubar);

    } else {
	
        $('.siteheader').after(menubar);
    }

	// If there is a logged in user hook up the dropdown menu.

	if (username) {

        let hash: string = CryptoJS.MD5(username.trim().toLowerCase()).toString();
        let gravatarQueryString = `${encodeURIComponent(hash)}?s=40&d=mp`;

        $('img.gravatar').attr('src', `https://www.gravatar.com/avatar/${gravatarQueryString}`);
		
		gravatar.on('click', (event) => {

			// Calculate the position of the dropdown menu.

            let pageWidth: number = $(window).width() ?? 0;
            let gravatarWidthToMargin: number = pageWidth - (gravatar.offset()?.left ?? 0);
            let dropdownHorizontalPadding: number = (dropdown.outerWidth() ?? 0) - (dropdown.width() ?? 0);

            dropdown.width(Math.max(gravatarWidthToMargin - dropdownHorizontalPadding, dropdown.width() ?? 0));

            let dropdownLeft: number = ($(window).width() ?? 0) - ((dropdown.width() ?? 0) + dropdownHorizontalPadding);
			let dropdownTop: number = (menubar.offset()?.top ?? 0) + (menubar.height() ?? 0);

			dropdown.css({ top: dropdownTop, left: dropdownLeft, position: 'absolute' });
			dropdown.show();

            // Stop bubble to main window

            event.stopPropagation();
		});
	}

	// Set up the window click to hide the dropdown menu on a click anywhere (a click in the dropdown menu hides it too so forget about bubbling).

	$(window).on('click', () => {

		dropdown.hide();
	});
}