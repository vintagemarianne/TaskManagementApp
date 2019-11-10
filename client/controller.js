(function (app) {
    app.controller = {
        init: init
    };

    var _model;
    function init() {
        var jsonModel = app.localStorage.get('model');
        if(jsonModel) {
            _model = jsonModel;
        } else {
            _model = { todos: [], filter: 0};
        }
        app.view.init([addTodo, completeTodo, editTodo, deleteTodo, filterTodos, saveTodos]);
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
        app.request.set(app.localStorage.get('model'))
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