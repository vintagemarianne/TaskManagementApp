const http = require('http');
const requestHandler = require('./req-handler').requestHandler;

http.createServer(requestHandler).listen(8080);

