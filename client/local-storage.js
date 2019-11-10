(function(app){
    app.localStorage = {
        get: getLocalStorage,
        set: setLocalStorage
    };

    function getLocalStorage(item) {
        return JSON.parse(localStorage.getItem(item));
    }

    function setLocalStorage(item, obj) {
        localStorage.setItem(item, JSON.stringify(obj));
    }

}(app))