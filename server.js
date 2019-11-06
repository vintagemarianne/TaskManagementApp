const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function (req, res) {

    if (req.url === "/save") {
        saveData(req);
        res.end();
    } else {
        var pathname = url.parse(req.url, true).pathname;
        var ext = pathname.substr(pathname.indexOf('.') + 1, pathname.length);
        ext = converExt(ext);
        fs.readFile('client' + req.url, function (err, data) {
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
    }

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

function saveData(req) {
    var jsonData = '';

    req.on('data', data => {
        jsonData += data.toString()
    });

    req.on('end', () => {
        // mongoClient.connect(dbUrl, function (err, db) {
        //     if (err) throw err;
        //     var dbo = db.db('todoapp');
        //     dbo.collection('model').insertOne(JSON.parse(jsonData), function (err, res) {
        //         if (err) throw err;
        //         db.close();
        //     })
        // })
    });
}