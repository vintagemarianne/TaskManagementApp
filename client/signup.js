(function () {

    var el = document.getElementById.bind(document),
        _elements = {
            submitBtn: el('signupBtn'),
            fullname: el('fullnameInput'),
            username: el('usernameInput'),
            password: el('passwordInput'),
            signinBtn: el('signinBtn'),
            guestBtn: el('guestBtn')
        };

    _elements.submitBtn.addEventListener('click', signup);
    _elements.signinBtn.addEventListener('click', redirectToSigninPage);
    _elements.guestBtn.addEventListener('click', signinAsGuest);

    function signup(e) {

        if(!_elements.fullname.value) {
            alert('Please enter your full name.');
            return;
        }

        if(!_elements.username.value) {
            alert('Please enter your username.');
            return;
        }

        if(!_elements.password.value) {
            alert('Password is neccessary');
            return;
        }

        if(_elements.password.value.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        var data = {
            name: _elements.fullname.value,
            username: _elements.username.value,
            password: _elements.password.value
        };

        data = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                alert('Signed up successfully!');
                let jwt = parseJWT(xhr.getResponseHeader('jwt'));
                document.location.href = `http://localhost:8080/user/${jwt}`;
                localStorage.setItem('model', '{"todos":[],"filter":0}');
                localStorage.setItem('jwt', xhr.getResponseHeader('jwt'));
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                alert(xhr.responseText);
            }
        }
        xhr.open('POST', 'signup', true);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send(data);
    }

    function redirectToSigninPage() {
        document.location.href = 'http://localhost:8080/signin';
    }

    function signinAsGuest() {
        document.location.href = 'http://localhost:8080/user';
        localStorage.setItem('model', '{"todos":[],"filter":0}');
    }

    function parseJWT(jwt) {
        return atob(jwt);
    }
}());