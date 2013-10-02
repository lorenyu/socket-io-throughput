requirejs.config({
    baseUrl: 'js',
    shim: {
        'lib/underscore': {
            exports: '_'
        }
    },
    paths: {
        'jquery': 'lib/jquery-1.10.2', // jquery is a named module that needs to be named "jquery"
        'lib/socket.io': '../socket.io/socket.io.js'
    }
});

requirejs([
    'views/AppView'
], function(AppView) {

    new AppView($(document.body)).run();
});