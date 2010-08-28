#!/usr/bin/env node
var fs = require('fs');
var connect = require('connect');
var DNode = require('dnode');
var Service = require('./lib/service');

var port = process.argv[2] || 80;

var html = { index : fs.readFileSync(__dirname + '/static/index.html') };
var js = { dnode : require('dnode/web').source() };

var server = connect.createServer(
    connect.staticProvider(__dirname + '/static'),
    connect.staticProvider(__dirname + '/lib'),
    function (req, res) {
        if (req.url == '/scripts/dnode.js') {
            res.writeHead(200, { 'Content-Type' : 'text/javascript' });
            res.end(js.dnode);
        }
        else {
            res.writeHead(200, { 'Content-Type' : 'text/html' });
            res.end(html.index);
        }
    }
).listen(port, '0.0.0.0');

DNode(Service).listen({
    protocol : 'socket.io',
    server : server,
    transports : 'websocket xhr-multipart xhr-polling htmlfile'
        .split(/\s+/),
});
