var encodeUser = require('../../services/encoder');

const fs = require('fs');

var database = [];

function signupHandler(req, res) {
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

            fs.writeFile('./db.txt', JSON.stringify(database), function (err) {
                if (err) {
                    res.writeHead(500);
                    res.write(err.message);
                    res.end();
                    return;
                }
                res.writeHead(200, {
                    'jwt': `${jwt}`
                });
                res.write('successful');
                res.end();
            });

        });

    });
}

module.exports = signupHandler;