const fs = require('fs');
var handlers = require('./handlers');

exports.requestHandler = function requestHandler(req, res) {

    const PRIVATE_KEY = "71E300F146C334A4A76E41484282A5F4";

    var database = [];

    var routeHandler;

    routeHandler = ({
        GET: {
            '/': rootProvider,
            '/user/download': downloadProvider,
            '/signin': signinProvider,
            '/signup': signupProvider
        },
        POST: {
            '/signup': signupHandler,
            '/signin': signinHandler,
            '/user/save': saveHandler
        }
    })[req.method][req.url];

    if (req.url.match(/^\/user\/\d+/)) routeHandler = userProvider;

    if (!routeHandler) routeHandler = staticFileHandler;

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
        let jwt = req.headers.jwt;
        let fileData = '',
            responseData;
        if (!checkPrivateKey(jwt)) {
            res.writeHead(401);
            res.write('Action is not allowed!');
            res.end();
            return;
        }

        let user = decodeUser(jwt);
        fs.readFile('db.txt', function (err, data) {
            if (err) {
                res.writeHead(500);
                res.write(err.name);
                res.end();
                return;
            }

            fileData += data.toString('utf-8');

            database = JSON.parse(fileData);

            database.forEach(item => {
                if (user.username === item.username) {
                    responseData = {
                        todos: item.state.todos,
                        filter: item.state.filter
                    }
                }
            })
            res.writeHead(200, {
                'Content-Type': 'text/json'
            });
            responseData = JSON.stringify(responseData)
            res.write(responseData);
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
                    res.writeHead(500);
                    res.write(err.message);
                    res.end();
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
                    res.writeHead(401);
                    res.write('The username is already taken.');
                    res.end();
                    return;
                }

                jsonData.state = {
                    todos: [],
                    filter: 0
                };

                database.push((jsonData));

                let jwt = encodeUser(jsonData.name, jsonData.username);

                fs.writeFile('db.txt', JSON.stringify(database), function (err) {
                    if (err) {
                        res.writeHead(500);
                        res.write(err.message);
                        res.end();
                        return;
                    }
                    res.writeHead(200, {
                        'Set-Cookie': `jwt=${jwt}`
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
                    res.writeHead(500);
                    res.write(err.message);
                    res.end();
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
                        res.writeHead(401);
                        res.write('You have not signed in yet.');
                        res.end();
                        return;
                    } else if (!isAuthenticated) {
                        res.writeHead(401);
                        res.write('Username or password is incorrect.');
                        res.end();
                        return;
                    }

                    database.forEach(item => {
                        if (jsonData.username === item.username) {
                            jsonData = {
                                name: item.name,
                                username: item.username,
                                password: item.password,
                                state: {
                                    filter: item.state.filter,
                                    todos: item.state.todos
                                }
                            }
                        }
                    });

                    fs.writeFile('db.txt', JSON.stringify(database), function (err) {
                        if (err) {
                            res.writeHead(500);
                            res.write(err.message);
                            res.end();
                            return;
                        }
                    });

                    let jwt = encodeUser(jsonData.name, jsonData.username);
                    let responseData = {
                        todos: jsonData.state.todos,
                        filter: jsonData.state.filter
                    }

                    res.writeHead(200, {
                        'Set-Cookie': `jwt=${jwt}`
                    });
                    res.write(JSON.stringify(responseData));
                    res.end();
                }
            });

        });
    }

    function saveHandler(req, res) {
        let jwt = req.headers.jwt;
        let fileData = '',
            responseData;
        if (!checkPrivateKey(jwt)) {
            res.writeHead(401);
            res.write('Action is not allowed!');
            res.end();
            return;
        }

        let user = decodeUser(jwt);
        let jsonData = '';

        req.on('data', data => {
            jsonData += data.toString('utf-8')
        });

        req.on('end', () => {
            fs.readFile('db.txt', function (err, data) {
                if (err) {
                    res.writeHead(500);
                    res.write(err.message);
                    res.end();
                    return;
                }

                fileData += data.toString('utf-8');

                database = JSON.parse(fileData);
                jsonData = JSON.parse(jsonData);

                database = database.map(item => user.username === item.username ? {
                    name: item.name,
                    username: item.username,
                    password: item.password,
                    state: {
                        todos: jsonData.todos,
                        filter: jsonData.filter
                    }
                } : item);

                fs.writeFile('db.txt', JSON.stringify(database), function (err) {
                    if (err) {
                        res.writeHead(500);
                        res.write(err.message);
                        res.end();
                    }
                });

                res.writeHead(200);
                res.write('successful');
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
                res.write(err.message);
                res.end();
            }
            res.writeHead(200);
            res.write(data);
            res.end();
        });
    }

    function encodeUser(name, username) {
        let key = PRIVATE_KEY.replace('146C334A4A7', '&&&');
        key = key.split("").reverse().join("");
        key = `${key}=${name}&&${username}`;
        let base64data = Buffer.from(key).toString('base64');
        return base64data;
    }

    function checkPrivateKey(jwt) {
        decodeUser(jwt)
        let key = Buffer.from(jwt, 'base64').toString('ascii');
        let i = key.lastIndexOf('=');
        key = key.substr(0, i);
        key = key.split("").reverse().join("");
        key = key.replace('&&&', '146C334A4A7');
        return key === PRIVATE_KEY;
    }

    function decodeUser(jwt) {
        let credential = Buffer.from(jwt, 'base64').toString('ascii');
        let indexOfEqual = credential.lastIndexOf('=');
        credential = credential.substr(indexOfEqual + 1, credential.length - 1);
        let firstIndexOfAnd = credential.indexOf('&');
        let lastIndexOfAnd = credential.lastIndexOf('&');
        let name = credential.substr(0, firstIndexOfAnd);
        let username = credential.substr(lastIndexOfAnd + 1, credential.length - 1);
        let user = {
            username,
            name
        };
        return user;
    }

}