KNOWN ISSUES
Logging in as user A, logging out, and without closing the browser, attempting to login as user B causes an error. We think it's because Shibboleth can't gracefully allow two logged in users. This may be fixed through speaking with iTrust.

.env contains the various opened ports
    PIWIK_PORT is where piwik is being hosted (through the Gruntfile)
    PROXY_PORT is the open SSL port to access Piwik
    CT_PORT is where to access the main website
    REDIRECT_PORT is the open port that redirects from HTTP to HTTPS
    DEV is more of a convenience developer tool
        If DEV=DEV, then authentication login will be skipped.


When updating Piwik, make sure that you save "config/config.ini.php" to keep your existing settings. Then, download the new Piwik. Finally, replace the "config/config.ini.php" file with the one you saved.

In javascripts/libraries/header.js, be sure to change the piwik port
