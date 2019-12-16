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
                var jwt = parseCookie('jwt');
                document.location.href = `http://localhost:8080/user/${jwt}`;
                localStorage.setItem('model', xhr.responseText);
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

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function parseCookie(name) {
        var cookie = getCookie(name);
        cookie = atob(cookie);
        return cookie;
    }

}());