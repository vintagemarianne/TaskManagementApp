(function () {

    var el = document.getElementById.bind(document),
        _elements = {
            signinBtn: el('signinBtn'),
            username: el('usernameInput'),
            password: el('passwordInput'),
            signupBtn: el('signupBtn')
        };

    _elements.signinBtn.addEventListener('click', signin);
    _elements.signupBtn.addEventListener('click', redirectToSignupPage);

    function signin(e) {
        
        var data = {
            username: _elements.username.value,
            password: _elements.password.value
        };

        data = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                alert('Signed in successfully!');
                document.location.href = 'http://localhost:8080/user';
            } else if (xhr.readyState === 4 && xhr.status === 500) {
                alert(xhr.responseText);
            }
        }
        xhr.open('POST', 'signin', true);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send(data);
    }

    function redirectToSignupPage() {
        document.location.href = 'http://localhost:8080/signup';
    }

}());