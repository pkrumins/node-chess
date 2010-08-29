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
    
    var attached = games.attach(conn);
    
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
            return;
        }
        
        if (user.name) {
            games.emit('rename', user.name, name);
            delete users[user.name];
            Hash(games.hash).forEach(function (game) {
                var white = game.players.white;
                if (white && white.name == user.name) {
                    white.name = name;
                }
                
                var black = game.players.black;
                if (black && black.name == user.name) {
                    black.name = name;
                }
            });
        }
        
        user.name = name;
        users[name] = user;
        
        if (cb) cb(null);
    };
    
    self.createGame = function (color, cb) {
        if (!cb) return;
        if (color != 'white' && color != 'black') {
            cb('Quit making up colors.');
            return;
        }
        if (!user.name) {
            cb('You must set your name first');
            return;
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
            delete games.hash[id];
        });
        
        game.on('join', function (p) {
            games.emit('joined', id, p)
        });
        
        game.on('part', function (p) {
            games.emit('parted', id, p)
        });
        
        game.on('move', function (sx, sy, dx, dy) {
            games.emit('moved', id, sx, sy, dx, dy);
        });
        
        games.hash[id] = game;
        
        user.player = game.join(user.name, color);
        var rep = {
            id : id,
            players : {
                white : (color == 'white' ? {
                    name : user.name,
                    color : 'white',
                } : null),
                black : (color == 'black' ? {
                    name : user.name,
                    color : 'black'
                } : null)
            },
            pieces : game.board.pieces
        };
        cb(null, rep);
        games.emit('created', rep);
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
    
    self.subscribe = function (cb) { attached.subscribe(cb) };
    
    conn.on('end', function () {
        if (user.player) user.player.quit();
    });
}

