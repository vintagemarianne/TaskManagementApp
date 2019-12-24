var handlers = require('./handlers');

exports.requestHandler = function requestHandler(req, res) {

    var routeHandler;

    routeHandler = ({
        GET: {
            '/': handlers.rootProvider,
            '/user/download': handlers.downloadProvider,
            '/signin': handlers.signinProvider,
            '/signup': handlers.signupProvider,
            '/user': handlers.userProvider
        },
        POST: {
            '/signup': handlers.signupHandler,
            '/signin': handlers.signinHandler,
            '/user/save': handlers.saveHandler
        }
    })[req.method][req.url];

    if (req.url.match(/^\/user\/\d+/)) routeHandler = handlers.userProvider;

    (routeHandler || handlers.fileProvider)(req, res);
}