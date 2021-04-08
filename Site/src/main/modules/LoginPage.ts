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

            $('[type="submit"').trigger('click');
        }
    });

    // Handle the login button being clicked.

    $('[type="submit"]').on('click', (event: any) => {

        let username: string | undefined = String($('[name="username"]').val() ?? "");

        if (username) {

            if (username.startsWith("badguy")) {

                $('.loginform .error').show();
            
            } else {

                let remembermeField: JQuery = $('input[name="rememberme"]');

                if (remembermeField.prop('checked')) {

                    Cookies.set('rememberme', username, { expires: Number.MAX_SAFE_INTEGER });
                
                } else {

                    Cookies.remove('rememberme', );
                }

                Cookies.set('username', username);
                // window.location.href = "widgets.html";
            }
        }

        // Don't actually submit the form.

        event.stopPropagation();
    });

    // Stifle the form submission, we do everything on the client side. Some SSO providers require that the
    // fields be in a form, and by the HTML rules they should be. For the same reason we are using an input
    // button instead of a <button>; buttons go outside of forms, input buttons go inside of forms.

    $('form').on('submit', (event) => {

        return false;
    });

    // Set the remember me checkbox to indicate if we remembered a name, and set the username field to
    // the name.

    let usernameField: JQuery = $('input[name="username"]');
    let remembermeField: JQuery = $('input[name="rememberme"]');
    let rememberme: string | undefined = Cookies.get('rememberme');

    Cookies.set('here', '1');

    if (rememberme) {

        Cookies.set('here', '2');

        usernameField.val(rememberme);
        remembermeField.prop('checked', 'checked');
    }
}