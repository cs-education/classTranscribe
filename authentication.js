var saml = require('passport-saml');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

var CALLBACK_URL = "https://192.17.96.13:" + (process.env.CT_PORT || 7443) + "/login/callback"
var ENTRY_POINT = "https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO";
var ISSUER = 'ClassTranscribe4927/Shibboleth';

var LOGOUT_URL = "https://www.testshib.org/Shibboleth.sso/Logout";
// Might be unnecessary?

var KEY = fs.readFileSync('./cert/cert/key.pem');
var CERT = fs.readFileSync('./cert/cert/cert.pem');

samlStrategy = new saml.Strategy({
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: CALLBACK_URL,
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: ENTRY_POINT,
    // Usually specified as `/shibboleth` from site root
    issuer: ISSUER,
    logoutUrl: LOGOUT_URL,
    identifierFormat: null,
    decryptionPvk: KEY,   // SP private key
    privateCert: KEY, //SP certiticate
    cert: fs.readFileSync('./cert/cert/idp_cert.pem', 'utf8'),    //IdP public key
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
    forceAuthn: true,
    isPassive: false,
    additionalParams: {}
}, function (profile, done) {
    usersaml = {};
    usersaml.nameID = profile["issuer"]["_"];
    usersaml.nameIDFormat = profile["issuer"]["$"];
    return done(null, profile);
});

ensureAuthenticated = function(req, res, next) {
  if (process.env.DEV == "DEV") {
    console.log("Skipping login");
    return next();
  }
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    samlStrategy['Redirect'] = req['_parsedOriginalUrl']['path'];
    //console.log(req['_parsedOriginalUrl']['path']);
    return res.redirect('/login');
  }
}

passport.use(samlStrategy);
