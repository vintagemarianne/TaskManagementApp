const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function (req, res) {

    var pathname = url.parse(req.url, true).pathname;
    var ext = pathname.substr(pathname.indexOf('.') + 1, pathname.length);
    var address = req.url.substr(1, req.url.length);
    ext = converExt(ext);

    fs.readFile(address, function (err, data) {
        if (err) {
            res.writeHead(500);
            res.write(err.name);
            res.end();
        }
        res.writeHead(200, {
            'Content-Type': `text/${ext}`
        });
        res.write(data);
        res.end();
    });

}).listen(8080);

function converExt(ext) {
    switch (ext) {
        case 'html':
        case 'css':
            ext;
            break;
        case 'js':
            ext = 'javascript';
            break;
    }
    return ext;
}