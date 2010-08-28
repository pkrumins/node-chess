var Game = require('./game/game');
var RemoteEmitter = require('dnode/events');
var Hash = require('traverse/hash');

var games = new RemoteEmitter;
games.hash = {
    'abcdef' : new Game,
    '012345' : new Game,
    'a0b1c2' : new Game,
};

module.exports = Service;
function Service (client, conn) {
    var self = this;
    
    var attached = RemoteEmitter.attach(conn, games.hash);
    
    self.games = function (cb) {
        cb(Hash(games.hash).map(function (game, key) {
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
        } while (id in games.hash);
        var game = new Game;
        game.on('end', function f () {
            game.removeListener('end', f);
            games.emit('deleted', id);
            delete games.hash[game];
        });
        games[id] = game;
        
        cb(id);
        games.emit('created', id);
    };
    
    self.subscribe = function (cb) { games.subscribe(cb) };
    
    self.watchAll = function (cb) {
        Hash(attached).forEach(function (game) {
var sys = require('sys');
console.log('game = ' + sys.inspect(game));
            game.subscribe(function (em) {
                cb(game.id, em);
            });
        });
    };
}
