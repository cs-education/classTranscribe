var argv = require('minimist')(process.argv.slice(2));
var env = argv["e"] || 'production';

var callbackURL;

callbackURL = "https://127.0.0.1/auth/google/callback";

// if (env === "dev") {
//     callbackURL = "https://127.0.0.1/auth/google/callback";
// } else {
//     callbackURL = "https://www.classtranscribe.com/auth/google/callback"
// }

module.exports = {
    'googleAuth': {
        'callbackURL': callbackURL
    }
};
