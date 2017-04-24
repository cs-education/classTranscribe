=====BASIC SET-UP =====
* Create .env file; the contents are described in ENVIRONMENT VARIABLES
* Create a certificate and key. Place those in cert/cert/ (by default)
    You will need to provide this information to the IdP.
* Download Piwik
    To set up Piwik, visit the exposed port or url (the port will be defined as PROXY_PORT in .env)
    Follow the instructions onscreen.

Piwik and authentication will NOT work prior to this set-up.

=====KNOWN ISSUES=====
Logging in as user A, logging out, and without closing the browser, attempting to login as user B causes an error. We think it's because Shibboleth can't gracefully allow two logged in users. This may be fixed through speaking with iTrust.

As noted in router/index.js, I believe that the order matters. This can probably be fixed.

I put a bunch of functions into public/functions.js basically because I didn't know what they did or when they were called.

=====AUTHENTICATION WITH SHIBBOLETH=====
Out of the box, authentication will not work.
Currently (4/21/17), authentication is handled through TestShib, as we do not have a representative for iTrust.

In order to register with TestShib (and iTrust), you will need...

* A certificate and a key
** Metadata associated with that cert/key
* The certificate of the IdP (idp_cert.pem)
    (For some reason, I can't find the testshib IdP certificate, nor do I completely remember how I found it. You may possible have to extract it from https://idp.testshib.org/Shibboleth.sso/Metadata)

Regarding iTrust, they recommend using the eduPersonPrincipalName attribute. Beyond that, try requesting the attributes you think you'll need.

==Creating a cert/key==
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 356 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem

# This will create a very basic cert/key. A more secure method may be needed later on.
# 365 is the number of days that the certificate will last. iTrust recommends 10 to 20 years.

To retrieve any of the user attributes, you can access them via request.user[<<paramer>>]. You may need to find out what that parameter is, as I believe they are nearly nonsense strings of numbers.

==Metadata==
There's a commented out section (currently) in server.js.
Make sure the generateServiceProviderMetadata() is pointing to the correct cert location.
Run the server and visit that route. The browser should spit out a bunch of text. This is your metadata that you'll submit to the IdP. You should probably copy it, save it, and remember the name of that file.

Make sure the key and certificate are being correctly referenced (if they are moved).

The IdP should require this xml file and its information in some format. I believe iTrust needs the certificate, key, issuer, and callback point individually.

==Authentication==
Most of the authentication parameters **should** be all be contained in authentication.js.
You will need to change CALLBACK_URL to the location the IdP should return the user to after successful authentication.
ENTRY_POINT is the IdP url where the user should be redirected to to confirm authentication
ISSUER is the site's unique name. Note that it needs to be unique. Errors may occur if this is not the case.

=====PIWIK=====
When updating Piwik, make sure that you save a copy of "config/config.ini.php" to keep your existing settings. Then, download the new Piwik. Finally, replace the "config/config.ini.php" file with the one you saved.

_paq.push(...) sends something to database for Piwik to track

The server will need to be able to run php for the Piwik installation interface to appear.

=====ENVIRONMENT VARIABLES=====
.env contains the various opened ports
    PIWIK_PORT is where piwik is being hosted (through the Gruntfile)
    PROXY_PORT is the open SSL port to access Piwik
    CT_PORT is where to access the main website
    REDIRECT_PORT is the open port that redirects from HTTP to HTTPS
    DEV is more of a convenience developer tool
        If DEV=DEV, then authentication login will be skipped.
        If it's anything else, authentication should be requested.
You will probably need to manually create the .env file.

=====NAMING=====
server.js serves the classtranscribe.com main website
redirectServer.js: redirects http://<<classtranscribe>> to https://<<classtranscribe>>
proxyServer: provides https for Piwik
Gruntfile.js: runs the Piwik server

Unforuntately, the names of the routes (/routes) and names of some javascripts (javascripts/controllers) have similar names. They are in different folders, but just be aware that this the case.

templates/home.mustache is the home page for classtranscribe

sql data could be accessed by file javascripts/controllers/data_output.js
by running it as node script or in a file
