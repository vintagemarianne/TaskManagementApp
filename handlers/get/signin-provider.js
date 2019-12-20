var fileProvider = require('./file-provider');

function signinProvider(req, res) {
    req.url = 'signin.html';
    fileProvider(req, res);
}

module.exports = signinProvider;