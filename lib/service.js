var Game = require('./game/game');
var RemoteEmitter = require('dnode/events');
var Hash = require('traverse/hash');

var games = new RemoteEmitter;
games.hash = {
    'abcdef' : new Game,
    '012345' : new Game,
    'x' : new Game,
    'y' : new Game,
    'z' : new Game,
};

var users = {};

module.exports = Service;
function Service (client, conn) {
    var self = this;
    var user = { name : null };
    
    var attached = Hash.map(games.hash, function (game, key) {
        game.id = key;
        return game.attach(conn);
    });
    
    self.games = function (cb) {
        cb(Hash(games.hash).map(function (game, key) {
            var white = game.players.white;
            var black = game.players.black;
            return {
                id : key,
                players : {
                    white : white ? {
                        name : white.name,
                        color : 'white',
                    } : null,
                    black : black ? {
                        name : black.name,
                        color : 'black'
                    } : null
                },
                pieces : game.board.pieces
            };
        }).values);
    };
    
    self.name = function (name, cb) {
        if (name in users) {
            if (cb) cb('Somebody is already logged in as "' + name + '"');
        }
        else {
            user = { name : name };
            users[name] = user;
            if (cb) cb(null);
        }
    };
    
    self.createGame = function (cb) {
        do {
            var id = 'xxxxxx'.split('').map(function () {
                return '0123456789abcdef'.charAt(Math.random() * 16)
            }).join('');
        } while (id in games.hash);
        var game = new Game;
        game.on('end', function f () {
            game.removeListener('end', f);
            games.emit('deleted', id);
            delete games.hash[game];
        });
        games.hash[id] = game;
        
        cb(id);
        games.emit('created', id);
    };
    
    self.joinGame = function (id, color, cb) {
        if (!user.name) {
            cb("You haven't set a name yet!");
            return;
        }
        if (!(id in games.hash)) {
            cb("That game (" + id + ") doesn't exist!");
            return;
        }
        if (color != 'white' && color != 'black') {
            cb('You just made that color up.');
            return;
        }
        
        var game = games.hash[id];
        if (game.players[color]) {
            cb('There is already a player with that color!');
            return;
        }
        
        user.player = game.join(user.name, color);
        game.emit('joined', { color : color, name : user.name });
        
        if (cb) cb(null);
    };
    
    self.subscribe = function (cb) { games.subscribe(cb) };
    
    self.watchAll = function (cb) {
        Hash(attached).forEach(function (game) {
            game.subscribe(function (em) {
                cb(game.id, em);
            });
        });
    };
    
    conn.on('end', function () {
        [client.name];
    });
}
