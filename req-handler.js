const fs = require('fs');
const querystring = require('querystring');
const url = require('url');

exports.requestHandler = function requestHandler(req, res) {

    var routeHandler;

    const parsed = url.parse(req.url);
    const query  = querystring.parse(parsed.query);

    if (req.method === 'GET') {
        switch (parsed.pathname) {
            case '/':
                routeHandler = rootHandler;
                break;
            case '/download':
                routeHandler = downloadHandler;
                break;
            case '/user':
                routeHandler = signupHandler;
                break;
        }
    } else if (req.method === 'POST') {
        switch (parsed.pathname) {

            case '/save':
                routeHandler = saveHandler;
                break;
        }
    }

    if (!routeHandler) {
        routeHandler = staticFileHandler;
    }

    routeHandler(req, res);


    function rootHandler(req, res) {
        req.url = 'signup.html';
        staticFileHandler(req, res);
    }

    function signupHandler(req, res) {
        req.url = 'index.html';
        signup();
        staticFileHandler(req, res);
    }

    function signup() {
        var data = {
            'name': query.fullname,
            'username': query.username,
            'password': query.password
        }
        
        fs.writeFile(data.username + '.json', JSON.stringify(data), function (err) {
            if (err) {
                console.log(err.message)
                return;
            }
        });
    }

    function downloadHandler(req, res) {
        fs.readFile('db.txt', function (err, data) {
            if (err) {
                res.writeHead(500);
                res.write(err.name);
                res.end();
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'text/json'
            });
            res.write(data);
            res.end();
        });
    }

    function saveHandler(req, res) {
        var jsonData = '';

        req.on('data', data => {
            jsonData += data.toString('utf-8')
        });

        req.on('end', () => {
            fs.writeFile('db.txt', jsonData, function (err) {
                if (err) {
                    res.writeHead(500);
                    res.end();
                    return;
                }
                res.writeHead(200, {
                    'Content-Type': 'text/json'
                });
                res.end();
            });
        });
    }

    function staticFileHandler(req, res) {
        fs.readFile('client/' + req.url, function (err, data) {
            if (err) {
                res.writeHead(500);
                res.write(err.name);
                res.end();
            }
            res.writeHead(200);
            res.write(data);
            res.end();
        });
    }

}