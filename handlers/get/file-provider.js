const fs = require('fs');

function fileProvider(req, res) {
    if (req.url.includes('/user')) {
        req.url = req.url.substr(5, req.url.length - 1);
    }

    fs.readFile('./client/' + req.url, function (err, data) {
        if (err) {
            res.writeHead(500);
            res.write(err.message);
            res.end();
        }
        res.writeHead(200);
        res.write(data);
        res.end();
    });
}

module.exports = fileProvider;
