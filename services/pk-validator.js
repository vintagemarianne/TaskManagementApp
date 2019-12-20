var decodeUser = require('./decoder');

const PRIVATE_KEY = "71E300F146C334A4A76E41484282A5F4";

function checkPrivateKey(jwt) {
    decodeUser(jwt)
    let key = Buffer.from(jwt, 'base64').toString('ascii');
    let i = key.lastIndexOf('=');
    key = key.substr(0, i);
    key = key.split("").reverse().join("");
    key = key.replace('&&&', '146C334A4A7');
    return key === PRIVATE_KEY;
}

module.exports = checkPrivateKey;