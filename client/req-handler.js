(function(app){
    app.request = {
        get: getData,
        set: setData
    };

    function getData() {

    }

    function setData(model) {
        var request = new XMLHttpRequest();
        var data = JSON.stringify({
            'todos': model.todos,
            'filter': model.filter
        });
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                alert('saved successfully.');
            }
        }
        request.open('POST', 'save', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(data);
    }
}(app));