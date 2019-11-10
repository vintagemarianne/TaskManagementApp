const http = require('http');
const requestHandler = require('./req-handler').requestHandler;
const fs = require('fs');

http.createServer(requestHandler).listen(8080);

