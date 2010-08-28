var connect = require('connect');
var DNode = require('dnode');

var port = process.argv[2] || 80;

connect.createServer(
    connect.staticProvider(__dirname + '/static'),
    function (req, res) {
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.end('meow');
    }
).listen(port, '0.0.0.0');
