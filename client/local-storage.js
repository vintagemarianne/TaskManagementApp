(function(app){
    app.localStorage = {
        get: getLocalStorage,
        set: setLocalStorage,
        reset: resetLocalStorage
    };

    function getLocalStorage(item) {
        return item === 'jwt' ? localStorage.getItem(item) : JSON.parse(localStorage.getItem(item));
    }

    function setLocalStorage(item, obj) {
        localStorage.setItem(item, JSON.stringify(obj));
    }

    function resetLocalStorage() {
        localStorage.clear();
    }

}(app))