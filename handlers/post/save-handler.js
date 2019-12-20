var checkPrivateKey = require('../../services/pk-validator');
var decodeUser = require('../../services/decoder');

const fs = require('fs');

var database = [];

function saveHandler(req, res) {
    let jwt = req.headers.jwt;
    let fileData = '',
        jsonData = '';

    if (!checkPrivateKey(jwt)) {
        res.writeHead(401);
        res.write('Action is not allowed!');
        res.end();
        return;
    }

    let user = decodeUser(jwt);

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

            fs.writeFile('./db.txt', JSON.stringify(database), function (err) {
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

module.exports = saveHandler;