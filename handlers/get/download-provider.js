var decodeUser = require('../../services/decoder');
var checkPrivateKey = require('../../services/pk-validator');

const fs = require('fs');

var database = [];

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

    fs.readFile('./db.txt', function (err, data) {
        if (err) {
            res.writeHead(500);
            res.write(err.message);
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
        responseData = JSON.stringify(responseData);
        res.write(responseData);
        res.end();
    });
}

module.exports = downloadProvider;