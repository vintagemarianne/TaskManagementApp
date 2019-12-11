(function () {

    var el = document.getElementById.bind(document),
        _elements = {
            submitBtn: el('signupBtn'),
            fullname: el('fullnameInput'),
            username: el('usernameInput'),
            password: el('passwordInput'),
            signinBtn: el('signinBtn')
        };

    _elements.submitBtn.addEventListener('click', signup);
    _elements.signinBtn.addEventListener('click', redirectToSigninPage);

    function signup(e) {
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
                var userId = getCookie('userId');
                document.location.href = `http://localhost:8080/user/${userId}`;
                // document.location.href = `http://localhost:8080/user`;
            } else if (xhr.readyState === 4 && xhr.status === 500) {
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

}());