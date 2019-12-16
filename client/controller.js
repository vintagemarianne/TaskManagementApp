(function (app) {
    app.controller = {
        init: init,
        render: render
    };

    var _model;
    function init() {
        var jsonModel = app.localStorage.get('model');
        if(jsonModel) {
            _model = jsonModel;
        } else {
            _model = { todos: [], filter: 0};
        }
        app.view.init([addTodo, completeTodo, editTodo, deleteTodo, filterTodos, saveTodos, downloadTodos]);
        render();
        app.view.changeTab(_model.filter + '');
    }

    function addTodo(value) {
        if (!value) return;
        _model.todos.push({ id: _model.todos.length === 0 ? 1 : _model.todos[_model.todos.length - 1].id + 1,
             title: value });
        render();
    }

    function completeTodo(todo) {
        todo.completed = !todo.completed;
        render();
    }

    function editTodo(todo, value) {
        todo.title = value;
        render();
    }

    function deleteTodo(todo) {
        _model.todos = _model.todos.filter( item => {
            return item.id !== todo.id;
        });
        render();
    }

    function filterTodos(filter) {
        _model.filter = filter;
        render();
    }

    function saveTodos() {
        var request = new XMLHttpRequest();
        var jwt = btoa(app.cookie.get('jwt'));
        var data = JSON.stringify({
            'todos': _model.todos,
            'filter': _model.filter
        });
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                alert('saved successfully.');
            } else if (request.readyState === 4 && request.status === 500) {
                alert(request.responseText);
            }
        }
        request.open('POST', 'save', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('jwt', jwt);
        request.send(data);
    }

    function downloadTodos() {
        var request = new XMLHttpRequest();
        var jwt = btoa(app.cookie.get('jwt'));
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                alert('downloaded successfully.');
                _model = JSON.parse(request.responseText);
                render();
            } else if (request.readyState === 4 && request.status === 500) {
                alert(request.responseText);
            }
        }
        request.open('GET', 'download', true);
        request.setRequestHeader('jwt', jwt);
        request.send();
    }


    function render() {
        app.localStorage.set('model', _model);

        var filter = _model.filter,
            filteredTodos = _model.todos.filter(function (t) {
                if (filter === 0) return true;
                return filter === 1 ? !t.completed : t.completed;
            });
        app.view.render(filteredTodos, filter);
    }

}(app));