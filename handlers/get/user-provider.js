var fileProvider = require('./file-provider');

function userProvider(req, res) {
    req.url = 'index.html';
    fileProvider(req, res);
}

module.exports = userProvider;