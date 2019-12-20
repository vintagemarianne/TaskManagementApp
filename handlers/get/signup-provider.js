var fileProvider = require('./file-provider');

function signupProvider(req, res) {
    req.url = 'signup.html';
    fileProvider(req, res);
}

module.exports = signupProvider;