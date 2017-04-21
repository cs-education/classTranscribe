=====KNOWN ISSUES=====
Logging in as user A, logging out, and without closing the browser, attempting to login as user B causes an error. We think it's because Shibboleth can't gracefully allow two logged in users. This may be fixed through speaking with iTrust.

As noted in router/index.js, I believe that the order matters. This can probably be fixed.

=====AUTHENTICATION WITH SHIBBOLETH=====
Out of the box, authentication will not work.
Currently (4/21/17), authentication is handled through TestShib, as we do not have a representative for iTrust.

In order to register with TestShib (and iTrust), you will need...

* A certificate and a key
** Metadata associated with that cert/key

==Creating a cert/key==
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 356 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem

# This will create a very basic cert/key. A more secure method may be needed later on.

==Metadata==
There's a commented out section (currently) in server.js.
Make sure the generateServiceProviderMetadata() is pointing to the correct cert location.
Run the server and visit that route. The browser should spit out a bunch of text. This is your metadata that you'll submit to the IdP. You should probably copy it, save it, and remember the name of that file.

Make sure the key and certificate are being correctly referenced (if they are moved).

==Authentication==
Most of the authentication parameters **should** be all be contained in authentication.js.
You will need to change CALLBACK_URL to the location the IdP should return the user to after successful authentication.
ENTRY_POINT is the IdP url where the user should be redirected to to confirm authentication
ISSUER is the site's unique name. Note that it needs to be unique. Errors may occur if this is not the case.

=====MISCELLANEOUS=====
.env contains the various opened ports
    PIWIK_PORT is where piwik is being hosted (through the Gruntfile)
    PROXY_PORT is the open SSL port to access Piwik
    CT_PORT is where to access the main website
    REDIRECT_PORT is the open port that redirects from HTTP to HTTPS
    DEV is more of a convenience developer tool
        If DEV=DEV, then authentication login will be skipped.
        If it's anything else, authentication should be requested.
You will probably need to manually create the .env file.

server.js serves the classtranscribe.com main website
redirectServer.js: redirects http://<<classtranscribe>> to https://<<classtranscribe>>
proxyServer: provides https for Piwik
Gruntfile.js: runs the Piwik server
    The Piwik server needs to be able to run php

Unforuntately, the names of the routes (/routes) and names of some javascripts (javascripts/controllers) have similar names. They are in different folders, but just be aware that this the case.

When updating Piwik, make sure that you save a copy of "config/config.ini.php" to keep your existing settings. Then, download the new Piwik. Finally, replace the "config/config.ini.php" file with the one you saved.

I put a bunch of functions into public/functions.js basically because I didn't know what they did or when they were called.

templates/home.mustache is the home page for classtranscribe

sql data could be accessed by file javascripts/controllers/data_output.js
by running it as node script or in a file
