var Game = require('./game/game');
var RemoteEmitter = require('dnode/events');
var Hash = require('traverse/hash');

var games = new RemoteEmitter;
games.hash = {};

var users = {};

module.exports = Service;
function Service (client, conn) {
    var self = this;
    var user = { name : null };
    
    var gamesAttached = games.attach(conn);
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
    
    self.createGame = function (color, cb) {
        if (!cb) return;
        if (color != 'white' && color != 'black') {
            cb('Quit making up colors.');
        }
        if (!user.name) {
            cb('You must set your name first');
        }
        
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
        
        user.player = game.join(user.name, color);
        cb({
            id : id,
            players : {
                white : color == 'white' ? {
                    name : user.name,
                    color : 'white',
                } : null,
                black : color == 'black' ? {
                    name : user.name,
                    color : 'black'
                } : null
            },
            pieces : game.board.pieces
        });
        games.emit('created', id);
    };
    
    self.joinGame = function (id, color, cb) {
        if (!user.name) {
            cb("You haven't set a name yet!");
            return;
        }
        if (user.player) {
            cb("You're already in a game!");
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
        
        if (cb) cb(null);
    };
    
    self.subscribe = function (cb) { gamesAttached.subscribe(cb) };
    
    self.watchAll = function (cb) {
        Hash(attached).forEach(function (game) {
            game.subscribe(function (em) {
                cb(game.id, em);
            });
        });
    };
    
    conn.on('end', function () {
        if (user.player) user.player.quit();
    });
}

