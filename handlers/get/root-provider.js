var fileProvider = require('./file-provider');

function rootProvider(req, res) {
    req.url = 'signup.html';
    fileProvider(req, res);
}

module.exports = rootProvider;