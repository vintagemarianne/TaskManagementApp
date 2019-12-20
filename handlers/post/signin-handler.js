var encodeUser = require('../../services/encoder');

const fs = require('fs');

var database = [];

function sigininHandler(req, res) {
    var jsonData = '',
        fileData = '';

    req.on('data', data => {
        jsonData += data.toString('utf-8')
    });

    req.on('end', () => {
        fs.readFile('./db.txt', function (err, data) {
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

                fs.writeFile('./db.txt', JSON.stringify(database), function (err) {
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

module.exports = sigininHandler;