#!/usr/bin/env node
require.paths.unshift(process.env.HOME + '/.node_libraries');

var fs = require('fs');
var connect = require('connect');
var DNode = require('dnode');
var Service = require('./lib/service');

var port = process.argv[2] || 80;

var html = { index : fs.readFileSync(__dirname + '/static/index.html') };

// All javascript into one file for MOAR FASTAR page loads
var js = [
    require('dnode/web').source(),
    ('render/vendor/jquery-min render/vendor/raphael-min'
    + ' events game/square game/board game/movegenerator game/player game/game'
    + ' render/thumbnail render/viewer client')
    .split(/\s+/).map(function (filename) {
        return fs.readFileSync(__dirname + '/lib/' + filename + '.js')
            .toString()
            .replace(/^(module|exports)\..*/mg, '')
            .replace(/^var \S+\s*=\s*require\(.*/mg, '')
        ;
    }).join('\n')
].join('\n');

var server = connect.createServer(
    connect.staticProvider(__dirname + '/static'),
    function (req, res) {
        if (req.url == '/bundle.js') {
            res.writeHead(200, { 'Content-Type' : 'text/javascript' });
            res.end(js);
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

