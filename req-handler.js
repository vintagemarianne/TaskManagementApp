const fs = require('fs');

exports.requestHandler = function requestHandler(req, res) {

    // var routeHandler = ({
    //     'GET': {
    //         '/': rootHandler,
    //         '/download': downloadHandler
    //     },
    //     'POST': {
    //         '/save': saveHandler
    //     }
    // })[req.method][req.url];
    var routeHandler;

    if(req.method === 'GET') {
        switch(req.url){
            case '/':
                routeHandler = rootHandler;
                break;
            case '/download': 
                routeHandler = downloadHandler;
                break;
        }
    } else if(req.method === 'POST') {
            if (req.url === '/save') routeHandler = saveHandler;
    }

    if (!routeHandler) {
        routeHandler = staticFileHandler;
    }

    routeHandler(req, res);


    function rootHandler(req, res) {
        req.url = 'index.html'; 
		staticFileHandler(req, res);
    }

    function downloadHandler() {

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
        fs.readFile('./client/' + req.url, function (err, data) {
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