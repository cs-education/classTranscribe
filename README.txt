=====KNOWN ISSUES=====
Logging in as user A, logging out, and without closing the browser, attempting to login as user B causes an error. We think it's because Shibboleth can't gracefully allow two logged in users. This may be fixed through speaking with iTrust.

=====AUTHENTICATION WITH SHIBBOLETH=====
Out of the box, authentication will not work.
Currently (4/21/17), authentication is handled through TestShib, as we do not have a representative for iTrust.

In order to register with TestShib (and iTrust), you will need

* A certificate and a key
** Metadata associated with that cert/key

=====MISCELLANEOUS=====
.env contains the various opened ports
    PIWIK_PORT is where piwik is being hosted (through the Gruntfile)
    PROXY_PORT is the open SSL port to access Piwik
    CT_PORT is where to access the main website
    REDIRECT_PORT is the open port that redirects from HTTP to HTTPS
    DEV is more of a convenience developer tool
        If DEV=DEV, then authentication login will be skipped.


When updating Piwik, make sure that you save "config/config.ini.php" to keep your existing settings. Then, download the new Piwik. Finally, replace the "config/config.ini.php" file with the one you saved.

In javascripts/libraries/header.js, be sure to change the piwik port

sql data could be accessed by file javascripts/controllers/data_output.js
by running it as node script or in a file

