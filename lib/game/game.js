var Board = require('./board');
var MoveChecker = require('./movechecker');
var MoveGenerator = require('./movegenerator');

var RemoteEmitter = require('dnode/events');

module.exports = Game;
Game.prototype = new RemoteEmitter;
function Game () {
    if (!(this instanceof Game)) return new Game;
    var self = this;
    
    var state = new GameState;
    self.board = new Board;
    
    var players = {
        white : null,
        black : null
    };
    
    self.watch = function (cb) {
        self.subscribe(cb);
    };
    
    self.join = function (color, cb) {
        if (color != 'white' && color != 'black') {
            cb(null);
        }
        else if (players[color]) {
            cb(null)
        }
        else {
            var player = new Player(color, self);
            players[color] = player;
            player.on('part', function () {
                self.emit('parted', {
                    name : player.name,
                    color : player.color
                });
                players[color] = null;
                if (players.white == null && players.black == null) {
                    self.emit('end');
                }
            });
            cb(player);
        }
    };
}

function GameState () {
    if (!(this instanceof GameState)) return new GameState;
    var self = this;
    
    self.toMove = 'w'; // white to move
    self.kingMoved = false; // has king moved (if so, can't do castling)
    self.kingInCheck = false; // king in check right now
    self.moves = []; // keep track of the game moves
}

