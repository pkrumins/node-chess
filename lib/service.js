var Game = require('./game/game');
var RemoteEmitter = require('dnode/events');
var Hash = require('traverse/hash');

var games = new RemoteEmitter;
games['abcdef'] = new Game;
games['012345'] = new Game;
games['a0b1c2'] = new Game;

module.exports = Service;
function Service (client, conn) {
    var self = this;
    
    var attached = Hash.map(games, function (game) {
        return RemoteEmitter.attach(conn, game);
    }).attach(conn);
    
    self.games = function (cb) {
        cb(Hash(games).map(function (game, key) {
            return {
                id : key,
                pieces : game.board.pieces
            };
        }).values);
    };
    
    self.createGame = function (cb) {
        do {
            var id = 'xxxxxx'.split('')
                .map(function () {
                    return '0123456789abcdef'.charAt(Math.random() * 16)
                });
        } while (id in games);
        var game = new Game;
        game.on('end', function f () {
            game.removeListener('end', f);
            games.emit('deleted', id);
            delete games[game];
        });
        games[id] = game;
        
        cb(id);
        games.emit('created', id);
    };
    
    self.subscribe = function (cb) { attached.subscribe(cb) };
    
    self.watchAll = function (cb) {
        Hash(attached)
        attached.forEach(function (game) {
            game.subscribe(cb);
        });
    };
}
