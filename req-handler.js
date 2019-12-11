const fs = require('fs');

exports.requestHandler = function requestHandler(req, res) {

    var database = [];

    var routeHandler;

    if (req.method === 'GET') {
        if (req.url === '/') routeHandler = rootProvider;
        else if (req.url.match(/^\/user\/\d+/)) routeHandler = userProvider;
        else if (req.url === '/download') routeHandler = downloadProvider;
        else if (req.url === '/signin') routeHandler = signinProvider;
        else if (req.url === '/signup') routeHandler = signupProvider;

    } else if (req.method === 'POST') {
        if (req.url === '/signup') routeHandler = signupHandler;
        else if (req.url === '/signin') routeHandler = signinHandler;
        else if (req.url === '/save') routeHandler = saveHandler;
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

                if (database.some(item => jsonData.username === item.username)) {
                    res.writeHead(500);
                    res.write('The username is already taken.');
                    res.end();
                    return;
                }

                jsonData.id = database.length > 0 ? database[database.length - 1].id + 1 : 1;

                jsonData.state = {
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
                    res.writeHead(200, {
                        'Set-Cookie': `userId=${jsonData.id}`
                    });
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

                    if (!isUser) {
                        res.writeHead(500);
                        res.write('You have not signed in yet.');
                        res.end();
                        return;
                    } else if (!isAuthenticated) {
                        res.writeHead(500);
                        res.write('Username or password is incorrect.');
                        res.end();
                        return;
                    }
                    database = database.map(item => jsonData.username === item.username ? {
                        name: item.name,
                        username: item.username,
                        password: item.password,
                        data: {
                            sessionId: '123',
                            filter: item.data.filter,
                            todos: item.data.todos
                        }
                    } : item);
                    fs.writeFile('db.txt', JSON.stringify(database), function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    res.writeHead(200, {
                        'Set-Cookie': 'sessionId = 123'
                    });
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
        if (req.url.includes('/user')) {
            req.url = req.url.substr(5, req.url.length - 1);
        }
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

    function readDB() {

    }

}