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

module.exports = decodeUser;