// LoginPage.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';
import Cookies from 'js-cookie';

export function initLoginPage(): void {

    // Set up the form so that any Enter keypress will click the login button. The
    // CSS selectors on this page purposely try to avoid setting an ID to identify
    // an element wherever possible.

    $('.loginform').on('keypress', (e) => {

        if (e.key == "Enter") {

            $('input[type=submit').trigger('click');
        }
    });

    // Handle the login button being clicked.

    $('input[type=submit]').on('click', () => {

        let username = String($('[name=username]').val() ?? "");

        if (username) {

            if (username.startsWith("badguy")) {

                $('.loginform .error').show();
            
            } else {

                Cookies.set('username', username);
                window.location.href = "widgets.html";
            }
        }
    });
}