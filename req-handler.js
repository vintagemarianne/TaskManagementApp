const fs = require('fs');
const querystring = require('querystring');
const url = require('url');

// const databaseHandler = require('./db-handler').databaseHandler();

exports.requestHandler = function requestHandler(req, res) {

    var database = [];

    var routeHandler;

    const parsed = url.parse(req.url);
    const query = querystring.parse(parsed.query);

    if (req.method === 'GET') {
        switch (req.url) {
            case '/':
                routeHandler = rootProvider;
                break;
            case '/download':
                routeHandler = downloadProvider;
                break;
            case '/user':
                routeHandler = userProvider;
                break;
            case '/signin':
                routeHandler = signinProvider;
                break;
            case '/signup':
                routeHandler = signupProvider;
                break;
        }
    } else if (req.method === 'POST') {
        switch (req.url) {
            case '/signup':
                routeHandler = signupHandler;
                break;
            case '/signin':
                routeHandler = signinHandler;
                break;
            case '/save':
                routeHandler = saveHandler;
                break;
        }
    }

    if (!routeHandler) {
        routeHandler = staticFileHandler;
    }

    routeHandler(req, res);

    //GET-PROVIDERS=====================================================================

    function rootProvider(req, res) {
        req.url = 'signup.html';
        staticFileHandler(req, res);
    }


    function userProvider(req, res) {
        req.url = 'index.html';
        staticFileHandler(req, res);
    }

    function signinProvider(req, res) {
        req.url = 'signin.html';
        staticFileHandler(req, res);
    }

    function signupProvider(req, res) {
        req.url = 'signup.html';
        staticFileHandler(req, res);
    }

    function downloadProvider(req, res) {
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

    //POST-HANDLERS=========================================================

    function signupHandler(req, res) {
        var jsonData = '',
            fileData = '';

        req.on('data', data => {
            jsonData += data.toString('utf-8')
        });

        req.on('end', () => {

            fs.readFile('db.txt', function (err, data) {
                if (err) {
                    console.log('error')
                    return;
                }

                fileData += data.toString('utf-8');
                if (fileData === '') {
                    database = [];
                } else {
                    database = JSON.parse(fileData);
                }
                
                jsonData = JSON.parse(jsonData);
                jsonData.data = {
                    todos: [],
                    filter: 0
                };

                database.push((jsonData));

                fs.writeFile('db.txt', JSON.stringify(database), function (err) {
                    if (err) {
                        res.writeHead(500);
                        res.end();
                        return;
                    }
                    res.writeHead(200);
                    res.write('successful');
                    res.end();
                });

            });

        });
    }

    function signinHandler(req, res) {
        var jsonData = '',
            fileData = '';

        req.on('data', data => {
            jsonData += data.toString('utf-8')
        });

        req.on('end', () => {
            fs.readFile('db.txt', function (err, data) {
                if (err) {
                    console.log('error')
                    return;
                }

                fileData += data.toString('utf-8');

                if (fileData === '') {
                    res.writeHead(500);
                    res.write('You have not signed in yet.');
                    res.end();
                    return;
                } else {
                    database = JSON.parse(fileData);
                    jsonData = JSON.parse(jsonData);

                    var isUser = database.some(item => jsonData.username === item.username);
                    var isAuthenticated = database.some(item => jsonData.username === item.username && jsonData.password === item.password);

                    if(!isUser) {
                        res.writeHead(500);
                        res.write('You have not signed in yet.');
                        res.end();
                        return;
                    } else if(!isAuthenticated) {
                        res.writeHead(500);
                        res.write('Username or password is incorrect.');
                        res.end();
                        return;
                    }
                    res.writeHead(200);
                    res.write('successful');
                    res.end();
                }
            });

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