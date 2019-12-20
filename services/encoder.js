const PRIVATE_KEY = "71E300F146C334A4A76E41484282A5F4";

function encodeUser(name, username) {
    let key = PRIVATE_KEY.replace('146C334A4A7', '&&&');
    key = key.split("").reverse().join("");
    key = `${key}=${name}&&${username}`;
    let base64data = Buffer.from(key).toString('base64');
    return base64data;
}

module.exports = encodeUser;