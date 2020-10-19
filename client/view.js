(function (app) {
    app.view = {
        init: init,
        render: render,
        changeTab: changeTab
    };

    var _elements, _listeners = {};

    function init(listeners) {
        _listeners.add = listeners[0];
        _listeners.complete = listeners[1];
        _listeners.edit = listeners[2];
        _listeners.delete = listeners[3];
        _listeners.filter = listeners[4];
        _listeners.save = listeners[5];
        _listeners.download = listeners[6];
        _listeners.showElement = listeners[7];
        _listeners.signin = listeners[8];
        _listeners.signup = listeners[9];
        _listeners.signout = listeners[10];
        _listeners.getUsername = listeners[11];

        var el = document.getElementById.bind(document);
        _elements = {
            itemIconSrc: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMi4xOCA1MTIuMTgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTQ0OC4xOCw4MGgtMzIwYy0xNy42NzMsMC0zMiwxNC4zMjctMzIsMzJzMTQuMzI3LDMyLDMyLDMyaDMyMGMxNy42NzMsMCwzMi0xNC4zMjcsMzItMzJTNDY1Ljg1Myw4MCw0NDguMTgsODB6IiBmaWxsPSIjZjNhNTE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik02NC4xOCwxMTJjLTAuMDM2LTguNDczLTMuNDMxLTE2LjU4Ni05LjQ0LTIyLjU2Yy0xMi40ODEtMTIuNDA3LTMyLjYzOS0xMi40MDctNDUuMTIsMCAgICBDMy42MSw5NS40MTQsMC4yMTUsMTAzLjUyNywwLjE4LDExMmMtMC4yMzksMi4wNzMtMC4yMzksNC4xNjcsMCw2LjI0YzAuMzYyLDIuMDg1LDAuOTUyLDQuMTI0LDEuNzYsNi4wOCAgICBjMC44NTksMS44OTUsMS44NzYsMy43MTUsMy4wNCw1LjQ0YzEuMTQ5LDEuNzk0LDIuNDksMy40NTcsNCw0Ljk2YzEuNDU2LDEuNDUsMy4wNjUsMi43MzgsNC44LDMuODQgICAgYzEuNjg1LDEuMjI3LDMuNTEyLDIuMjQ4LDUuNDQsMy4wNGMyLjEyMSwxLjEsNC4zODIsMS45MDgsNi43MiwyLjRjMi4wNzMsMC4yMzIsNC4xNjcsMC4yMzIsNi4yNCwwICAgIGM4LjQ1LDAuMDA3LDE2LjU2LTMuMzI5LDIyLjU2LTkuMjhjMS41MS0xLjUwMywyLjg1MS0zLjE2Niw0LTQuOTZjMS4xNjQtMS43MjUsMi4xODEtMy41NDUsMy4wNC01LjQ0ICAgIGMxLjAyMS0xLjkzMiwxLjgyNi0zLjk3MSwyLjQtNi4wOEM2NC40MTksMTE2LjE2Nyw2NC40MTksMTE0LjA3Myw2NC4xOCwxMTJ6IiBmaWxsPSIjZjNhNTE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik02NC4xOCwyNTZjMC4yMzgtMi4wNzMsMC4yMzgtNC4xNjcsMC02LjI0Yy0wLjU1My0yLjA2NS0xLjM1OS00LjA1My0yLjQtNS45MmMtMC44MjQtMS45NjMtMS44NDMtMy44MzktMy4wNC01LjYgICAgYy0xLjEwOS0xLjc3NC0yLjQ1NS0zLjM4OS00LTQuOGMtMTIuNDgxLTEyLjQwNy0zMi42MzktMTIuNDA3LTQ1LjEyLDBDMy42MSwyMzkuNDE0LDAuMjE1LDI0Ny41MjcsMC4xOCwyNTYgICAgYzAuMDYyLDQuMjE3LDAuODc1LDguMzg4LDIuNCwxMi4zMmMwLjgwMiwxLjg5MywxLjc2NiwzLjcxMywyLjg4LDUuNDRjMS4yMTcsMS43MzksMi42MTEsMy4zNDgsNC4xNiw0LjggICAgYzEuNDE0LDEuNTQyLDMuMDI4LDIuODg4LDQuOCw0YzEuNjg1LDEuMjI4LDMuNTExLDIuMjQ5LDUuNDQsMy4wNGMxLjk1MSwwLjgyMSwzLjk5MiwxLjQxMiw2LjA4LDEuNzYgICAgYzIuMDQ3LDAuNDU5LDQuMTQyLDAuNjc0LDYuMjQsMC42NGMyLjA3MywwLjIzOSw0LjE2NywwLjIzOSw2LjI0LDBjMi4wMzYtMC4zNDksNC4wMjQtMC45NCw1LjkyLTEuNzYgICAgYzEuOTgxLTAuNzg2LDMuODYxLTEuODA3LDUuNi0zLjA0YzEuNzcyLTEuMTEyLDMuMzg2LTIuNDU4LDQuOC00YzEuNTQyLTEuNDE0LDIuODg4LTMuMDI4LDQtNC44YzEuMjMtMS42ODQsMi4yNTEtMy41MSwzLjA0LTUuNDQgICAgYzEuMDkzLTIuMTI0LDEuOS00LjM4NCwyLjQtNi43MkM2NC40MjYsMjYwLjE2Nyw2NC40MjYsMjU4LjA3Myw2NC4xOCwyNTZ6IiBmaWxsPSIjZjNhNTE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik02NC4xOCw0MDBjMC4yMzctMi4wNzMsMC4yMzctNC4xNjcsMC02LjI0Yy0wLjU1My0yLjExNi0xLjM1OS00LjE1Ny0yLjQtNi4wOGMtMC44NTktMS44OTUtMS44NzYtMy43MTUtMy4wNC01LjQ0ICAgIGMtMS4xMTItMS43NzItMi40NTgtMy4zODYtNC00LjhjLTEyLjQ4MS0xMi40MDctMzIuNjM5LTEyLjQwNy00NS4xMiwwYy0xLjU0MiwxLjQxNC0yLjg4OCwzLjAyOC00LDQuOCAgICBjLTEuMTY0LDEuNzI1LTIuMTgxLDMuNTQ1LTMuMDQsNS40NGMtMC44MywxLjk0OC0xLjQyMSwzLjk5LTEuNzYsNi4wOGMtMC40NTEsMi4wNDktMC42NjUsNC4xNDItMC42NCw2LjI0ICAgIGMwLjAzNiw4LjQ3MywzLjQzMSwxNi41ODYsOS40NCwyMi41NmMxLjQxNCwxLjU0MiwzLjAyOCwyLjg4OCw0LjgsNGMxLjY4NSwxLjIyOCwzLjUxMSwyLjI0OSw1LjQ0LDMuMDQgICAgYzEuOTUxLDAuODIxLDMuOTkyLDEuNDEyLDYuMDgsMS43NmMyLjA0NywwLjQ1OSw0LjE0MiwwLjY3NCw2LjI0LDAuNjRjMi4wNzMsMC4yMzksNC4xNjcsMC4yMzksNi4yNCwwICAgIGMyLjAzNi0wLjM0OSw0LjAyNC0wLjk0LDUuOTItMS43NmMxLjk4MS0wLjc4NiwzLjg2MS0xLjgwNyw1LjYtMy4wNGMxLjc3Mi0xLjExMiwzLjM4Ni0yLjQ1OCw0LjgtNCAgICBjMS41NDItMS40MTQsMi44ODgtMy4wMjgsNC00LjhjMS4yMzEtMS42ODMsMi4yNTItMy41MSwzLjA0LTUuNDRjMS4wOTItMi4xMjUsMS44OTktNC4zODQsMi40LTYuNzIgICAgQzY0LjQyNiw0MDQuMTY3LDY0LjQyNiw0MDIuMDczLDY0LjE4LDQwMHoiIGZpbGw9IiNmM2E1MTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTQ4MC4xOCwyMjRoLTM1MmMtMTcuNjczLDAtMzIsMTQuMzI3LTMyLDMyczE0LjMyNywzMiwzMiwzMmgzNTJjMTcuNjczLDAsMzItMTQuMzI3LDMyLTMyUzQ5Ny44NTMsMjI0LDQ4MC4xOCwyMjR6IiBmaWxsPSIjZjNhNTE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik0zMzYuMTgsMzY4aC0yMDhjLTE3LjY3MywwLTMyLDE0LjMyNy0zMiwzMmMwLDE3LjY3MywxNC4zMjcsMzIsMzIsMzJoMjA4YzE3LjY3MywwLDMyLTE0LjMyNywzMi0zMiAgICBDMzY4LjE4LDM4Mi4zMjcsMzUzLjg1MywzNjgsMzM2LjE4LDM2OHoiIGZpbGw9IiNmM2E1MTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+',
            completedIconSrc: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDM1Mi42MiAzNTIuNjIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPHBhdGggZD0iTTMzNy4yMjIsMjIuOTUyYy0xNS45MTItOC41NjgtMzMuNjYsNy45NTYtNDQuMDY0LDE3Ljc0OGMtMjMuODY3LDIzLjI1Ni00NC4wNjMsNTAuMTg0LTY2LjcwOCw3NC42NjQgICBjLTI1LjA5MiwyNi45MjgtNDguMzQ4LDUzLjg1Ni03NC4wNTIsODAuMTczYy0xNC42ODgsMTQuNjg4LTMwLjYsMzAuNi00MC4zOTIsNDguOTZjLTIyLjAzMi0yMS40MjEtNDEuMDA0LTQ0LjY3Ny02NS40ODQtNjMuNjQ4ICAgYy0xNy43NDgtMTMuNDY0LTQ3LjEyNC0yMy4yNTYtNDYuNTEyLDkuMThjMS4yMjQsNDIuMjI5LDM4LjU1Niw4Ny41MTcsNjYuMDk2LDExNi4yOGMxMS42MjgsMTIuMjQsMjYuOTI4LDI1LjA5Miw0NC42NzYsMjUuNzA0ICAgYzIxLjQyLDEuMjI0LDQzLjQ1Mi0yNC40OCw1Ni4zMDQtMzguNTU2YzIyLjY0NS0yNC40OCw0MS4wMDUtNTIuMDIxLDYxLjgxMi03Ny4xMTJjMjYuOTI4LTMzLjA0OCw1NC40NjgtNjUuNDg1LDgwLjc4NC05OS4xNDUgICBDMzI2LjIwNiw5Ni4zOTIsMzc4LjIyNiw0NC45ODMsMzM3LjIyMiwyMi45NTJ6IE0yNi45MzcsMTg3LjU4MWMtMC42MTIsMC0xLjIyNCwwLTIuNDQ4LDAuNjExICAgYy0yLjQ0OC0wLjYxMS00LjI4NC0xLjIyNC02LjczMi0yLjQ0OGwwLDBDMTkuNTkzLDE4NC41MiwyMi42NTMsMTg1LjEzMiwyNi45MzcsMTg3LjU4MXoiIGZpbGw9IiM2ZGJjOGYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+",
            inputField: el("input"),
            list: el('list'),
            addBtn: el('addBtn'),
            tabs: el('tabBar'),
            addTaskBtn: el('addTaskBtn'),
            editModal: el('editModal'),
            addTaskModal: el('addTaskModal'),
            editInputField: el('modalInput'),
            modalBtn: el('modalBtn'),
            closeEditModalIcon: el('closeEditModalIcon'),
            closeAddModalIcon: el('closeAddModalIcon'),
            tab0: el('tab0'),
            tab1: el('tab1'),
            tab2: el('tab2'),
            saveBtn: el('saveBtn'),
            downloadBtn: el('downloadBtn'),
            signupBtn: el('signupBtn'),
            signinBtn: el('signinBtn'),
            signoutBtn: el('signoutBtn'),
            userName: el('userName')
        };

        _elements.closeEditModalIcon.addEventListener('click', closeEditModal);
        _elements.closeAddModalIcon.addEventListener('click', closeAddTaskModal);
        _elements.addTaskBtn.addEventListener('click', openAddTaskModal);
        _elements.addBtn.addEventListener('click', addTodo);
        _elements.tabs.addEventListener('click', filter);
        _elements.saveBtn.addEventListener('click', save);
        _elements.downloadBtn.addEventListener('click', download);
        _elements.signupBtn.addEventListener('click', signup);
        _elements.signinBtn.addEventListener('click', signin);
        _elements.signoutBtn.addEventListener('click', signout);

        if (_listeners.showElement()) {
            _elements.signinBtn.style.display = 'none';
            _elements.signupBtn.style.display = 'none';
            showName();
        } else {
            _elements.saveBtn.style.display = 'none';
            _elements.downloadBtn.style.display = 'none';
            _elements.signoutBtn.style.display = 'none';
            _elements.userName.style.display = 'none';
        }
    }


    function render(todos, filter) {
        if (!todos.length) {
            switch (filter) {
                case 0:
                    _elements.list.innerHTML = "<div class='default-item'>Nothing to do.</div>";
                    break;
                case 1:
                    _elements.list.innerHTML = "<div class='default-item inprogress-default-item'>Nothing in progress.</div>";
                    break;
                case 2:
                    _elements.list.innerHTML = "<div class='default-item completed-default-item'>Nothing completed.</div>";
                    break;
            }
            return;
        }
        _elements.list.innerHTML = '';
        createList(todos);
    }

    function showName() {
        _elements.userName.innerHTML += ' ' + _listeners.getUsername();
    }

    function closeEditModal() {
        _elements.editModal.style.display = 'none';
    }

    function closeAddTaskModal() {
        _elements.addTaskModal.style.display = 'none';
    }

    function openAddTaskModal() {
        _elements.addTaskModal.style.display = 'flex';
    }

    function openModal() {
        _elements.editModal.style.display = 'flex';
    }

    function signout() {
        _listeners.signout();
    }

    function signin() {
        _listeners.signin();
    }

    function signup() {
        _listeners.signup();
    }

    function addTodo(e) {
        e.preventDefault();
        var value = _elements.inputField.value;
        if (!value) {
            alert("Task couldn't be empty");
            return;
        };

        _listeners.add(value);
        _elements.inputField.value = '';
        closeAddTaskModal();
    }

    function editTodo(item) {
        _elements.modalBtn.addEventListener('click', function (e) {
            var value = _elements.editInputField.value;
            if (!value) {
                alert("Task couldn't be empty");
                return;
            };

            _listeners.edit(item, value);
            _elements.editInputField.value = '';
            closeEditModal();
        })
    }

    function save() {
        _listeners.save();
    }

    function download() {
        _listeners.download();
    }

    function filter(e) {
        _listeners.filter(parseInt(e.target.getAttribute('value')));
        changeTab(e.target.getAttribute('value'));
    }

    function changeTab(v) {
        switch (v) {
            case '0':
                _elements.tab1.className = _elements.tab1.className.replace(" active-tab", "");
                _elements.tab2.className = _elements.tab2.className.replace(" active-tab", "");
                _elements.tab0.className += " active-tab";
                break;
            case '1':
                _elements.tab0.className = _elements.tab0.className.replace(" active-tab", "");
                _elements.tab2.className = _elements.tab2.className.replace(" active-tab", "");
                _elements.tab1.className += " active-tab";
                break;
            case '2':
                _elements.tab0.className = _elements.tab0.className.replace(" active-tab", "");
                _elements.tab1.className = _elements.tab1.className.replace(" active-tab", "");
                _elements.tab2.className += " active-tab";
                break;
        }
    }

    function createElement(tag, className) {
        const element = document.createElement(tag);
        element.className = className;
        return element;
    }

    function createTodoItem(item) {
        const listItem = createElement("div", "item"),
            taskTitleWrapper = createElement("div", "task-title-wrapper"),
            taskControlsWrapper = createElement("div", "task-controls-wrapper"),
            itemIcon = createElement("img", "item-icon"),
            taskTitle = createElement("div", "task-title"),
            completeBtn = createElement("div", "btn complete-btn"),
            editBtn = createElement("div", "btn edit-btn"),
            deleteBtn = createElement("div", "btn delete-btn");

        itemIcon.src = item.completed ? _elements.completedIconSrc : _elements.itemIconSrc;

        deleteBtn.title = "Delete";
        completeBtn.title = "Completed";
        editBtn.title = "Edit";

        deleteBtn.addEventListener('click', function (e) {
            _listeners.delete(item);
        });

        completeBtn.addEventListener('click', function (e) {
            _listeners.complete(item);
        });

        editBtn.addEventListener('click', function (e) {
            openModal();
            editTodo(item);
        });

        taskTitle.textContent = item.title;

        taskTitleWrapper.append(itemIcon);
        taskTitleWrapper.append(taskTitle);

        taskControlsWrapper.append(completeBtn);
        taskControlsWrapper.append(editBtn);
        taskControlsWrapper.append(deleteBtn);

        listItem.append(taskTitleWrapper);
        listItem.append(taskControlsWrapper);

        return listItem;
    }

    function createList(items) {
        items.forEach(item => {
            _elements.list.prepend(createTodoItem(item));
        })
        if (!_elements.list.hasChildNodes())
            _elements.list.innerHTML = "<div class='default-item'>Nothing to do.</div>";
    }

}(app));