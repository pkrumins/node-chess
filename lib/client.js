function Client (server) { }

DNode(Client).connect(function (server) {
    server.test(function (msg) {
        $('#meow').text(msg);
    });
});
